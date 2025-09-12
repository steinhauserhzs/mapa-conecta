import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useContentSync } from '@/hooks/useContentSync';

interface Profile {
  id: string;
  auth_user_id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: any }>;
  demoSignIn: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { checkContentVersion } = useContentSync();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        // Ensure profile exists via edge function, then try again
        try {
          const { error: fnError } = await supabase.functions.invoke('ensure-profile', {
            headers: { Authorization: `Bearer ${session?.access_token ?? ''}` }
          });
          if (fnError) {
            console.error('Error ensuring profile:', fnError);
            return;
          }
          const { data: data2, error: error2 } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', userId)
            .maybeSingle();
          if (!error2 && data2) {
            setProfile(data2);
          }
        } catch (err) {
          console.error('Error invoking ensure-profile:', err);
        }
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer async operation
          setTimeout(() => {
            fetchProfile(session.user.id);
            // Verifica e atualiza conteúdo automaticamente após login
            checkContentVersion();
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });

      return {};
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: name ? { name } : undefined,
        }
      });

      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });

      return {};
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const demoSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting demo login...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'steinhauser.haira@gmail.com',
        password: 'Je110500@',
      });

      if (error) {
        console.error('Demo login error:', error);
        toast({
          title: "Erro no login DEMO",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Demo login successful!');
      toast({
        title: "Login DEMO realizado!",
        description: "Bem-vindo ao sistema de demonstração.",
      });

      return { error: null };
    } catch (error) {
      console.error('Unexpected error in demoSignIn:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro durante o login DEMO.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting logout process...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      console.log('Supabase signOut result:', error);
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Logout successful, clearing state...');
        
        // Clear auth state
        setUser(null);
        setProfile(null);
        setSession(null);
        
        // Clear Zustand store state
        if (typeof window !== 'undefined') {
          // Clear app store
          const { useAppStore } = await import('@/store/useAppStore');
          const { setUser: setAppUser, setDemoFlag } = useAppStore.getState();
          setAppUser(null);
          setDemoFlag(false);
        }
        
        toast({
          title: "Logout realizado com sucesso!",
          description: "Você foi desconectado.",
        });
        
        console.log('Redirecting to auth...');
        // Force redirect to auth page without keeping history
        window.location.replace('/auth');
      }
    } catch (error) {
      console.error('Unexpected error in signOut:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    demoSignIn,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};