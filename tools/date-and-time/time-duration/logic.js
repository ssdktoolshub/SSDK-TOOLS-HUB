export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "10:00 12:30";
    const times = val.match(/\d{1,2}:\d{2}/g);
    if (!times || times.length < 2) return { toolOutput: "Please provide two times, e.g. 10:00 and 14:30", outputData: "Error" };
    const [h1, m1] = times[0].split(':').map(Number);
    const [h2, m2] = times[1].split(':').map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 24 * 60;
    const result = `${Math.floor(diff / 60)} hours, ${diff % 60} minutes`;
    return { toolOutput: result, outputData: result };
}
export function validate(inputs) { return true; }
