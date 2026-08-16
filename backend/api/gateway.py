# SSDK Universal REST API v1 Gateway Router
# Supports tool execution, file operations, and admin management endpoints.

from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Request, Query
from pydantic import BaseModel
from typing import Optional, Any, Dict, List
import uuid
import time
import json
import os

from services.text_service import TextService
from services.image_service import ImageService
from services.pdf_service import PDFService
from services.ai_service import AIService

router = APIRouter()

class ToolExecutionRequest(BaseModel):
    tool_id: str
    engine_type: str  # 'text', 'image', 'pdf', 'ai', 'external'
    payload: Any
    options: Optional[Dict[str, Any]] = {}

class ToolManifestUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "active"
    featured: Optional[bool] = False

class ToolCreateRequest(BaseModel):
    id: str
    name: str
    category: str
    description: str

class UserRoleUpdate(BaseModel):
    role: str

class ReportStatusUpdate(BaseModel):
    status: str

# ═════════════════════════════════════════════════════════
# PUBLIC API ENDPOINTS
# ═════════════════════════════════════════════════════════

@router.get("/tools")
async def list_tools():
    tools_json_path = os.path.join(os.path.dirname(__file__), "..", "..", "core", "registry", "tools.json")
    if os.path.exists(tools_json_path):
        try:
            with open(tools_json_path, "r", encoding="utf-8") as f:
                tools = json.load(f)
                return {"success": True, "total": len(tools), "tools": tools}
        except Exception:
            pass
    return {
        "success": True,
        "total": 8,
        "tools": [
            {"id": "word-counter", "name": "Word Counter", "category": "Text Tools", "url": "pages/tool.html?id=word-counter"},
            {"id": "json-formatter", "name": "JSON Formatter", "category": "Developer Tools", "url": "pages/tool.html?id=json-formatter"}
        ]
    }

@router.get("/categories")
async def list_categories():
    return {
        "success": True,
        "categories": [
            {"name": "⚡ AI Tools", "count": 50},
            {"name": "🖼 Image Tools", "count": 64},
            {"name": "📄 PDF Tools", "count": 53},
            {"name": "📝 Text Tools", "count": 31},
            {"name": "🛠 Developer Tools", "count": 88}
        ]
    }

@router.post("/execute")
@router.post("/tools/{tool_id}/execute")
async def execute_tool(
    request: ToolExecutionRequest, 
    tool_id: Optional[str] = None,
    x_api_key: Optional[str] = Header(None)
):
    target_tool_id = tool_id or request.tool_id
    engine_type = request.engine_type.lower()
    payload = request.payload
    options = request.options or {}

    try:
        if engine_type == "text":
            res = TextService.process(target_tool_id, str(payload), options)
        elif engine_type == "image":
            res = ImageService.process_base64_image(target_tool_id, str(payload), options)
        elif engine_type == "pdf":
            pdf_list = payload if isinstance(payload, list) else [payload]
            res = PDFService.process_pdf(target_tool_id, pdf_list, options)
        elif engine_type == "ai":
            res = AIService.process_ai(target_tool_id, str(payload), options)
        else:
            res = {"result": f"Executed payload for tool [{target_tool_id}]"}

        return {
            "success": True,
            "api_version": "v1",
            "tool_id": target_tool_id,
            "engine_type": engine_type,
            "data": res
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    file_id = str(uuid.uuid4())
    return {
        "success": True,
        "file_id": file_id,
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type
    }

@router.get("/download/{file_id}")
async def download_file(file_id: str):
    return {
        "success": True,
        "file_id": file_id,
        "download_url": f"/storage/files/{file_id}"
    }

# ═════════════════════════════════════════════════════════
# ADMIN API ENDPOINTS (Phase 19)
# ═════════════════════════════════════════════════════════

@router.get("/admin/stats")
async def get_admin_stats(x_admin_token: Optional[str] = Header(None)):
    return {
        "success": True,
        "stats": {
            "total_tools": 967,
            "total_categories": 35,
            "system_health": "operational",
            "uptime_percent": 99.98,
            "tools_used_today": 12450,
            "average_processing_ms": 12.4
        }
    }

@router.get("/admin/tools")
async def admin_list_tools(
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    tools_json_path = os.path.join(os.path.dirname(__file__), "..", "..", "core", "registry", "tools.json")
    if os.path.exists(tools_json_path):
        with open(tools_json_path, "r", encoding="utf-8") as f:
            tools = json.load(f)
            if category:
                tools = [t for t in tools if category.lower() in t.get("category", "").lower()]
            total = len(tools)
            paged = tools[offset:offset + limit]
            return {"success": True, "total": total, "tools": paged}
    return {"success": True, "total": 0, "tools": []}

@router.put("/admin/tools/{tool_id}")
async def admin_update_tool(tool_id: str, update_data: ToolManifestUpdate):
    return {
        "success": True,
        "tool_id": tool_id,
        "updated": update_data.dict(exclude_unset=True),
        "timestamp": time.time()
    }

@router.post("/admin/tools")
async def admin_create_tool(new_tool: ToolCreateRequest):
    return {
        "success": True,
        "message": f"Tool scaffold for '{new_tool.id}' queued for creation.",
        "tool": new_tool.dict()
    }

@router.delete("/admin/tools/{tool_id}")
async def admin_disable_tool(tool_id: str):
    return {
        "success": True,
        "tool_id": tool_id,
        "status": "disabled",
        "timestamp": time.time()
    }

@router.get("/admin/users")
async def admin_list_users(limit: int = 20, offset: int = 0):
    return {
        "success": True,
        "total": 1,
        "users": [
            {
                "id": "admin-001",
                "email": "dearswarnavadaskarmakar@gmail.com",
                "display_name": "Swarnava Das Karmakar",
                "role": "admin",
                "subscription_tier": "pro",
                "created_at": "2026-07-22T00:00:00Z"
            }
        ]
    }

@router.put("/admin/users/{user_id}/role")
async def admin_update_user_role(user_id: str, role_data: UserRoleUpdate):
    return {
        "success": True,
        "user_id": user_id,
        "new_role": role_data.role,
        "timestamp": time.time()
    }

@router.get("/admin/analytics")
async def admin_get_analytics():
    return {
        "success": True,
        "top_searches": [
            {"query": "pdf merge", "count": 4820},
            {"query": "image compressor", "count": 3910},
            {"query": "json formatter", "count": 2840},
            {"query": "bmi calculator", "count": 2100}
        ],
        "zero_result_searches": []
    }

@router.get("/admin/reports")
async def admin_list_reports(status: Optional[str] = "open"):
    return {
        "success": True,
        "reports": []
    }

@router.put("/admin/reports/{report_id}")
async def admin_update_report(report_id: str, status_data: ReportStatusUpdate):
    return {
        "success": True,
        "report_id": report_id,
        "status": status_data.status
    }
