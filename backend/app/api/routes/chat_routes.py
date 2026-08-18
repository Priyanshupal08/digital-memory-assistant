from fastapi import APIRouter, Query

from app.database.session import SessionLocal
from app.repositories.document_repository import DocumentRepository
from app.services.ai_service import ask_ai
from app.semantic.semantic_search import SemanticSearch


router = APIRouter()

db = SessionLocal()
repository = DocumentRepository(db)


@router.get("/chat")
async def chat(q: str = Query(..., min_length=1)):

    documents = repository.get_all()

    if not documents:
        return {
            "answer": "No documents have been indexed yet.",
            "sources": []
        }

    # Build semantic index
    semantic_search = SemanticSearch()
    semantic_search.build_index(documents)

    # Find the most relevant documents
    results = semantic_search.search(
        q,
        min(3, len(documents))
    )

    # Use only relevant documents as AI context
    relevant_documents = [
        result["document"]
        for result in results
    ]

    context_parts = []

    for document in relevant_documents:
        context_parts.append(
            f"""
Document: {document.filename}

Content:
{document.text[:10000]}
"""
        )

    context = "\n".join(context_parts)

    answer = ask_ai(q, context)

    return {
        "question": q,
        "answer": answer,
        "sources": [
            document.filename
            for document in relevant_documents
        ]
    }