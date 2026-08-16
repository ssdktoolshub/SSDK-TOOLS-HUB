export async function execute(inputs) {
    let d1 = new Date(inputs.date1 || inputs.toolInput || inputs.inputData);
    let d2 = new Date(inputs.date2 || d1);
    if (d1 > d2) { const t = d1; d1 = d2; d2 = t; }
    let count = 0;
    let cur = new Date(d1);
    while (cur <= d2) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
    }
    const result = `${count} working days`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
