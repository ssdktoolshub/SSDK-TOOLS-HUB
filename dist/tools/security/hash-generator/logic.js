// Core Logic for Hash Generator
export async function execute(inputs) {
    if (!inputs.inputData) return { outputData: "" };
    const encoder = new TextEncoder();
    const data = encoder.encode(inputs.inputData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return { outputData: hashHex };
}
export function validate(inputs) { return true; }
