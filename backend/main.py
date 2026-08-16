# SSDK Tools Hub - Universal FastAPI Python Backend Application
# Serves as the Universal API Gateway for 1000+ client, python, and AI tools.

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import os

from api.gateway import router as gateway_router

app = FastAPI(
    title="SSDK Tools Hub API Backend",
    description="Universal FastAPI Engine powering PDF, Image, Text, and AI tools",
    version="2.0.0"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Performance & Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = f"{process_time:.4f}"
    return response

# Include Universal Gateway Router
app.include_router(gateway_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "SSDK Tools Hub FastAPI Gateway",
        "version": "2.0.0",
        "timestamp": time.time()
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": str(exc), "message": "Internal Backend Server Error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
