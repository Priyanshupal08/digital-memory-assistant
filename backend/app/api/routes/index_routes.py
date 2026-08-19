from pathlib import Path
import shutil

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from app.services.indexing_service import IndexingService
from app.database.session import SessionLocal
from app.repositories.document_repository import DocumentRepository
from app.services.document_service import DocumentService
from app.indexer.folder_watcher import FolderWatcher


router = APIRouter()

db = SessionLocal()

repository = DocumentRepository(db)
document_service = DocumentService(repository)

indexing_service = IndexingService(document_service)

folder_watcher = FolderWatcher(indexing_service)

watching_folder = None


class WatchRequest(BaseModel):
    folder: str


@router.get("/index")
async def index():

    documents = indexing_service.index_folder(".")

    return {
        "indexed": len(documents)
    }


@router.get("/documents")
async def documents():

    docs = document_service.get_documents()

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "type": doc.file_type,
            "path": doc.file_path,
        }
        for doc in docs
    ]


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    filename = Path(file.filename).name

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    upload_folder = Path("uploads")
    upload_folder.mkdir(exist_ok=True)

    file_path = upload_folder / filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        document = indexing_service.dispatcher.process(str(file_path))

        saved_document = document_service.save_document(document)

        if saved_document is None:
            return {
                "message": "Document already exists",
                "filename": filename
            }

        return {
            "message": "Document uploaded and indexed successfully",
            "id": saved_document.id,
            "filename": saved_document.filename,
            "type": saved_document.file_type,
            "path": saved_document.file_path
        }

    except Exception as e:

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: {str(e)}"
        )


@router.post("/watch/start")
async def start_watching(request: WatchRequest):

    global watching_folder

    folder = Path(request.folder).expanduser().resolve()

    if not folder.exists():
        raise HTTPException(
            status_code=400,
            detail="Folder does not exist"
        )

    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="Path is not a folder"
        )

    # Stop previous watcher if one is running
    folder_watcher.stop()

    # Index existing files first
    indexing_service.index_folder(str(folder))

    # Start watching the folder
    folder_watcher.watch(str(folder))

    watching_folder = str(folder)

    return {
        "message": "Folder monitoring started",
        "folder": watching_folder
    }


@router.post("/watch/stop")
async def stop_watching():

    global watching_folder

    folder_watcher.stop()

    watching_folder = None

    return {
        "message": "Folder monitoring stopped"
    }


@router.get("/watch/status")
async def watch_status():

    return {
        "watching": watching_folder is not None,
        "folder": watching_folder
    }