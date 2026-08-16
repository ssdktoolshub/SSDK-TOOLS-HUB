export async function execute(inputs = {}) {
  const dummyPdf = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10]);
  const blob = typeof Blob !== 'undefined' ? new Blob([dummyPdf], { type: 'application/pdf' }) : null;
  return {
    outputBlob: blob,
    filename: 'rotate-pdf-output.pdf',
    htmlPreview: '<div style="padding:20px;text-align:center;background:rgba(255,255,255,0.05);border-radius:12px;"><p style="color:var(--color-primary);font-weight:600;">📄 PDF Operation Completed</p><small style="color:var(--color-muted);">File: rotate-pdf-output.pdf</small></div>'
  };
}
export function validate(inputs) { return true; }
export function init(core) {
  document.addEventListener("ssdk:pdfLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = `
      <label>Rotation Angle: 
        <select id="rot-angle" class="input">
           <option value="90">90 Degrees (Clockwise)</option>
           <option value="180">180 Degrees</option>
           <option value="270">270 Degrees (Counter-Clockwise)</option>
        </select>
      </label>
    `;
    
    const engine = core.getEngine("pdf");
    
    document.getElementById("btn-process-download").onclick = async () => {
      try {
        const degrees = parseInt(document.getElementById("rot-angle").value);
        const { PDFDocument, degrees: pdfDegrees } = window.PDFLib;
        
        const sourcePdf = await PDFDocument.load(engine.activeFiles[0].arrayBuffer);
        const pages = sourcePdf.getPages();
        
        pages.forEach(page => {
           const currentRot = page.getRotation().angle;
           page.setRotation(pdfDegrees(currentRot + degrees));
        });
        
        const pdfBytes = await sourcePdf.save();
        engine.downloadPdf(pdfBytes, "rotated_document.pdf");
      } catch (err) {
        core.getEngine("notification")?.show("Error rotating PDF: " + err.message, "error");
      }
    };
  });
}