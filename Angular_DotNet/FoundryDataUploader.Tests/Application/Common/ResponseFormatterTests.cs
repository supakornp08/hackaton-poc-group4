using FluentAssertions;
using FoundryDataUploader.Application.Common;
using Xunit;

namespace FoundryDataUploader.Tests.Application.Common;

public class ResponseFormatterTests
{
    [Fact]
    public void FormatForDisplay_WithNullInput_ReturnsNull()
    {
        // Arrange
        string? input = null;

        // Act
        var result = ResponseFormatter.FormatForDisplay(input!);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public void FormatForDisplay_WithEmptyInput_ReturnsEmpty()
    {
        // Arrange
        var input = "";

        // Act
        var result = ResponseFormatter.FormatForDisplay(input);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public void FormatForDisplay_WithExcessiveNewlines_ReducesToDoubleNewlines()
    {
        // Arrange
        var input = "Hello\n\n\n\n\nWorld";

        // Act
        var result = ResponseFormatter.FormatForDisplay(input);

        // Assert
        result.Should().Be("Hello\n\nWorld");
    }

    [Fact]
    public void FormatForDisplay_WithBulletPoints_ConvertsToConsistentFormat()
    {
        // Arrange
        var input = "- Item 1\n* Item 2";

        // Act
        var result = ResponseFormatter.FormatForDisplay(input);

        // Assert
        result.Should().Contain("• Item 1");
        result.Should().Contain("• Item 2");
    }

    [Fact]
    public void FormatAsHtml_WithNullInput_ReturnsNull()
    {
        // Arrange
        string? input = null;

        // Act
        var result = ResponseFormatter.FormatAsHtml(input!);

        // Assert
        result.Should().BeNull();
    }
}
