import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MapCardProps {
  map: {
    id: string;
    title: string;
    type: string;
    status: string;
    created_at: string;
  };
  getMapTypeLabel: (type: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

export const MapCard = memo(({ map, getMapTypeLabel, getStatusBadge }: MapCardProps) => {
  return (
    <Card className="bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-semibold text-sm sm:text-base">{map.title}</h3>
            {getStatusBadge(map.status)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>Tipo: {getMapTypeLabel(map.type)}</span>
            <span>Criado: {new Date(map.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="min-h-[40px] text-xs">
            Editar
          </Button>
          <Button variant="default" size="sm" className="min-h-[40px] text-xs">
            Ver Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

MapCard.displayName = 'MapCard';