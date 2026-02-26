using System.Security.Cryptography;
using System.Text;

namespace BookATrip.Api.Services;

public interface IEncryptionService
{
    string Encrypt(string plaintext);
    string Decrypt(string ciphertext);
}

public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration configuration)
    {
        var keyBase64 = configuration["Encryption:Key"]
            ?? throw new InvalidOperationException("Encryption:Key is not configured");
        _key = Convert.FromBase64String(keyBase64);
        if (_key.Length != 32)
            throw new InvalidOperationException("Encryption:Key must be a 256-bit (32-byte) Base64-encoded value.");
    }

    public string Encrypt(string plaintext)
    {
        var nonce = new byte[AesGcm.NonceByteSizes.MaxSize]; // 12 bytes
        RandomNumberGenerator.Fill(nonce);

        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
        var ciphertextBytes = new byte[plaintextBytes.Length];
        var tag = new byte[AesGcm.TagByteSizes.MaxSize]; // 16 bytes

        using var aes = new AesGcm(_key, AesGcm.TagByteSizes.MaxSize);
        aes.Encrypt(nonce, plaintextBytes, ciphertextBytes, tag);

        return $"{Convert.ToBase64String(nonce)}:{Convert.ToBase64String(tag)}:{Convert.ToBase64String(ciphertextBytes)}";
    }

    public string Decrypt(string ciphertext)
    {
        var parts = ciphertext.Split(':');
        if (parts.Length != 3)
            throw new ArgumentException("Invalid ciphertext format", nameof(ciphertext));

        byte[] nonce, tag, ciphertextBytes;
        try
        {
            nonce = Convert.FromBase64String(parts[0]);
            tag = Convert.FromBase64String(parts[1]);
            ciphertextBytes = Convert.FromBase64String(parts[2]);
        }
        catch (FormatException ex)
        {
            throw new ArgumentException("Ciphertext contains invalid Base64 data", nameof(ciphertext), ex);
        }

        var plaintextBytes = new byte[ciphertextBytes.Length];
        using var aes = new AesGcm(_key, AesGcm.TagByteSizes.MaxSize);
        aes.Decrypt(nonce, ciphertextBytes, tag, plaintextBytes);
        return Encoding.UTF8.GetString(plaintextBytes);
    }
}
