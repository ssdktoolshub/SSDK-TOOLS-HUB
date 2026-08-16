export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "#ff0000, #0000ff";
    const colors = val.match(/#[0-9a-fA-F]{6}/g);
    if (!colors || colors.length < 2) return { toolOutput: "Provide two hex colors", outputData: "Error" };
    const c1 = parseInt(colors[0].slice(1), 16);
    const c2 = parseInt(colors[1].slice(1), 16);
    const r = Math.round(((c1 >> 16) + (c2 >> 16)) / 2);
    const g = Math.round((((c1 >> 8) & 0xff) + ((c2 >> 8) & 0xff)) / 2);
    const b = Math.round(((c1 & 0xff) + (c2 & 0xff)) / 2);
    const result = `#${(r<<16 | g<<8 | b).toString(16).padStart(6, '0')}`;
    return { toolOutput: result, outputData: result, htmlPreview: `<div style="width:100%;height:100px;background:${result}"></div>` };
}
export function validate(inputs) { return true; }
