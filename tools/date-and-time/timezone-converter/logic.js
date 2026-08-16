export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "UTC";
    let result;
    try {
        result = new Date().toLocaleString("en-US", {timeZone: val}) + " in " + val;
    } catch(e) {
        result = "Invalid timezone: " + val;
    }
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
