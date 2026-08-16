export async function execute(inputs) {
    const val = inputs.toolInput || inputs.inputData || "https://example.com";
    const html = `<div id="qr"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
setTimeout(() => {
    new QRCode(document.getElementById("qr"), "${val.replace(/"/g, '\\"')}");
}, 100);
</script>`;
    return { toolOutput: html, outputData: html, htmlPreview: html };
}
export function validate(inputs) { return true; }
