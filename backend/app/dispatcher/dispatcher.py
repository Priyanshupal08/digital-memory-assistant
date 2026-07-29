from pathlib import Path

from app.processors.pdf_processor import extract_pdf


class ProcessorDispatcher:

    def process(self, file_path: str):

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            return extract_pdf(file_path)

        raise ValueError(f"Unsupported file type: {extension}")