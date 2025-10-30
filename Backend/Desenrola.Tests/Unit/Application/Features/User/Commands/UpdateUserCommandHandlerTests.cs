using System.Threading;
using System.Threading.Tasks;
using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.User.Commands.UpdateUserCommand;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Moq;
using Xunit;
using Microsoft.AspNetCore.Identity;
using MediatR;

namespace Desenrola.Tests.Unit.Application.Features.User.Commands
{
    public class UpdateUserCommandHandlerTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly Mock<IIdentityAbstractor> _identityAbstractorMock = new();
        private readonly Mock<ILogged> _loggedMock = new();
        private readonly UpdateUserCommandHandler _sut;

        public UpdateUserCommandHandlerTests()
        {
            _sut = new UpdateUserCommandHandler(
                _userRepositoryMock.Object,
                _loggedMock.Object,
                _identityAbstractorMock.Object
            );
        }

        private static Desenrola.Domain.Entities.User CreateFakeUser() =>
            new Desenrola.Domain.Entities.User
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "old_user",
                Email = "old@email.com",
                Name = "Old Name"
            };

        [Fact(DisplayName = "Given no logged user should throw BadRequestException")]
        public async Task Handle_WhenUserNotLogged_ShouldThrowBadRequestException()
        {
            // Arrange
            _loggedMock.Setup(x => x.UserLogged())
                .ReturnsAsync((Desenrola.Domain.Entities.User?)null);

            var command = new UpdateUserCommand
            {
                Name = "New",
                Email = "new@email.com",
                UserName = "newuser"
            };

            // Act
            Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

            // Assert
            await action.Should().ThrowAsync<BadRequestException>()
                .WithMessage("Usuário não autenticado");
        }

        [Fact(DisplayName = "Given valid data should update successfully")]
        public async Task Handle_WhenDataIsValid_ShouldReturnUnit()
        {
            // Arrange
            var user = CreateFakeUser();

            _loggedMock.Setup(x => x.UserLogged())
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(x => x.GetById(user.Id))
                .ReturnsAsync(user);

            _identityAbstractorMock.Setup(x => x.SetUserNameAsync(user, It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            _identityAbstractorMock.Setup(x => x.SetEmailAsync(user, It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            _identityAbstractorMock.Setup(x => x.UpdateUserAsync(user))
                .ReturnsAsync(IdentityResult.Success);

            var command = new UpdateUserCommand
            {
                Name = "New Name",
                Email = "new@email.com",
                UserName = "newuser"
            };

            // Act
            var result = await _sut.Handle(command, CancellationToken.None);

            // Assert
            result.Should().Be(MediatR.Unit.Value);

            _identityAbstractorMock.Verify(x => x.SetUserNameAsync(user, command.UserName), Times.Once);
            _identityAbstractorMock.Verify(x => x.SetEmailAsync(user, command.Email), Times.Once);
            _identityAbstractorMock.Verify(x => x.UpdateUserAsync(user), Times.Once);
        }
    }
}
