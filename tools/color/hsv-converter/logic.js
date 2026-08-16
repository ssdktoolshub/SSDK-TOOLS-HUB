export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "0, 100, 100";
    const match = val.match(/\d+/g);
    if (!match || match.length < 3) return { toolOutput: "Invalid HSV", outputData: "Invalid HSV" };
    let h = parseInt(match[0]) / 360;
    let s = parseInt(match[1]) / 100;
    let v = parseInt(match[2]) / 100;
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    const result = `RGB: ${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
