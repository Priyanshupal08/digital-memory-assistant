from sqlalchemy.orm import Session

from app.models.document_model import DocumentModel


class DocumentRepository:

    def __init__(self, db: Session):
        self.db = db

    def save(self, document):

        if self.exists(document.file_path):
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