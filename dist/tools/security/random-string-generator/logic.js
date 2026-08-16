export async function execute(inputs = {}) {
  const length = Math.max(1, Math.min(1024, parseInt(inputs.length || inputs.value || 32)));
  const charset = inputs.charset || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
  let result = "";
  const cryptoObj = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : (typeof window !== 'undefined' ? window.crypto : null);
  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint32Array(length);
    cryptoObj.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }
