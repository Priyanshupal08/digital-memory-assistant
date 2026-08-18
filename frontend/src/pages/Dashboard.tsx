import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  MessageSquare,
  Upload,
  Database,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type Document = {
  id: number;
  filename: string;
  type: string;
  path: string;
};

type Props = {
  onNavigate: (page: string) => void;
};

export default function Dashboard({ onNavigate }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/documents");

      if (!response.ok) {
        throw new Error("Failed to load documents");
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="min-h-screen p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-3 text-slate-400">
          Your digital memory is ready. Search, explore and chat with
          your documents.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">

        {/* Documents */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Indexed Documents
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {loading ? "..." : documents.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-600/20 p-3">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Documents available to your AI memory
          </p>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Search
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Ready
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-600/20 p-3">
              <Search className="h-6 w-6 text-emerald-400" />
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Search your indexed memories
          </p>
        </div>

        {/* AI */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                AI Assistant
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Ready
              </h2>
            </div>

            <div className="rounded-xl bg-purple-600/20 p-3">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-400" />
            Gemini connected
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8">

        <h2 className="mb-4 text-xl font-semibold">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <button
            onClick={() => onNavigate("documents")}
            className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-blue-500/50 hover:bg-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600/20 p-3">
                <Upload className="text-blue-400" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Upload Document
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new document
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
            />
          </button>

          <button
            onClick={() => onNavigate("search")}
            className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-emerald-500/50 hover:bg-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-600/20 p-3">
                <Search className="text-emerald-400" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Search Memory
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Find information quickly
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-400"
            />
          </button>

          <button
            onClick={() => onNavigate("chat")}
            className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-purple-500/50 hover:bg-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-600/20 p-3">
                <MessageSquare className="text-purple-400" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Ask AI
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Chat with your documents
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-purple-400"
            />
          </button>

        </div>

      </div>

      {/* Recent Documents */}
      <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Recent Documents
          </h2>

          <button
            onClick={() => onNavigate("documents")}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        {documents.length === 0 && !loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <Database className="mx-auto mb-3 text-slate-600" />

            <p className="text-slate-400">
              No documents have been indexed yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">

            {documents.slice(-5).reverse().map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:bg-slate-800"
              >
                <div className="rounded-lg bg-slate-800 p-3">
                  <FileText
                    size={20}
                    className="text-blue-400"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium">
                    {document.filename}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {document.type.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}