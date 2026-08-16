export async function execute(inputs) {
  const url = inputs.url;
  const source = inputs.source;
  const medium = inputs.medium;
  const name = inputs.name;
  
  if (!url || !source) return { toolOutput: "Website URL and Campaign Source are required." };

  try {
    const obj = new URL(url);
    if (source) obj.searchParams.set("utm_source", source);
    if (medium) obj.searchParams.set("utm_medium", medium);
    if (name) obj.searchParams.set("utm_campaign", name);
    
    return { toolOutput: obj.toString() };
  } catch (err) {
    return { toolOutput: "Invalid URL format." };
  }
}
export function validate(inputs) { return true; }