export async function execute(inputs) {
  const length = parseInt(inputs.length) || 16;
  
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  
  let numStr = array[0].toString();
  while(numStr.length < length) {
      const extra = new Uint32Array(1);
      window.crypto.getRandomValues(extra);
      numStr += extra[0].toString();
  }
  
  return { toolOutput: numStr.substring(0, length) };
}
export function validate(inputs) { return true; }
