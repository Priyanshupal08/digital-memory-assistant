import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Search from "@/pages/Search";
import Chat from "@/pages/Chat";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <MainLayout onNavigate={setPage}>
      {page === "home" && <Dashboard onNavigate={setPage} />}
      {page === "documents" && <Documents />}
      {page === "search" && <Search />}
      {page === "chat" && <Chat />}
    </MainLayout>
  );
}