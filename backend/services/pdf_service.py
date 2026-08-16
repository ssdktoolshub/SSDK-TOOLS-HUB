# PDF Processing Engine Module

from pypdf import PdfWriter, PdfReader
import io
import base64

class PDFService:
    @staticmethod
    def process_pdf(tool_id: str, pdf_b64_list: list, options: dict = None) -> dict:
        options = options or {}
        writer = PdfWriter()

        if tool_id in ["pdf-merge", "pdf-merger"]:
            for b64 in pdf_b64_list:
                if "," in b64:
                    b64 = b64.split(",")[1]
                pdf_bytes = base64.b64decode(b64)
                reader = PdfReader(io.BytesIO(pdf_bytes))
                for page in reader.pages:
                    writer.add_page(page)

            out = io.BytesIO()
            writer.write(out)
            out_b64 = base64.b64encode(out.getvalue()).decode('utf-8')
            return {
                "result": f"data:application/pdf;base64,{out_b64}",
                "totalPages": len(writer.pages)
            }

        return {"result": "PDF processing complete"}
