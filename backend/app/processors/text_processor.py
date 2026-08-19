from pathlib import Path

from app.domain.document import Document


def extract_text(file_path: str) -> Document:

    path = Path(file_path)

    text = path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    return Document(
        filename=path.name,
        file_path=str(path.resolve()),
        file_type=path.suffix.lower().replace(".", ""),
        text=text,
        metadata={}
    )