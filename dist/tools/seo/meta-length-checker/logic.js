export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  if (!title && !desc) return { toolOutput: "Please enter a Title and/or Description to check." };

  let output = "";
  if (title) {
    const tLen = title.length;
    let tStatus = "Good";
    if (tLen < 30) tStatus = "Too Short (Aim for 50-60)";
    if (tLen > 60) tStatus = "Too Long (Max 60 recommended)";
    output += `Title Length: ${tLen} characters [${tStatus}]\n`;
  }
  
  if (desc) {
    const dLen = desc.length;
    let dStatus = "Good";
    if (dLen < 70) dStatus = "Too Short (Aim for 120-155)";
    if (dLen > 160) dStatus = "Too Long (Max 160 recommended)";
    output += `\nDescription Length: ${dLen} characters [${dStatus}]`;
  }
  
  return { toolOutput: output };
}
export function validate(inputs) { return true; }