export async function execute(inputs) {
  const d1 = new Date(inputs.date1);
  const d2 = new Date(inputs.date2);
  
  if (isNaN(d1) || isNaN(d2)) return { toolOutput: "Please enter valid Start and End Dates." };

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { toolOutput: `Total Days Between: ${diffDays} Days` };
}
export function validate(inputs) { return !!inputs.date1 && !!inputs.date2; }