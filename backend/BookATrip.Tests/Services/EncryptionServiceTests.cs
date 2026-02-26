using BookATrip.Api.Services;
using Microsoft.Extensions.Configuration;

namespace BookATrip.Tests.Services;

public class EncryptionServiceTests
{
    private readonly IEncryptionService _sut;

    public EncryptionServiceTests()
    {
        var key = Convert.ToBase64String(new byte[32]); // 256-bit zero key — fine for tests
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["Encryption:Key"] = key })
            .Build();
        _sut = new EncryptionService(config);
    }

    [Fact]
    public void Encrypt_ThenDecrypt_ReturnsOriginalValue()
    {
        var original = "test@example.com";
        var encrypted = _sut.Encrypt(original);
        var decrypted = _sut.Decrypt(encrypted);
        Assert.Equal(original, decrypted);
    }

    [Fact]
    public void Encrypt_SameInput_ProducesDifferentCiphertexts()
    {
        var original = "test@example.com";
        var first = _sut.Encrypt(original);
        var second = _sut.Encrypt(original);
        Assert.NotEqual(first, second); // random nonce — different ciphertext each call
    }

    [Fact]
    public void Encrypt_EmptyString_Works()
    {
        var encrypted = _sut.Encrypt(string.Empty);
        var decrypted = _sut.Decrypt(encrypted);
        Assert.Equal(string.Empty, decrypted);
    }
}
