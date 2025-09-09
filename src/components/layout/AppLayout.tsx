import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
  const { user: authUser, profile, loading } = useAuth();
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!authUser) {
        navigate('/auth');
      } else if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name || '',
          role: profile.role as 'admin' | 'editor' | 'viewer'
        });
      }
    }
  }, [authUser, profile, loading, setUser, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}