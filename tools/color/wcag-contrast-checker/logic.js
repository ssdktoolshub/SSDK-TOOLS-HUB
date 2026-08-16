export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "#ffffff, #000000";
    const colors = val.match(/#[0-9a-fA-F]{6}/g);
    if (!colors || colors.length < 2) return { toolOutput: "Provide two hex colors", outputData: "Error" };
    function getLum(hex) {
        let rgb = parseInt(hex.slice(1), 16);
        let r = (rgb >> 16) / 255;
        let g = ((rgb >> 8) & 0xff) / 255;
        let b = (rgb & 0xff) / 255;
        let a = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    let L1 = getLum(colors[0]);
    let L2 = getLum(colors[1]);
    let ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const result = `Contrast Ratio: ${ratio.toFixed(2)}:1 (WCAG AA ${ratio >= 4.5 ? 'Pass' : 'Fail'})`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
