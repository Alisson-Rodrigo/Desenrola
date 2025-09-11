using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Services
{

    /// <summary>
    /// Serviço responsável pela geração e validação de tokens JWT e de redefinição de senha.
    /// </summary>
    /// <remarks>
    /// Utiliza configurações do <c>appsettings.json</c> (seção <c>Jwt</c>) para emitir tokens JWT
    /// e integra-se com o <see cref="IIdentityAbstractor"/> e <see cref="IDistributedCache"/> 
    /// para lidar com tokens de recuperação de senha.
    /// </remarks>
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly IIdentityAbstractor _identityAbstractor;
        private readonly IDistributedCache _cache;

        public TokenService(IConfiguration configuration, IIdentityAbstractor identityAbstractor, IDistributedCache cache)
        {
            _configuration = configuration;
            _identityAbstractor = identityAbstractor;
            _cache = cache;
        }

        public string GenerateJwtToken(Domain.Entities.User user, IList<string> roles)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];



            var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Email, user.Email!)
        };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<string> GetIdentityResetToken(string email)
        {
            return await _cache.GetStringAsync($"reset-token:{email}");
        }

        public async Task<string> GeneratePasswordResetToken(Domain.Entities.User user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];


            var identityToken = await _identityAbstractor.GeneratePasswordResetTokenAsync(user);
            // 2. Armazena o token do Identity no cache com expiração
            var cacheKey = $"reset-token:{user.Email}";
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
            };
            await _cache.SetStringAsync(cacheKey, identityToken, cacheOptions);

            var claims = new List<Claim>
                {
                    new(ClaimTypes.Email, user.Email!),
                    new("purpose", "password_reset"),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(30), // Tempo de vida curto para tokens de reset
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool ValidatePasswordResetToken(string token, out ClaimsPrincipal principal)
        {
            principal = null!;
            try
            {
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];


                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                principal = tokenHandler.ValidateToken(token, validationParameters, out _);

                // Verifica se é um token de reset
                var isResetToken = principal.HasClaim(c => c.Type == "purpose" && c.Value == "password_reset");
                var hasEmail = principal.HasClaim(c => c.Type == ClaimTypes.Email);

                if (!isResetToken || !hasEmail)
                {
                    return false;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
