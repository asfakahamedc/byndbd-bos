import AdaptiveSidebar from "@/components/shared/adaptive-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdaptiveSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
