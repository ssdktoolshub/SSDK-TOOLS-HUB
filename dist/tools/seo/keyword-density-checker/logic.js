export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text to analyze." };

  const words = text.toLowerCase().match(/\b\w+\b/g);
  if (!words) return { toolOutput: "No words found." };

  const counts = {};
  words.forEach(w => counts[w] = (counts[w] || 0) + 1);
  
  // Exclude common stop words (simplified list)
  const stopwords = ['the','is','in','at','of','on','and','a','to','it','for','with','as','that','by','this','are'];
  
  const sorted = Object.entries(counts)
    .filter(([word]) => !stopwords.includes(word) && word.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  let output = `Total Words: ${words.length}\n\nTop Keywords (excluding stop words):\n`;
  sorted.forEach(([word, count]) => {
     const density = ((count / words.length) * 100).toFixed(2);
     output += `- ${word}: ${count} times (${density}%)\n`;
  });
  
  return { toolOutput: output };
}
export function validate(inputs) { return true; }