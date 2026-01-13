using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using FoundryDataUploader.Domain.Entities;
using FoundryDataUploader.Infrastructure.Repositories;
using Xunit;

namespace FoundryDataUploader.Tests.Infrastructure.Repositories;

public class InMemoryDocumentRepositoryTests
{
    private readonly Mock<ILogger<InMemoryDocumentRepository>> _loggerMock;
    private readonly InMemoryDocumentRepository _repository;

    public InMemoryDocumentRepositoryTests()
    {
        _loggerMock = new Mock<ILogger<InMemoryDocumentRepository>>();
        _repository = new InMemoryDocumentRepository(_loggerMock.Object);
    }

    [Fact]
    public async Task AddAsync_ShouldAddDocument()
    {
        // Arrange
        var document = Document.Create("Test Document", "test.txt", "uploads/test.txt", "text/plain", 100, "Test content");

        // Act
        var result = await _repository.AddAsync(document);

        // Assert
        result.Should().NotBeNull();
        result.FileName.Should().Be("test.txt");
    }

    [Fact]
    public async Task GetByIdAsync_WithExistingDocument_ReturnsDocument()
    {
        // Arrange
        var document = Document.Create("Test Document", "test.txt", "uploads/test.txt", "text/plain", 100);
        await _repository.AddAsync(document);

        // Act
        var result = await _repository.GetByIdAsync(document.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(document.Id);
    }

    [Fact]
    public async Task GetByIdAsync_WithNonExistingDocument_ReturnsNull()
    {
        // Act
        var result = await _repository.GetByIdAsync("non-existing");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllDocuments()
    {
        // Arrange
        var doc1 = Document.Create("Doc 1", "test1.txt", "uploads/test1.txt", "text/plain", 100);
        var doc2 = Document.Create("Doc 2", "test2.txt", "uploads/test2.txt", "text/plain", 200);
        await _repository.AddAsync(doc1);
        await _repository.AddAsync(doc2);

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task DeleteAsync_WithExistingDocument_ReturnsTrue()
    {
        // Arrange
        var document = Document.Create("Test Document", "test.txt", "uploads/test.txt", "text/plain", 100);
        await _repository.AddAsync(document);

        // Act
        var result = await _repository.DeleteAsync(document.Id);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistingDocument_ReturnsFalse()
    {
        // Act
        var result = await _repository.DeleteAsync("non-existing");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task ExistsAsync_WithExistingDocument_ReturnsTrue()
    {
        // Arrange
        var document = Document.Create("Test Document", "test.txt", "uploads/test.txt", "text/plain", 100);
        await _repository.AddAsync(document);

        // Act
        var result = await _repository.ExistsAsync(document.Id);

        // Assert
        result.Should().BeTrue();
    }
}
