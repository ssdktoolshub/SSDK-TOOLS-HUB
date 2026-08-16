export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter HTML code." };
  let formatted = '', indent = 0;
  text.split(/>\s*</).forEach(function(node) {
      if (node.match(/^\/\w/)) indent = 0; // decrease indent
      formatted += '  '.repeat(indent) + '<' + node + '>\n';
      if (node.match(/^<?\w[^>]*[^\/]$/)) indent = 1; // increase indent
  });
  return { toolOutput: formatted.substring(1, formatted.length - 2) };
}
export function validate(inputs) { return true; }