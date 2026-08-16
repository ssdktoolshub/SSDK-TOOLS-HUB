// Core Logic for CSV to Excel
export async function execute(inputs) {
    const csv = inputs.inputData || "";
    const html = `<html><body><table>${csv.split('\\n').map(row => `<tr>${row.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    return { outputData: "Excel file generated.", outputBlob: blob, filename: 'data.xls' };
}
export function validate(inputs) { return true; }
