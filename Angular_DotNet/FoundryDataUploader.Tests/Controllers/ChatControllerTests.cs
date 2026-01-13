using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using FoundryDataUploader.Application.Chat.Commands;
using FoundryDataUploader.Application.Chat.Queries;
using FoundryDataUploader.Application.Common.Interfaces;
using FoundryDataUploader.Controllers;
using Xunit;

namespace FoundryDataUploader.Tests.Controllers;

public class ChatControllerTests
{
    private readonly Mock<IMediator> _mediatorMock;
    private readonly Mock<ILogger<ChatController>> _loggerMock;
    private readonly ChatController _controller;

    public ChatControllerTests()
    {
        _mediatorMock = new Mock<IMediator>();
        _loggerMock = new Mock<ILogger<ChatController>>();
        _controller = new ChatController(_mediatorMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Ask_WithEmptyQuestion_ReturnsBadRequest()
    {
        // Arrange
        var request = new AskRequest("", null);

        // Act
        var result = await _controller.Ask(request, CancellationToken.None);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Ask_WithNullQuestion_ReturnsBadRequest()
    {
        // Arrange
        var request = new AskRequest(null!, null);

        // Act
        var result = await _controller.Ask(request, CancellationToken.None);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Ask_WithValidQuestion_ReturnsOk()
    {
        // Arrange
        var request = new AskRequest("What is AI?", null);
        var commandResult = Result<AskQuestionResponse>.Ok(new AskQuestionResponse(
            "AI is artificial intelligence.",
            "AI is artificial intelligence.",
            null,
            DateTime.UtcNow
        ));

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<AskQuestionCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(commandResult);

        // Act
        var result = await _controller.Ask(request, CancellationToken.None);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Health_ReturnsOkWithHealthResponse()
    {
        // Arrange
        var healthResult = Result<FoundryDataUploader.Application.Chat.Queries.HealthResponse>.Ok(
            new FoundryDataUploader.Application.Chat.Queries.HealthResponse(
                "Healthy",
                DateTime.UtcNow,
                "1.0.0"
            ));

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<GetHealthQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(healthResult);

        // Act
        var result = await _controller.Health(CancellationToken.None);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
    }
}
