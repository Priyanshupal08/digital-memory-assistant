import { apiUrl } from "@/lib/api";
import { useState } from "react";
import {
  MessageSquare,
  Send,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";

type ChatResponse = {
  question: string;
  answer: string;
  sources: string[];
};

type Message = {
  id: number;
  question: string;
  answer: string;
  sources: string[];
};

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    try {
      setLoading(true);

      const response = await fetch(
        apiUrl(`/chat?q=${encodeURIComponent(currentQuestion)}`)
      );

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data: ChatResponse = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: currentQuestion,
          answer: data.answer,
          sources: data.sources || [],
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: currentQuestion,
          answer:
            "Sorry, I could not connect to the AI service. Please make sure the backend is running.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600/20 p-3">
              <MessageSquare className="h-7 w-7 text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold">
              AI Chat
            </h1>
          </div>

          <p className="mt-3 text-slate-400">
            Ask questions about your indexed documents.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <Trash2 size={16} />
            Clear Chat
          </button>
        )}

      </div>

      {/* Chat Messages */}
      <div className="mx-auto max-w-5xl space-y-6">

        {messages.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20">
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>

            <h2 className="text-xl font-semibold">
              Ask your documents anything
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
              Your AI assistant searches through your indexed documents
              and uses them to answer your questions.
            </p>

          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-4">

            {/* User Question */}
            <div className="flex justify-end">
              <div className="max-w-3xl rounded-2xl rounded-br-md bg-blue-600 px-5 py-4 text-white shadow-lg">

                <p className="text-sm font-medium text-blue-100">
                  You
                </p>

                <p className="mt-1">
                  {message.question}
                </p>

              </div>
            </div>

            {/* AI Answer */}
            <div className="flex justify-start">
              <div className="w-full max-w-4xl rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 p-6">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-blue-600/20 p-2">
                    <MessageSquare
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <h3 className="font-semibold">
                    AI Assistant
                  </h3>

                </div>

                {/* Answer */}
                <div className="mt-5 whitespace-pre-wrap leading-7 text-slate-300">
                  {message.answer}
                </div>

                {/* Sources */}
                {message.sources.length > 0 && (
                  <div className="mt-6 border-t border-slate-800 pt-5">

                    <div className="mb-3 flex items-center gap-2">
                      <FileText
                        size={17}
                        className="text-blue-400"
                      />

                      <p className="text-sm font-semibold text-slate-300">
                        Sources
                      </p>
                    </div>

                    {/* Primary Source */}
                    {message.sources[0] && (
                      <div className="mb-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">

                        <p className="mb-1 text-xs text-blue-400">
                          Most relevant document
                        </p>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                          <FileText
                            size={16}
                            className="text-blue-400"
                          />

                          {message.sources[0]}
                        </div>

                      </div>
                    )}

                    {/* Other Sources */}
                    {message.sources.length > 1 && (
                      <div>

                        <p className="mb-2 text-xs text-slate-500">
                          Other relevant documents
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {message.sources.slice(1).map(
                            (source, index) => (
                              <div
                                key={`${source}-${index}`}
                                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-400"
                              >
                                <FileText
                                  size={14}
                                  className="text-slate-500"
                                />

                                {source}
                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>

          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex justify-start">

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

              <Loader2
                size={20}
                className="animate-spin text-blue-400"
              />

              <span className="text-sm text-slate-400">
                AI is thinking...
              </span>

            </div>

          </div>
        )}

      </div>

      {/* Input */}
      <div className="sticky bottom-0 mx-auto mt-8 max-w-5xl bg-[#020617] py-4">

        <div className="flex gap-3">

          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your documents..."
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
          />

          <button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Send size={20} />
            )}

            {loading ? "Thinking..." : "Ask"}

          </button>

        </div>

        <p className="mt-2 text-center text-xs text-slate-600">
          Press Enter to ask
        </p>

      </div>

    </div>
  );
}