export async function execute(inputs) {
  const text = inputs.toolInput;
  const secretKey = inputs.secretKey;
  if (!text || !secretKey) return { toolOutput: "Please enter both ciphertext and secret key." };

  try {
    const rawData = Uint8Array.from(atob(text), c => c.charCodeAt(0));
    const salt = rawData.slice(0, 16);
    const iv = rawData.slice(16, 28);
    const data = rawData.slice(28);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw", enc.encode(secretKey), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true, ["encrypt", "decrypt"]
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv }, key, data
    );
    
    const dec = new TextDecoder();
    return { toolOutput: dec.decode(decrypted) };
  } catch (e) {
    return { toolOutput: "Decryption failed. Incorrect key or corrupted data." };
  }
}
export function validate(inputs) { return true; }
