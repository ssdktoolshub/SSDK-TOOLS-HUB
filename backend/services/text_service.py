# Text Processing Engine Module

import base64
import json
import re

class TextService:
    @staticmethod
    def process(tool_id: str, text: str, options: dict = None) -> dict:
        options = options or {}
        
        if tool_id in ["word-counter", "text-analyzer"]:
            words = len(re.findall(r'\w+', text))
            chars = len(text)
            lines = len(text.splitlines())
            return {
                "result": f"Words: {words} | Characters: {chars} | Lines: {lines}",
                "metrics": {"words": words, "characters": chars, "lines": lines}
            }

        elif tool_id in ["case-converter"]:
            mode = options.get("mode", "uppercase")
            if mode == "uppercase":
                res = text.upper()
            elif mode == "lowercase":
                res = text.lower()
            elif mode == "titlecase":
                res = text.title()
            else:
                res = text
            return {"result": res}

        elif tool_id in ["json-formatter", "json-validator"]:
            try:
                parsed = json.loads(text)
                formatted = json.dumps(parsed, indent=2)
                return {"result": formatted, "valid": True}
            except Exception as e:
                return {"result": f"Invalid JSON: {str(e)}", "valid": False}

        elif tool_id in ["base64-encoder"]:
            mode = options.get("mode", "encode")
            if mode == "encode":
                res = base64.b64encode(text.encode('utf-8')).decode('utf-8')
            else:
                res = base64.b64decode(text.encode('utf-8')).decode('utf-8')
            return {"result": res}

        return {"result": text}
