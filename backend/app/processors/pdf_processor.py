import fitz
from pathlib import Path

from app.domain.document import Document


def extract_pdf(pdf_path: str) -> Document:

    pdf = fitz.open(pdf_path)

    text = ""

    for page in pdf:
        text += page.get_text()

    document = Document(
        filename=Path(pdf_path).name,
        file_path=str(Path(pdf_path).resolve()),
        file_type="pdf",
        text=text,
        metadata={
            "pages": len(pdf)
        }
    )

    pdf.close()

    return document