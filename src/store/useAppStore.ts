import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface AppState {
  // Demo mode
  demoFlag: boolean;
  setDemoFlag: (flag: boolean) => void;
  
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Demo mode
      demoFlag: false,
      setDemoFlag: (flag) => set({ demoFlag: flag }),
      
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        demoFlag: state.demoFlag,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);