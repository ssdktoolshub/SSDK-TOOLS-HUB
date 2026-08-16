export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "#ff0000, #0000ff";
    const colors = val.split(',').map(c => c.trim());
    if (colors.length < 2) colors.push('#000000');
    const css = `linear-gradient(90deg, ${colors.join(', ')})`;
    return { toolOutput: css, outputData: css, htmlPreview: `<div style="width:100%;height:100px;background:${css}"></div>` };
}
export function validate(inputs) { return true; }
