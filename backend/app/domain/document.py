from dataclasses import dataclass, field
from typing import Any


@dataclass
class Document:
    filename: str
    file_path: str
    file_type: str

    text: str

    metadata: dict[str, Any] = field(default_factory=dict)

    status: str = "processed"