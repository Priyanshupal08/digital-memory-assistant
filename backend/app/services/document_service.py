from app.repositories.document_repository import DocumentRepository


class DocumentService:

    def __init__(self, repository: DocumentRepository):
        self.repository = repository

    def save_document(self, document):

        return self.repository.save(document)

    def get_documents(self):

        return self.repository.get_all()

    def search_documents(self, query):

        return self.repository.search(query)


    def delete_document(self, file_path):

        return self.repository.delete_by_path(file_path)