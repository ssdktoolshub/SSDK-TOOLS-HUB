export async function execute(inputs = {}) {
  const length = Math.max(4, Math.min(128, parseInt(inputs.length || inputs.value || 16)));
  const complexity = inputs.options || inputs.complexity || "complex";
  
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (complexity === "complex" || complexity === "all") charset += "!@#$%^&*()_+~|}{[]:;?><,./-=";
  if (complexity === "hex") charset = "0123456789ABCDEF";
  if (complexity === "alphanumeric") charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
