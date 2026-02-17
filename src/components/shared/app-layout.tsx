import { SidebarNav } from "@/components/shared/sidebar-nav";
import { BottomTabBar } from "@/components/shared/bottom-tab-bar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col border-r bg-card">
        <SidebarNav />
      </aside>

      {/* Main content */}
      <main className="md:pl-60">
        <div className="mx-auto max-w-[600px] px-4 pb-20 pt-6 md:pb-8 md:pt-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomTabBar className="md:hidden" />
    </div>
  );
}
