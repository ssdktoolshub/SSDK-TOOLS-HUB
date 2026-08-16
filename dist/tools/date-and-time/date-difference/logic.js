export async function execute(inputs) {
    const d1 = new Date(inputs.date1 || inputs.toolInput || inputs.inputData);
    const d2 = new Date(inputs.date2 || d1);
    const diff = Math.abs(d2 - d1) / (1000 * 60 * 60 * 24);
    const result = `${diff} days`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
