from fastapi import APIRouter

from app.dispatcher.dispatcher import ProcessorDispatcher


router = APIRouter()

dispatcher = ProcessorDispatcher()


@router.get("/read-pdf")
async def read_pdf():

    document = dispatcher.process("sample.pdf")

    return {
        "filename": document.filename,
        "file_type": document.file_type,
        "pages": document.metadata["pages"],
        "text": document.text[:1000],
    }