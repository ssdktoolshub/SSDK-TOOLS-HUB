# Image Processing Engine Module

from PIL import Image
import io
import base64

class ImageService:
    @staticmethod
    def process_base64_image(tool_id: str, image_b64: str, options: dict = None) -> dict:
        options = options or {}
        
        # Remove data URI header if present
        if "," in image_b64:
            image_b64 = image_b64.split(",")[1]

        img_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(img_bytes))

        if tool_id in ["image-resizer", "img-resize"]:
            width = int(options.get("width", image.width))
            height = int(options.get("height", image.height))
            image = image.resize((width, height), Image.Resampling.LANCZOS)

        elif tool_id in ["image-compressor", "img-compress"]:
            quality = int(options.get("quality", 80))
            out = io.BytesIO()
            image.save(out, format="JPEG", quality=quality)
            out_b64 = base64.b64encode(out.getvalue()).decode('utf-8')
            return {
                "result": f"data:image/jpeg;base64,{out_b64}",
                "originalSize": len(img_bytes),
                "compressedSize": len(out.getvalue())
            }

        out = io.BytesIO()
        image.save(out, format=image.format or "PNG")
        out_b64 = base64.b64encode(out.getvalue()).decode('utf-8')
        return {"result": f"data:image/png;base64,{out_b64}"}
