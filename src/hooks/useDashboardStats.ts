import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  mapsCount: number;
  analysesCount: number;
  clientsCount: number;
  loading: boolean;
}

export const useDashboardStats = (): DashboardStats => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    mapsCount: 0,
    analysesCount: 0,
    clientsCount: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.id) return;

      try {
        // Buscar contagem de mapas
        const { count: mapsCount } = await supabase
          .from('maps')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Buscar contagem de análises
        const { count: analysesCount } = await supabase
          .from('analyses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Buscar contagem de clientes
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        setStats({
          mapsCount: mapsCount || 0,
          analysesCount: analysesCount || 0,
          clientsCount: clientsCount || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [profile?.id]);

  return stats;
};