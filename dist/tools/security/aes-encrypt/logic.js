export async function execute(inputs) {
  const text = inputs.toolInput;
  const secretKey = inputs.secretKey;
  if (!text || !secretKey) return { toolOutput: "Please enter both payload and secret key." };

  try {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw", enc.encode(secretKey), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
    );
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true, ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv }, key, enc.encode(text)
    );
    
    // Combine salt, iv, and ciphertext for output
    const resultBuffer = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    resultBuffer.set(salt, 0);
    resultBuffer.set(iv, salt.length);
    resultBuffer.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    // Convert to Base64 using modern approach
    const base64String = btoa(String.fromCharCode(...resultBuffer));
    return { toolOutput: base64String };
  } catch (e) {
    return { toolOutput: "Encryption failed: " + e.message };
  }
}
export function validate(inputs) { return true; }
