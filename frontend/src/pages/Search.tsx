import { useState } from "react";
import { Search as SearchIcon, FileText } from "lucide-react";

type SearchResult = {
  id: number;
  filename: string;
  type: string;
  path: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-4xl">

        <h1 className="text-4xl font-bold">
          Search Your Memory
        </h1>

        <p className="mt-2 text-slate-400">
          Find information across your indexed documents.
        </p>

        <div className="mt-8 flex gap-3">

          <div className="flex flex-1 items-center rounded-xl border border-slate-700 bg-slate-900 px-4">
            <SearchIcon size={20} className="text-slate-400" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search your documents..."
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500"
          >
            Search
          </button>

        </div>

        <div className="mt-8">

          {loading && (
            <p className="text-slate-400">
              Searching...
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-slate-400">
              No documents found.
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">

              <p className="text-sm text-slate-400">
                {results.length} result(s) found
              </p>

              {results.map((document) => (
                <div
                  key={document.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-center gap-4">

                    <div className="rounded-lg bg-slate-800 p-3">
                      <FileText size={24} />
                    </div>

                    <div>
                      <h2 className="font-semibold">
                        {document.filename}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        Type: {document.type.toUpperCase()}
                      </p>
                    </div>

                  </div>

                  <p className="mt-4 break-all text-sm text-slate-500">
                    {document.path}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}