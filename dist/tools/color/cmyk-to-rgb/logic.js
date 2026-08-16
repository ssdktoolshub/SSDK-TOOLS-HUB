export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "0, 100, 100, 0";
    const match = val.match(/\d+/g);
    if (!match || match.length < 4) return { toolOutput: "Invalid CMYK", outputData: "Invalid" };
    const c = parseInt(match[0])/100;
    const m = parseInt(match[1])/100;
    const y = parseInt(match[2])/100;
    const k = parseInt(match[3])/100;
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
    const result = `RGB(${r}, ${g}, ${b})`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
