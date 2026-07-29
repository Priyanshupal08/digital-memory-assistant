from fastapi import FastAPI

from app.core.config import settings
from app.indexer.watcher import scan_directory
from app.processors.pdf_processor import extract_pdf
from app.dispatcher.dispatcher import ProcessorDispatcher

dispatcher = ProcessorDispatcher()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/scan")
async def scan():

    files = scan_directory(".")

    return {
        "total_files": len(files),
        "files": [str(file) for file in files]
    }

@app.get("/read-pdf")
async def read_pdf():

    document = dispatcher.process("sample.pdf")

    return {
        "filename": document.filename,
        "file_type": document.file_type,
        "pages": document.metadata["pages"],
        "text": document.text[:1000],
    }