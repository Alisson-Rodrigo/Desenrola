using System.Threading;
using System.Threading.Tasks;
using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.User.Queries.GetByIdQueries;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Moq;
using Xunit;

namespace Desenrola.Tests.Unit.Application.Features.User.Queries
{
    public class GetByIdHandlerQueriesTests
    {
        private readonly Mock<ILogged> _loggedMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly GetByIdHandlerQueries _sut;

        public GetByIdHandlerQueriesTests()
        {
            _sut = new GetByIdHandlerQueries(_loggedMock.Object, _userRepositoryMock.Object);
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

            var query = new GetByIdQueries { Id = Guid.NewGuid().ToString() };

            // Act
            Func<Task> action = async () => await _sut.Handle(query, CancellationToken.None);

            // Assert
            await action.Should().ThrowAsync<BadRequestException>()
                .WithMessage("Usuário não autenticado.");

            _userRepositoryMock.Verify(x => x.GetById(It.IsAny<string>()), Times.Never);
        }

        // ----------------------------------------------------
        // 2️⃣ Usuário autenticado mas não encontrado
        // ----------------------------------------------------
        [Fact(DisplayName = "Given user not found should throw BadRequestException")]
        public async Task Handle_WhenUserNotFound_ShouldThrowBadRequestException()
        {
            // Arrange
            var loggedUser = CreateFakeUser();

            _loggedMock.Setup(x => x.UserLogged())
                .ReturnsAsync(loggedUser);

            _userRepositoryMock.Setup(x => x.GetById(It.IsAny<string>()))
                .ReturnsAsync((Desenrola.Domain.Entities.User?)null);

            var query = new GetByIdQueries { Id = "123" };

            // Act
            Func<Task> action = async () => await _sut.Handle(query, CancellationToken.None);

            // Assert
            await action.Should().ThrowAsync<BadRequestException>()
                .WithMessage("Usuário com ID 123 não encontrado.");
        }

        // ----------------------------------------------------
        // 3️⃣ Sucesso — usuário encontrado
        // ----------------------------------------------------
        [Fact(DisplayName = "Given valid logged user and existing ID should return correct data")]
        public async Task Handle_WhenUserExists_ShouldReturnExpectedResult()
        {
            // Arrange
            var loggedUser = CreateFakeUser();
            var targetUser = new Desenrola.Domain.Entities.User
            {
                Id = "456",
                UserName = "target_user",
                Email = "target@email.com",
                Name = "Target User"
            };

            _loggedMock.Setup(x => x.UserLogged())
                .ReturnsAsync(loggedUser);

            _userRepositoryMock.Setup(x => x.GetById(targetUser.Id))
                .ReturnsAsync(targetUser);

            var query = new GetByIdQueries { Id = targetUser.Id };

            // Act
            var result = await _sut.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(targetUser.Id);
            result.Name.Should().Be(targetUser.Name);
            result.UserName.Should().Be(targetUser.UserName);
            result.Email.Should().Be(targetUser.Email);

            _userRepositoryMock.Verify(x => x.GetById(targetUser.Id), Times.Once);
        }
    }
}
