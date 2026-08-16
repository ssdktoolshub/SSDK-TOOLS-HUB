export async function execute(inputs) {
    const result = `<div id="sw">0.0s</div><script>let start=Date.now();setInterval(()=>document.getElementById('sw').innerText=((Date.now()-start)/1000).toFixed(1)+'s',100);</script>`;
    return { toolOutput: "Stopwatch started", outputData: "Stopwatch started", htmlPreview: result };
}
export function validate(inputs) { return true; }
