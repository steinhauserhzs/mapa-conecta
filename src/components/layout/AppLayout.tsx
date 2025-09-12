import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
  const { profile } = useAuth();
  const { setUser } = useAppStore();

  useEffect(() => {
    if (profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name || '',
        role: profile.role as 'admin' | 'editor' | 'viewer'
      });
    } else {
      setUser(null);
    }
  }, [profile, setUser]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/20 to-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background/80 to-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}