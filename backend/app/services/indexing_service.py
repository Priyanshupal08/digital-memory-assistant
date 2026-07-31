from app.dispatcher.dispatcher import ProcessorDispatcher


class IndexingService:

    def __init__(self, document_service):

        self.dispatcher = ProcessorDispatcher()

        self.document_service = document_service

    def index_folder(self, folder):

        from app.indexer.watcher import scan_directory

        indexed = []

        files = scan_directory(folder)

        for file in files:

            try:

                document = self.dispatcher.process(str(file))

                self.document_service.save_document(document)

                indexed.append(document)

            except Exception as e:

                print(e)

        return indexed