import faiss
import numpy as np

from app.semantic.embedding_service import EmbeddingService


class SemanticSearch:

    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.index = None
        self.documents = []

    def build_index(self, documents):

        self.documents = documents

        if not documents:
            self.index = None
            return

        embeddings = []

        for document in documents:
            vector = self.embedding_service.encode(document.text)
            embeddings.append(vector)

        embeddings = np.array(embeddings).astype("float32")

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatIP(dimension)

        self.index.add(embeddings)

    def search(self, query, top_k=3):

        if self.index is None:
            return []

        query_vector = self.embedding_service.encode(query)

        query_vector = np.array(
            [query_vector]
        ).astype("float32")

        scores, indices = self.index.search(
            query_vector,
            min(top_k, len(self.documents))
        )

        results = []

        for score, index in zip(scores[0], indices[0]):

            if index == -1:
                continue

            results.append({
                "document": self.documents[index],
                "score": float(score)
            })

        return results