from pathlib import Path

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from app.indexer.watcher import SUPPORTED_EXTENSIONS, IGNORED_FOLDERS
from app.services.indexing_service import IndexingService
from app.services.document_service import DocumentService
from app.repositories.document_repository import DocumentRepository
from app.database.connection import SessionLocal, create_database

class MemoryFileHandler(FileSystemEventHandler):

    def __init__(self, indexing_service):
        self.indexing_service = indexing_service

    def process_file(self, file_path: str):

        path = Path(file_path)

        if not path.is_file():
            return

        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            return

        if any(part in IGNORED_FOLDERS for part in path.parts):
            return

        try:
            document = self.indexing_service.dispatcher.process(
                str(path)
            )

            saved = self.indexing_service.document_service.save_document(
                document
            )

            if saved:
                print(f"Indexed: {path}")

        except Exception as e:
            print(f"Failed to index {path}: {e}")


    def on_created(self, event):

        if not event.is_directory:
            print(f"NEW FILE: {event.src_path}")
            self.process_file(event.src_path)


    def on_modified(self, event):

        if not event.is_directory:
            print(f"FILE MODIFIED: {event.src_path}")
            self.process_file(event.src_path)


    def on_deleted(self, event):

        if not event.is_directory:
        
            try:
                deleted = self.indexing_service.document_service.delete_document(
                    event.src_path
                )
    
                if deleted:
                    print(f"Removed from memory: {event.src_path}")
    
            except Exception as e:
                print(f"Failed to remove {event.src_path}: {e}")


class FolderWatcher:

    def __init__(self, indexing_service):
        self.indexing_service = indexing_service
        self.observers = []

    def watch(self, folder: str):

        folder_path = Path(folder).resolve()

        if not folder_path.exists():
            raise ValueError(f"Folder does not exist: {folder}")

        if not folder_path.is_dir():
            raise ValueError(f"Not a folder: {folder}")

        handler = MemoryFileHandler(self.indexing_service)

        observer = Observer()

        observer.schedule(
            handler,
            str(folder_path),
            recursive=True
        )

        observer.start()

        self.observers.append(observer)

        print(f"Watching folder: {folder_path}")
        print("Create or copy a file into this folder...")
        print("Press CTRL+C to stop.")

    def stop(self):

        for observer in self.observers:
            observer.stop()

        for observer in self.observers:
            observer.join()

        self.observers.clear()


if __name__ == "__main__":

    folder = input("Enter folder to watch: ").strip()

    create_database()

    db = SessionLocal()

    repository = DocumentRepository(db)

    document_service = DocumentService(repository)

    indexing_service = IndexingService(document_service)

    watcher = FolderWatcher(indexing_service)

    try:
        watcher.watch(folder)

        while True:
            pass

    except KeyboardInterrupt:
        print("\nStopping watcher...")
        watcher.stop()

    finally:
        db.close()