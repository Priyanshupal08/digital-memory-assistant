from app.api.routes.search_routes import router as search_router
from app.api.routes.chat_routes import router as chat_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.indexer.watcher import scan_directory

from app.api.routes.document_routes import router as document_router
from app.api.routes.index_routes import router as index_router

from app.database.connection import create_database


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(document_router)
app.include_router(index_router)
app.include_router(search_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/scan")
async def scan():
    files = scan_directory(".")

    return {
        "total_files": len(files),
        "files": [str(file) for file in files],
    }


create_database()