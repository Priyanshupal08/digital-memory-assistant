import { apiUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  MessageSquare,
  Upload,
  Database,
  CheckCircle2,
  ArrowRight,
  Folder,
  Play,
  Square,
} from "lucide-react";

type Document = {
  id: number;
  filename: string;
  type: string;
  path: string;
};

type WatchStatus = {
  watching: boolean;
  folder: string | null;
};

type Props = {
  onNavigate: (page: string) => void;
};

export default function Dashboard({ onNavigate }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const [folder, setFolder] = useState("");
  const [watchStatus, setWatchStatus] = useState<WatchStatus>({
    watching: false,
    folder: null,
  });

  const [watchLoading, setWatchLoading] = useState(false);
  const [watchMessage, setWatchMessage] = useState("");

  const loadDocuments = async () => {
    try {
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
    } finally {
      setLoading(false);
    }
  };

  const loadWatchStatus = async () => {
    try {
      const response = await fetch(
        apiUrl("/watch/status")
      );

      if (!response.ok) {
        throw new Error("Failed to load watch status");
      }

      const data = await response.json();

      setWatchStatus(data);

      if (data.folder) {
        setFolder(data.folder);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startWatching = async () => {
    if (!folder.trim()) {
      setWatchMessage("Please enter a folder path.");
      return;
    }

    setWatchLoading(true);
    setWatchMessage("");

    try {
      const response = await fetch(
        apiUrl("/watch/start"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            folder: folder.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to start monitoring");
      }

      setWatchStatus({
        watching: true,
        folder: data.folder,
      });

      setFolder(data.folder);

      setWatchMessage(
        "Folder monitoring started successfully."
      );

      await loadDocuments();
    } catch (error) {
      console.error(error);

      setWatchMessage(
        error instanceof Error
          ? error.message
          : "Failed to start monitoring."
      );
    } finally {
      setWatchLoading(false);
    }
  };

  const stopWatching = async () => {
    setWatchLoading(true);
    setWatchMessage("");

    try {
      const response = await fetch(
        apiUrl("/watch/stop"),
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to stop monitoring");
      }

      setWatchStatus({
        watching: false,
        folder: null,
      });

      setWatchMessage(
        "Folder monitoring stopped."
      );
    } catch (error) {
      console.error(error);

      setWatchMessage(
        error instanceof Error
          ? error.message
          : "Failed to stop monitoring."
      );
    } finally {
      setWatchLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadWatchStatus();
  }, []);

  useEffect(() => {
    if (!watchStatus.watching) {
      return;
    }

    const interval = setInterval(() => {
      loadDocuments();
      loadWatchStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [watchStatus.watching]);

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

      {/* Local Memory */}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600/20 p-3">
            <Folder className="text-blue-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Local Memory
            </h2>

            <p className="text-sm text-slate-500">
              Automatically index files from a folder on your PC.
            </p>
          </div>
        </div>

        <div className="mt-6">

          <label className="mb-2 block text-sm text-slate-400">
            Folder to monitor
          </label>

          <div className="flex gap-3">

            <input
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              disabled={watchStatus.watching}
              placeholder="Example: C:\DigitalMemoryTest"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
            />

            {!watchStatus.watching ? (
              <button
                onClick={startWatching}
                disabled={watchLoading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={18} />
                {watchLoading ? "Starting..." : "Start Monitoring"}
              </button>
            ) : (
              <button
                onClick={stopWatching}
                disabled={watchLoading}
                className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                <Square size={17} />
                {watchLoading ? "Stopping..." : "Stop Monitoring"}
              </button>
            )}

          </div>

          {/* Status */}
          <div className="mt-5 flex items-center gap-3">

            <span
              className={`h-3 w-3 rounded-full ${
                watchStatus.watching
                  ? "bg-emerald-400"
                  : "bg-slate-600"
              }`}
            />

            <span
              className={
                watchStatus.watching
                  ? "text-emerald-400"
                  : "text-slate-400"
              }
            >
              {watchStatus.watching
                ? "Monitoring Active"
                : "Monitoring Inactive"}
            </span>

          </div>

          {watchStatus.folder && (
            <p className="mt-2 break-all text-sm text-slate-500">
              Watching: {watchStatus.folder}
            </p>
          )}

          {watchMessage && (
            <p className="mt-4 text-sm text-slate-400">
              {watchMessage}
            </p>
          )}

        </div>
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