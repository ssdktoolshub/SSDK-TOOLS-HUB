export async function execute(inputs) {
  const text = inputs.text || inputs.toolInput || "";
  
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  
  return {
    toolOutput: `Characters (with spaces): ${charsWithSpaces}\nCharacters (without spaces): ${charsWithoutSpaces}\nWords: ${words}\nLines: ${lines}`
  };
}

export function validate(inputs) {
  return true;
}
