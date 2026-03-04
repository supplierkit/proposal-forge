import { Sidebar } from "@/components/dashboard/sidebar";
import { TourProvider } from "@/components/walkthrough/tour-provider";
import { TourPanel } from "@/components/walkthrough/tour-panel";
import { AUTH_DISABLED } from "@/lib/auth-config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#F6F7F8]">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );

  if (!AUTH_DISABLED) return content;

  return (
    <TourProvider>
      {content}
      <TourPanel />
    </TourProvider>
  );
}
