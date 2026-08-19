from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.document_model import DocumentModel


class DocumentRepository:

    def __init__(self, db: Session):
        self.db = db

    def save(self, document):

        existing = (
            self.db.query(DocumentModel)
            .filter(DocumentModel.file_path == document.file_path)
            .first()
        )

        if existing:

            if existing.text == document.text:
                return existing

            existing.filename = document.filename
            existing.file_type = document.file_type
            existing.text = document.text

            self.db.commit()
            self.db.refresh(existing)

            return existing

        if self.exists_by_text(document.text):
            return None

        db_document = DocumentModel(
            filename=document.filename,
            file_path=document.file_path,
            file_type=document.file_type,
            text=document.text,
        )

        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)

        return db_document
    

    def get_all(self):

        return self.db.query(DocumentModel).all()

    def exists(self, file_path):

        return (
            self.db.query(DocumentModel)
            .filter(DocumentModel.file_path == file_path)
            .first()
            is not None
        )

    def exists_by_text(self, text):

        return (
            self.db.query(DocumentModel)
            .filter(DocumentModel.text == text)
            .first()
            is not None
        )

    def search(self, query):

        return (
            self.db.query(DocumentModel)
            .filter(
                or_(
                    DocumentModel.filename.ilike(f"%{query}%"),
                    DocumentModel.text.ilike(f"%{query}%"),
                )
            )
            .all()
        )


    def delete_by_path(self, file_path):

        document = (
            self.db.query(DocumentModel)
            .filter(DocumentModel.file_path == file_path)
            .first()
        )

        if not document:
            return False

        self.db.delete(document)
        self.db.commit()

        return True