from app.semantic.semantic_search import SemanticSearch


class SemanticService:

    def __init__(self, repository):
        self.repository = repository
        self.search_engine = SemanticSearch()

    def build_index(self):

        documents = self.repository.get_all()

        self.search_engine.build_index(documents)

        return len(documents)

    def search(self, query, top_k=3):

        if self.search_engine.index is None:
            self.build_index()

        return self.search_engine.search(
            query,
            top_k
        )