export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "255, 0, 0";
    const match = val.match(/\d+/g);
    if (!match || match.length < 3) return { toolOutput: "Invalid RGB", outputData: "Invalid" };
    const r = parseInt(match[0])/255;
    const g = parseInt(match[1])/255;
    const b = parseInt(match[2])/255;
    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    const result = `C: ${(c*100).toFixed(0)}%, M: ${(m*100).toFixed(0)}%, Y: ${(y*100).toFixed(0)}%, K: ${(k*100).toFixed(0)}%`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
