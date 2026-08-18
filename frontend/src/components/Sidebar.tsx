import {
  Home,
  Search,
  Folder,
  MessageSquare,
} from "lucide-react";

type Props = {
  onNavigate: (page: string) => void;
};

export default function Sidebar({ onNavigate }: Props) {
  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-900">
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          🧠 Memory
        </h1>
      </div>

      <nav className="space-y-2 px-4">

        <button
          onClick={() => onNavigate("home")}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          <Home size={20} />
          Home
        </button>

        <button
          onClick={() => onNavigate("search")}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          <Search size={20} />
          Search
        </button>

        <button
          onClick={() => onNavigate("documents")}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          <Folder size={20} />
          Documents
        </button>

        <button
          onClick={() => onNavigate("chat")}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          <MessageSquare size={20} />
          AI Chat
        </button>

      </nav>
    </aside>
  );
}