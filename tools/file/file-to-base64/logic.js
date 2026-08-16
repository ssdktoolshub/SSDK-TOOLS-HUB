// Core Logic for File to Base64
export async function execute(inputs) {
    const text = inputs.inputData || "";
    try {
        return { outputData: btoa(unescape(encodeURIComponent(text))) };
    } catch (e) {
        return { outputData: "Error converting to Base64" };
    }
}
export function validate(inputs) { return true; }
