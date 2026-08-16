export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "#3498db";
    const hex = val.replace('#', '');
    const num = parseInt(hex, 16) || 0x3498db;
    const p1 = '#' + ((num + 0x333333) & 0xffffff).toString(16).padStart(6, '0');
    const p2 = '#' + ((num + 0x666666) & 0xffffff).toString(16).padStart(6, '0');
    const result = `${val}, ${p1}, ${p2}`;
    return { toolOutput: result, outputData: result, htmlPreview: `<div style="display:flex"><div style="flex:1;height:50px;background:${val}"></div><div style="flex:1;height:50px;background:${p1}"></div><div style="flex:1;height:50px;background:${p2}"></div></div>` };
}
export function validate(inputs) { return true; }
