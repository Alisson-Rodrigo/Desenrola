using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.User.Commands.DeleteUserCommand;
using Desenrola.Domain.Exception;
using FluentAssertions;
using MediatR;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Xunit;

namespace Desenrola.Tests.Unit.Application.Features.User.Commands
{
    public class DeleteUserCommandHandlerTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly Mock<ILogged> _loggedMock = new();
        private readonly DeleteUserCommandHandler _sut;

        public DeleteUserCommandHandlerTests()
        {
            _sut = new DeleteUserCommandHandler(_userRepositoryMock.Object, _loggedMock.Object);
        }

        private static Desenrola.Domain.Entities.User CreateFakeUser() =>
            new Desenrola.Domain.Entities.User
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "user_test",
                Email = "test@email.com",
                Name = "Test User"
            };

        // ----------------------------------------------------
        // 1️⃣ Usuário não autenticado
        // ----------------------------------------------------
        [Fact(DisplayName = "Given no logged user should throw BadRequestException")]
        public async Task Handle_WhenUserNotLogged_ShouldThrowBadRequestException()
        {
            // Arrange
            _loggedMock.Setup(x => x.UserLogged())
                .ReturnsAsync((Desenrola.Domain.Entities.User?)null);

            var command = new DeleteUserCommand();

            // Act
            Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

            // Assert
            await action.Should().ThrowAsync<BadRequestException>()
                .WithMessage("Usuário não autenticado");

            _userRepositoryMock.Verify(x => x.Delete(It.IsAny<Desenrola.Domain.Entities.User>()), Times.Never);
        }

        // ----------------------------------------------------
        // 2️⃣ Exclusão bem-sucedida
        // ----------------------------------------------------
        [Fact(DisplayName = "Given valid logged user should delete and return Unit.Value")]
        public async Task Handle_WhenUserLogged_ShouldDeleteSuccessfully()
        {
            // Arrange
            var user = CreateFakeUser();

            _loggedMock.Setup(x => x.UserLogged())
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(x => x.Delete(user))
                .Returns(Task.CompletedTask);

            var command = new DeleteUserCommand();

            // Act
            var result = await _sut.Handle(command, CancellationToken.None);

            // Assert
            result.Should().Be(MediatR.Unit.Value);
            _userRepositoryMock.Verify(x => x.Delete(user), Times.Once);
        }
    }
}
