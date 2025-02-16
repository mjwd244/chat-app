export class E2EEncryption {
  static async generateKeyPair() {
    return await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"] // Use "deriveKey" for ECDH key pair generation
    );
  }

  static async exportPublicKey(publicKey) {
    const jwk = await window.crypto.subtle.exportKey("jwk", publicKey);
    jwk.key_ops = ["deriveKey"]; // Ensure key_ops is set
    return jwk;
  }

  static async exportPrivateKey(privateKey) {
    const jwk = await window.crypto.subtle.exportKey("jwk", privateKey);
    jwk.key_ops = ["deriveKey"]; // Ensure key_ops is set
    return jwk;
  }

  static async deriveSharedKey(privateKey, publicKey) {
    return await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encryptMessage(text, sharedKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      sharedKey,
      encoded
    );

    return {
      encrypted: Array.from(new Uint8Array(encryptedData)),
      iv: Array.from(iv)
    };
  }

  static async decryptMessage(encryptedData, iv, sharedKey) {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      sharedKey,
      new Uint8Array(encryptedData)
    );

    return new TextDecoder().decode(decrypted);
  }
}