export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "50 200";
    const nums = val.match(/\d+(\.\d+)?/g) || [0, 0];
    const n1 = parseFloat(nums[0]);
    const n2 = parseFloat(nums[1] || nums[0]);
    const result = `${(n1 / n2) * 100}%`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
