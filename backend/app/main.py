from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from app.models.schemas import AnalysisRequest
from app.models.discovery_schemas import DiscoveryRequest
from app.services.ingestion import fetch_repo_content
from app.services.analyzer import run_analysis_pipeline
from app.services.discovery import run_discovery

app = FastAPI(title="Glassbox OSS", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    try:
        repo_content = await fetch_repo_content(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch repo: {str(e)}")

    async def event_generator():
        async for event in run_analysis_pipeline(repo_content):
            yield event

    return EventSourceResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/discover")
async def discover(request: DiscoveryRequest):
    async def event_generator():
        async for event in run_discovery(request):
            yield event

    return EventSourceResponse(event_generator(), media_type="text/event-stream")
