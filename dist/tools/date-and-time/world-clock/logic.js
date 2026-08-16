export async function execute(inputs) {
    const t = new Date();
    const result = `UTC: ${t.toUTCString()}\nLocal: ${t.toLocaleString()}`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
