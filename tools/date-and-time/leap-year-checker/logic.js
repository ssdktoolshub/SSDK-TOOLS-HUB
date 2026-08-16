export async function execute(inputs) {
    const val = parseInt(inputs.toolInput || inputs.inputData || new Date().getFullYear());
    const isLeap = (val % 4 === 0 && val % 100 !== 0) || (val % 400 === 0);
    const result = isLeap ? `${val} is a leap year` : `${val} is not a leap year`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
