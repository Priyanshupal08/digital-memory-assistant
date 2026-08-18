from fastapi import APIRouter, Query

from app.database.session import SessionLocal
from app.repositories.document_repository import DocumentRepository
from app.services.semantic_service import SemanticService


router = APIRouter()

db = SessionLocal()

repository = DocumentRepository(db)

semantic_service = SemanticService(repository)


@router.get("/semantic-search")
async def semantic_search(
    q: str = Query(..., min_length=1)
):

    results = semantic_service.search(q)

    return [
        {
            "filename": result["document"].filename,
            "score": result["score"],
            "path": result["document"].file_path
        }
        for result in results
    ]