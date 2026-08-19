from pathlib import Path

from app.processors.pdf_processor import extract_pdf
from app.processors.text_processor import extract_text


class ProcessorDispatcher:

    def process(self, file_path: str):

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            return extract_pdf(file_path)

        if extension in {
            ".txt",
            ".md",
            ".py",
            ".cpp",
            ".java",
        }:
            return extract_text(file_path)

        raise ValueError(f"Unsupported file type: {extension}")