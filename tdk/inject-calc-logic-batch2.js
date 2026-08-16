const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/calculator');

const implementations = {
  "age-calculator": `
export async function execute(inputs) {
  const d1 = new Date(inputs.date1);
  const d2 = inputs.date2 ? new Date(inputs.date2) : new Date();
  
  if (isNaN(d1)) return { toolOutput: "Please enter a valid Start Date (e.g., Date of Birth)." };

  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
     months--;
     const previousMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
     days += previousMonth.getDate();
  }
  if (months < 0) {
     years--;
     months += 12;
  }

  return { toolOutput: \`Age: \${years} Years, \${months} Months, \${days} Days\` };
}
export function validate(inputs) { return !!inputs.date1; }
`,
  "date-difference-calculator": `
export async function execute(inputs) {
  const d1 = new Date(inputs.date1);
  const d2 = new Date(inputs.date2);
  
  if (isNaN(d1) || isNaN(d2)) return { toolOutput: "Please enter valid Start and End Dates." };

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);
  const diffHours = diffDays * 24;

  return { toolOutput: \`Difference:\\n\${diffDays} Days\\n\${diffWeeks} Weeks\\n\${diffHours} Hours\` };
}
export function validate(inputs) { return !!inputs.date1 && !!inputs.date2; }
`,
  "days-between-dates": `
export async function execute(inputs) {
  const d1 = new Date(inputs.date1);
  const d2 = new Date(inputs.date2);
  
  if (isNaN(d1) || isNaN(d2)) return { toolOutput: "Please enter valid Start and End Dates." };

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { toolOutput: \`Total Days Between: \${diffDays} Days\` };
}
export function validate(inputs) { return !!inputs.date1 && !!inputs.date2; }
`,
  "lcm-calculator": `
export async function execute(inputs) {
  const a = parseInt(inputs.num1);
  const b = parseInt(inputs.num2);
  
  if (isNaN(a) || isNaN(b) || a === 0 || b === 0) return { toolOutput: "Please enter valid non-zero numbers." };

  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const lcm = (Math.abs(a * b)) / gcd(a, b);

  return { toolOutput: \`LCM of \${a} and \${b} is: \${lcm}\` };
}
export function validate(inputs) { return true; }
`,
  "gcd-calculator": `
export async function execute(inputs) {
  const a = parseInt(inputs.num1);
  const b = parseInt(inputs.num2);
  
  if (isNaN(a) || isNaN(b)) return { toolOutput: "Please enter valid numbers." };

  const gcd = (x, y) => (!y ? Math.abs(x) : gcd(y, x % y));
  const result = gcd(a, b);

  return { toolOutput: \`GCD (Greatest Common Divisor) of \${a} and \${b} is: \${result}\` };
}
export function validate(inputs) { return true; }
`,
  "number-to-words": `
export async function execute(inputs) {
  const num = parseInt(inputs.toolInput);
  if (isNaN(num)) return { toolOutput: "Please enter a valid number." };

  // Simple basic converter up to 999 for demonstration
  const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  function inWords (num) {
      if ((num = num.toString()).length > 9) return 'overflow';
      let n = ('000000000' + num).substr(-9).match(/^(\\d{2})(\\d{2})(\\d{2})(\\d{1})(\\d{2})$/);
      if (!n) return; let str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
      return str;
  }

  return { toolOutput: num === 0 ? "zero" : inWords(num).trim() };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "words-to-number": `
export async function execute(inputs) {
  // Complex implementation required for full production, stubbing for now.
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter words." };
  
  return { toolOutput: "Feature ready for Advanced NLP Parsing module." };
}
export function validate(inputs) { return !!inputs.toolInput; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
