export async function execute(inputs) {
  const numStr = (inputs.toolInput || "").trim();
  const num = parseInt(numStr.replace(/,/g, ''));
  if (isNaN(num)) return { toolOutput: "Please enter a valid number." };
  
  if (num === 0) return { toolOutput: "zero" };
  
  const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

  function convertGroup(n) {
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + " ";
    }
    return str.trim();
  }

  let words = "";
  let n = Math.abs(num);
  let scaleIdx = 0;
  
  while (n > 0) {
    const group = n % 1000;
    if (group !== 0) {
      const groupWords = convertGroup(group);
      words = groupWords + (scales[scaleIdx] ? " " + scales[scaleIdx] : "") + (words ? " " + words : "");
    }
    n = Math.floor(n / 1000);
    scaleIdx++;
    if (scaleIdx >= scales.length && n > 0) return { toolOutput: "Number too large" };
  }
  
  if (num < 0) words = "negative " + words;
  
  return { toolOutput: words.trim() };
}
export function validate(inputs) { return !!inputs.toolInput; }