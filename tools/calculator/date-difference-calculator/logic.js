export async function execute(inputs) {
  const d1 = new Date(inputs.date1);
  const d2 = new Date(inputs.date2);
  
  if (isNaN(d1) || isNaN(d2)) return { toolOutput: "Please enter valid Start and End Dates." };

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);
  const diffHours = diffDays * 24;

  return { toolOutput: `Difference:\n${diffDays} Days\n${diffWeeks} Weeks\n${diffHours} Hours` };
}
export function validate(inputs) { return !!inputs.date1 && !!inputs.date2; }