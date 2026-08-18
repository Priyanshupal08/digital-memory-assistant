import Sidebar from "@/components/Sidebar";

type Props = {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
};

export default function MainLayout({ children, onNavigate }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar onNavigate={onNavigate} />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}