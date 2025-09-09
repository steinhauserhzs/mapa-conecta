import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, Building2, Baby, Heart, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMapCreated?: () => void;
}

type MapType = 'personal' | 'business' | 'baby' | 'marriage';

interface MapData {
  type: MapType;
  title: string;
  personal?: {
    birthName: string;
    birthDate: Date | null;
    birthPlace: string;
    currentName?: string;
  };
  business?: {
    businessName: string;
    openingDate: Date | null;
    tradeName?: string;
    address?: string;
  };
  baby?: {
    motherName: string;
    fatherName: string;
    expectedDate: Date | null;
    nameOptions: string[];
  };
  marriage?: {
    person1Name: string;
    person1BirthDate: Date | null;
    person2Name: string;
    person2BirthDate: Date | null;
    marriageDate?: Date | null;
  };
}

export const CreateMapModal = ({ open, onOpenChange, onMapCreated }: CreateMapModalProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<MapData>({
    type: 'personal',
    title: '',
  });

  const mapTypes = [
    { value: 'personal', label: 'Mapa Pessoal', icon: User, description: 'Análise numerológica individual completa' },
    { value: 'business', label: 'Mapa Empresarial', icon: Building2, description: 'Análise de empresa ou marca' },
    { value: 'baby', label: 'Mapa Bebê/Criança', icon: Baby, description: 'Análise de nomes para bebês' },
    { value: 'marriage', label: 'Mapa Casamento', icon: Heart, description: 'Análise de compatibilidade de casal' },
  ];

  const handleTypeChange = (type: string) => {
    setMapData({
      type: type as MapType,
      title: '',
      [type]: {}
    });
  };

  const handleCreateMap = async () => {
    if (!profile || !mapData.title.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha o título do mapa.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare input data based on map type
      let input = {};
      
      switch (mapData.type) {
        case 'personal':
          if (!mapData.personal?.birthName || !mapData.personal?.birthDate) {
            toast({
              title: "Dados incompletos",
              description: "Nome de nascimento e data são obrigatórios.",
              variant: "destructive",
            });
            return;
          }
          input = {
            birth_name: mapData.personal.birthName,
            birth_date: format(mapData.personal.birthDate, 'yyyy-MM-dd'),
            birth_place: mapData.personal.birthPlace,
            current_name: mapData.personal.currentName,
          };
          break;
          
        case 'business':
          if (!mapData.business?.businessName || !mapData.business?.openingDate) {
            toast({
              title: "Dados incompletos",
              description: "Nome da empresa e data de abertura são obrigatórios.",
              variant: "destructive",
            });
            return;
          }
          input = {
            business_name: mapData.business.businessName,
            business_opening_date: format(mapData.business.openingDate, 'yyyy-MM-dd'),
            trade_name: mapData.business.tradeName,
            address: mapData.business.address,
          };
          break;
          
        case 'baby':
          if (!mapData.baby?.motherName || !mapData.baby?.fatherName || !mapData.baby?.nameOptions?.length) {
            toast({
              title: "Dados incompletos",
              description: "Nomes dos pais e opções de nomes são obrigatórios.",
              variant: "destructive",
            });
            return;
          }
          input = {
            mother_name: mapData.baby.motherName,
            father_name: mapData.baby.fatherName,
            expected_date: mapData.baby.expectedDate ? format(mapData.baby.expectedDate, 'yyyy-MM-dd') : null,
            name_options: mapData.baby.nameOptions,
          };
          break;
          
        case 'marriage':
          if (!mapData.marriage?.person1Name || !mapData.marriage?.person2Name || 
              !mapData.marriage?.person1BirthDate || !mapData.marriage?.person2BirthDate) {
            toast({
              title: "Dados incompletos",
              description: "Nomes e datas de nascimento do casal são obrigatórios.",
              variant: "destructive",
            });
            return;
          }
          input = {
            person1: {
              name: mapData.marriage.person1Name,
              birth_date: format(mapData.marriage.person1BirthDate, 'yyyy-MM-dd'),
            },
            person2: {
              name: mapData.marriage.person2Name,
              birth_date: format(mapData.marriage.person2BirthDate, 'yyyy-MM-dd'),
            },
            marriage_date: mapData.marriage.marriageDate ? format(mapData.marriage.marriageDate, 'yyyy-MM-dd') : null,
          };
          break;
      }

      // Create map in database
      const { data, error } = await supabase
        .from('maps')
        .insert({
          user_id: profile.id,
          type: mapData.type,
          title: mapData.title.trim(),
          input,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Mapa criado com sucesso!",
        description: "Você pode agora calcular e gerar o relatório.",
      });

      onOpenChange(false);
      if (onMapCreated) onMapCreated();

      // Reset form
      setMapData({ type: 'personal', title: '' });

    } catch (error: any) {
      console.error('Error creating map:', error);
      toast({
        title: "Erro ao criar mapa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="birthName">Nome completo de nascimento *</Label>
        <Input
          id="birthName"
          placeholder="Digite o nome completo de nascimento"
          value={mapData.personal?.birthName || ''}
          onChange={(e) => setMapData(prev => ({
            ...prev,
            personal: { ...prev.personal, birthName: e.target.value }
          }))}
        />
      </div>
      
      <div>
        <Label>Data de nascimento *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {mapData.personal?.birthDate ? (
                format(mapData.personal.birthDate, "PPP", { locale: ptBR })
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={mapData.personal?.birthDate || undefined}
              onSelect={(date) => setMapData(prev => ({
                ...prev,
                personal: { ...prev.personal, birthDate: date || null }
              }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="birthPlace">Local de nascimento</Label>
        <Input
          id="birthPlace"
          placeholder="Cidade, Estado, País"
          value={mapData.personal?.birthPlace || ''}
          onChange={(e) => setMapData(prev => ({
            ...prev,
            personal: { ...prev.personal, birthPlace: e.target.value }
          }))}
        />
      </div>

      <div>
        <Label htmlFor="currentName">Nome atual (se diferente)</Label>
        <Input
          id="currentName"
          placeholder="Nome usado atualmente"
          value={mapData.personal?.currentName || ''}
          onChange={(e) => setMapData(prev => ({
            ...prev,
            personal: { ...prev.personal, currentName: e.target.value }
          }))}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Mapa Numerológico</DialogTitle>
          <DialogDescription>
            Escolha o tipo de mapa e preencha as informações necessárias
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Map Type Selection */}
          <div>
            <Label className="text-base font-semibold">Tipo de Mapa</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {mapTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      mapData.type === type.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleTypeChange(type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold text-sm">{type.label}</h4>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Map Title */}
          <div>
            <Label htmlFor="mapTitle">Título do Mapa *</Label>
            <Input
              id="mapTitle"
              placeholder="Ex: Mapa Numerológico - João Silva"
              value={mapData.title}
              onChange={(e) => setMapData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Type-specific forms */}
          {mapData.type === 'personal' && renderPersonalForm()}
          
          {mapData.type === 'business' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Nome da empresa/marca *</Label>
                <Input
                  id="businessName"
                  placeholder="Razão social ou nome fantasia"
                  value={mapData.business?.businessName || ''}
                  onChange={(e) => setMapData(prev => ({
                    ...prev,
                    business: { ...prev.business, businessName: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <Label>Data de abertura/fundação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {mapData.business?.openingDate ? (
                        format(mapData.business.openingDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={mapData.business?.openingDate || undefined}
                      onSelect={(date) => setMapData(prev => ({
                        ...prev,
                        business: { ...prev.business, openingDate: date || null }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {mapData.type === 'baby' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="motherName">Nome da mãe *</Label>
                  <Input
                    id="motherName"
                    placeholder="Nome completo da mãe"
                    value={mapData.baby?.motherName || ''}
                    onChange={(e) => setMapData(prev => ({
                      ...prev,
                      baby: { ...prev.baby, motherName: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName">Nome do pai *</Label>
                  <Input
                    id="fatherName"
                    placeholder="Nome completo do pai"
                    value={mapData.baby?.fatherName || ''}
                    onChange={(e) => setMapData(prev => ({
                      ...prev,
                      baby: { ...prev.baby, fatherName: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="nameOptions">Opções de nomes *</Label>
                <Textarea
                  id="nameOptions"
                  placeholder="Digite os nomes separados por vírgula (ex: Ana Maria, João Pedro, Sofia)"
                  value={mapData.baby?.nameOptions?.join(', ') || ''}
                  onChange={(e) => {
                    const names = e.target.value.split(',').map(name => name.trim()).filter(name => name);
                    setMapData(prev => ({
                      ...prev,
                      baby: { ...prev.baby, nameOptions: names }
                    }));
                  }}
                />
              </div>
            </div>
          )}

          {mapData.type === 'marriage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="person1Name">Nome da primeira pessoa *</Label>
                  <Input
                    id="person1Name"
                    placeholder="Nome completo"
                    value={mapData.marriage?.person1Name || ''}
                    onChange={(e) => setMapData(prev => ({
                      ...prev,
                      marriage: { ...prev.marriage, person1Name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="person2Name">Nome da segunda pessoa *</Label>
                  <Input
                    id="person2Name"
                    placeholder="Nome completo"
                    value={mapData.marriage?.person2Name || ''}
                    onChange={(e) => setMapData(prev => ({
                      ...prev,
                      marriage: { ...prev.marriage, person2Name: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateMap} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Mapa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};