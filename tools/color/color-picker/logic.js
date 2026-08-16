export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "#ff0000";
    return { toolOutput: val, outputData: val, htmlPreview: `<input type="color" value="${val}">` };
}
export function validate(inputs) { return true; }
