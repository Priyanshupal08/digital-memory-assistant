from pathlib import Path

SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".pptx",
    ".txt",
    ".md",
    ".png",
    ".jpg",
    ".jpeg",
    ".mp3",
    ".wav",
    ".mp4",
    ".py",
    ".cpp",
    ".java",
}

IGNORED_FOLDERS = {
    "venv",
    ".venv",
    "__pycache__",
    ".git",
    "node_modules",
    ".idea",
    ".vscode",
    "dist",
    "build",
}


def scan_directory(folder: str):
    folder_path = Path(folder)

    indexed_files = []

    for file in folder_path.rglob("*"):

        # Skip directories
        if not file.is_file():
            continue

        # Skip ignored folders
        if any(part in IGNORED_FOLDERS for part in file.parts):
            continue

        # Skip unsupported extensions
        if file.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        indexed_files.append(file)

    return indexed_files