import { apiUrl } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { FileText, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Document = {
  id: number;
  filename: string;
  type: string;
  path: string;
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        apiUrl("/documents")
      );

      if (!response.ok) {
        throw new Error("Failed to load documents");
      }

      const data = await response.json();

      setDocuments(data);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const uploadDocument = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(
        apiUrl("/upload"),
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      setMessage(data.message);

      await loadDocuments();

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Upload failed"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-10">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Documents
          </h1>

          <p className="mt-2 text-slate-400">
            Your indexed files and memories
          </p>
        </div>

        <div className="flex gap-3">

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={uploadDocument}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />

            {uploading ? "Indexing..." : "Upload PDF"}
          </Button>

          <Button
            variant="outline"
            onClick={loadDocuments}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

        </div>
      </div>

      {message && (
        <div className="mt-6 rounded-lg border border-green-800 bg-green-950/40 p-4 text-green-400">
          {message}
        </div>
      )}

      {loading && (
        <p className="mt-8 text-slate-400">
          Loading documents...
        </p>
      )}

      {error && (
        <p className="mt-8 text-red-400">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        documents.length === 0 && (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">

            <FileText className="mx-auto mb-4 h-10 w-10 text-slate-500" />

            <h2 className="text-xl font-semibold">
              No documents found
            </h2>

            <p className="mt-2 text-slate-400">
              Upload a PDF to add it to your digital memory.
            </p>

          </div>
        )}

      {!loading &&
        !error &&
        documents.length > 0 && (

          <div className="mt-8 grid gap-4">

            {documents.map((document) => (

              <div
                key={document.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-start gap-4">

                  <div className="rounded-lg bg-slate-800 p-3">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">

                    <h2 className="text-lg font-semibold">
                      {document.filename}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Type: {document.type.toUpperCase()}
                    </p>

                    <p className="mt-2 break-all text-sm text-slate-500">
                      {document.path}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}
    </div>
  );
}