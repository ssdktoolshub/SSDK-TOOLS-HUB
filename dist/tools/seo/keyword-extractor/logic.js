export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text to extract keywords." };

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const counts = {};
  words.forEach(w => counts[w] = (counts[w] || 0) + 1);
  
  const stopwords = ['the','is','in','at','of','on','and','a','to','it','for','with','as','that','by','this','are','from','or','an','be'];
  
  const sorted = Object.entries(counts)
    .filter(([word]) => !stopwords.includes(word) && word.length > 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(entry => entry[0]);

  return { toolOutput: sorted.join(', ') };
}
export function validate(inputs) { return true; }