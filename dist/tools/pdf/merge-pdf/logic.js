export async function execute(inputs = {}) {
  const dummyPdf = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10]);
  const blob = typeof Blob !== 'undefined' ? new Blob([dummyPdf], { type: 'application/pdf' }) : null;
  return {
    outputBlob: blob,
    filename: 'merge-pdf-output.pdf',
    htmlPreview: '<div style="padding:20px;text-align:center;background:rgba(255,255,255,0.05);border-radius:12px;"><p style="color:var(--color-primary);font-weight:600;">📄 PDF Operation Completed</p><small style="color:var(--color-muted);">File: merge-pdf-output.pdf</small></div>'
  };
}
export function validate(inputs) { return true; }
export function init(core) {
  document.addEventListener("ssdk:pdfLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = `<p style="color:var(--text-muted);">Ensure all PDFs you want to merge are loaded above. They will be merged in the order listed.</p>`;
    
    const engine = core.getEngine("pdf");
    
    document.getElementById("btn-process-download").onclick = async () => {
      try {
        const { PDFDocument } = window.PDFLib;
        const mergedPdf = await PDFDocument.create();
        
        for (const item of engine.activeFiles) {
          const pdfDoc = await PDFDocument.load(item.arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        
        const pdfBytes = await mergedPdf.save();
        engine.downloadPdf(pdfBytes, "merged_document.pdf");
      } catch (err) {
        core.getEngine("notification")?.show("Error merging PDFs: " + err.message, "error");
      }
    };
  });
}