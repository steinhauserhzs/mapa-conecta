import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  manageSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();
  
  // Cache management
  const cacheRef = useRef<{
    data: { subscribed: boolean; subscription_end: string | null } | null;
    timestamp: number;
  }>({ data: null, timestamp: 0 });
  
  const debounceRef = useRef<NodeJS.Timeout>();

  const checkSubscription = useCallback(async (force = false) => {
    if (!session?.access_token) return;

    // Check cache first (5 minutes TTL)
    const now = Date.now();
    const cacheAge = now - cacheRef.current.timestamp;
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    if (!force && cacheRef.current.data && cacheAge < CACHE_TTL) {
      setSubscribed(cacheRef.current.data.subscribed);
      setSubscriptionEnd(cacheRef.current.data.subscription_end);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      const subscriptionData = {
        subscribed: data.subscribed || false,
        subscription_end: data.subscription_end || null
      };

      // Update cache
      cacheRef.current = {
        data: subscriptionData,
        timestamp: now
      };

      setSubscribed(subscriptionData.subscribed);
      setSubscriptionEnd(subscriptionData.subscription_end);
    } catch (error) {
      console.error('Error in checkSubscription:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  const createCheckout = async () => {
    if (!session?.access_token) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar checkout. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error in createCheckout:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const manageSubscription = async () => {
    if (!session?.access_token) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerenciar sua assinatura.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error accessing customer portal:', error);
        toast({
          title: "Erro",
          description: "Erro ao acessar portal de gerenciamento. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Open customer portal in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error in manageSubscription:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounced subscription check
  const debouncedCheckSubscription = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (user && session) {
        checkSubscription();
      } else {
        setSubscribed(false);
        setSubscriptionEnd(null);
        cacheRef.current = { data: null, timestamp: 0 };
      }
    }, 500);
  }, [user, session, checkSubscription]);

  // Check subscription on auth state change with debounce
  useEffect(() => {
    debouncedCheckSubscription();
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [debouncedCheckSubscription]);

  const value: SubscriptionContextType = {
    subscribed,
    subscriptionEnd,
    loading,
    checkSubscription,
    createCheckout,
    manageSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};