using System;
using System.Threading;
using System.Threading.Tasks;
using Desenrola.Application.Features.Providers.Commands.CreateProvider;
using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Entities;
using Moq;
using Xunit;

namespace Desenrola.Tests.Unit.Application.Features.Providers.Commands
{
    public class CreateProviderCommandHandlerTests
    {
        [Fact]
        public async Task Handle_ShouldCreateProviderAndReturnId()
        {
            // Arrange
            var fakeId = Guid.NewGuid();

            var command = new CreateProviderCommand(
                UserId: Guid.NewGuid(),
                ServiceName: "Serviço Teste",
                Description: "Descrição teste",
                PhoneNumber: "999999999",
                Address: "Endereço Teste"
            );

            var mockRepo = new Mock<IProviderRepository>();

            mockRepo
                .Setup(repo => repo.CreateAsync(It.IsAny<Provider>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Provider provider, CancellationToken _) => provider);

            var handler = new CreateProviderCommandHandler(mockRepo.Object);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotEqual(Guid.Empty, result);
            mockRepo.Verify(repo => repo.CreateAsync(It.IsAny<Provider>(), It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
