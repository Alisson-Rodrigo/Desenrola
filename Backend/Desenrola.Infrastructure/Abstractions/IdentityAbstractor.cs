using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Infrastructure.Abstractions;


/// <summary>
/// This is a abstraction of the Identity library, creating methods that will interact with 
/// it to create and update users
/// </summary>
public class IdentityAbstractor : IIdentityAbstractor
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public IdentityAbstractor(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        RoleManager<IdentityRole> roleManager
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
    }

    public async Task<User?> FindUserByEmailAsync(string email) => await _userManager.FindByEmailAsync(email);

    public async Task<User?> FindByNameAsync(string username)
    {
        return await _userManager.FindByNameAsync(username);
    }

    public async Task<SignInResult> CheckPasswordSignInAsync(User user, string password)
    {
        return await _signInManager.CheckPasswordSignInAsync(user, password, false);
    }

    public async Task<IdentityResult> ResetPasswordAsync(User user, string decodedToken, string newPassword)
    {
        return await _userManager.ResetPasswordAsync(user, decodedToken, newPassword);
    }

    public async Task<IList<string>> GetRolesAsync(User user)
    {
        return await _userManager.GetRolesAsync(user);
    }

    public async Task<User?> FindUserByIdAsync(string userId) => await _userManager.FindByIdAsync(userId);

    public async Task<IList<string>> GetUserRolesAsync(User user) => await _userManager.GetRolesAsync(user);

    public async Task<IdentityResult> CreateUserAsync(User partnerUser, string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new ArgumentException($"{nameof(password)} cannot be null or empty", nameof(password));
        }

        if (string.IsNullOrEmpty(partnerUser.Email))
        {
            throw new ArgumentException($"{nameof(User.Email)} cannot be null or empty", nameof(partnerUser));
        }

        return await _userManager.CreateAsync(partnerUser, password);
    }
    public async Task<SignInResult> PasswordSignInAsync(User user, string password)
        => await _signInManager.PasswordSignInAsync(user, password, false, false);

    public async Task<IdentityResult> DeleteUser(User user) => await _userManager.DeleteAsync(user);

    public async Task<IdentityResult> AddToRoleAsync(User user, UserRoles role)
    {
        if (await _roleManager.RoleExistsAsync(role.ToString()) is false)
        {
            await _roleManager.CreateAsync(new IdentityRole { Name = role.ToString() });
        }

        return await _userManager.AddToRoleAsync(user, role.ToString());
    }
    public async Task<string> GeneratePasswordResetTokenAsync(User user)
    {
        return await _userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<(IEnumerable<User>, int)> GetPagedUsersAsync(int page, int pageSize)
    {
        int skip = (page - 1) * pageSize;

        var totalUsers = await _userManager.Users.CountAsync();

        var users = await _userManager.Users
            .OrderBy(u => u.Name) // ou u.UserName, se preferir
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        return (users, totalUsers);
    }
}
