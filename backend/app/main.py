from fastapi import FastAPI

from app.core.config import settings
from app.indexer.watcher import scan_directory
from app.processors.pdf_processor import extract_pdf
from app.dispatcher.dispatcher import ProcessorDispatcher
from app.services.indexing_service import IndexingService

from app.database.session import SessionLocal
from app.repositories.document_repository import DocumentRepository
from app.services.document_service import DocumentService

db = SessionLocal()

repository = DocumentRepository(db)

document_service = DocumentService(repository)

dispatcher = ProcessorDispatcher()
indexing_service = IndexingService(document_service)

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


@app.get("/index")
async def index():

    documents = indexing_service.index_folder(".")

    return {
        "indexed": len(documents)
    }


from app.database.connection import create_database

create_database()


