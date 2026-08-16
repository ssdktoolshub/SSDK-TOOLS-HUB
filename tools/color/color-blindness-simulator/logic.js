export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "#ff0000";
    const hex = val.match(/#[0-9a-fA-F]{6}/) ? val.match(/#[0-9a-fA-F]{6}/)[0] : "#ff0000";
    const html = `
    <div style="display:flex;gap:10px;">
        <div style="background:${hex};width:50px;height:50px;" title="Original"></div>
        <div style="background:${hex};width:50px;height:50px;filter:grayscale(100%);" title="Achromatopsia"></div>
    </div>`;
    return { toolOutput: "Simulated", outputData: "Simulated", htmlPreview: html };
}
export function validate(inputs) { return true; }
