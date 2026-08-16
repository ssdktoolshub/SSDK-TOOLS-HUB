export async function execute(inputs) {
    const html = `<div>QR Scanner requires camera access or image upload. Please use a compatible device.</div>`;
    return { toolOutput: "Scanner ready", outputData: "Scanner ready", htmlPreview: html };
}
export function validate(inputs) { return true; }
