import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Info, Building, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados das áreas de atuação
const areasAtuacao = [
  { area: 'Academias de ginástica', numeros: [1, 3] },
  { area: 'Agricultura', numeros: [6] },
  { area: 'Arte em geral', numeros: [3] },
  { area: 'Automobilismo', numeros: [1, 5] },
  { area: 'Animais em geral', numeros: [6, 7] },
  { area: 'Aeronáutica', numeros: [3, 5] },
  { area: 'Construção civil', numeros: [1, 4] },
  { area: 'Contabilidade', numeros: [2, 4] },
  { area: 'Couro (todos os artigos)', numeros: [3, 11] },
  { area: 'Crianças (trabalhar com)', numeros: [6, 7, 9] },
  { area: 'Comunicação (geral)', numeros: [3] },
  { area: 'Chefia em geral', numeros: [1, 8] },
  { area: 'Decoração', numeros: [2, 3, 6] },
  { area: 'Direito (todos)', numeros: [7, 8, 9] },
  { area: 'Diversão', numeros: [3, 5] },
  { area: 'Ecologia', numeros: [2, 6] },
  { area: 'Enfermagem', numeros: [2, 6] },
  { area: 'Erotismo', numeros: [3, 8] },
  { area: 'Escolas (geral)', numeros: [2, 6, 9] },
  { area: 'Esoterismo (todos)', numeros: [7, 9, 11] },
  { area: 'Esporte (todos)', numeros: [1, 3] },
  { area: 'Estética e beleza', numeros: [3] },
  { area: 'Eletrônica', numeros: [7] },
  { area: 'Finanças (todas)', numeros: [1, 4, 8] },
  { area: 'Forças Armadas (Exército)', numeros: [4] },
  { area: 'Forças Armadas (Aeronáutica)', numeros: [3, 11, 22] },
  { area: 'Forças Armadas (Marinha)', numeros: [5, 9] },
  { area: 'Gráficas (geral)', numeros: [1, 4, 7] },
  { area: 'Hotelaria', numeros: [5, 6] },
  { area: 'Idosos (trabalho com)', numeros: [6, 7] },
  { area: 'Indústrias mecânicas', numeros: [1, 4, 7] },
  { area: 'Indústrias metalúrgicas', numeros: [1, 4, 7] },
  { area: 'Indústrias químicas', numeros: [1, 4, 7] },
  { area: 'Informática (geral)', numeros: [7] },
  { area: 'Jardinagem', numeros: [6] },
  { area: 'Literatura', numeros: [3, 7] },
  { area: 'Marketing', numeros: [3, 5] },
  { area: 'Medicina (geral)', numeros: [6, 9] },
  { area: 'Medicina Alternativa (geral)', numeros: [6, 9, 11] },
  { area: 'Meio ambiente', numeros: [2, 6, 9] },
  { area: 'Mercado de capitais', numeros: [4, 8] },
  { area: 'Nutrição (geral)', numeros: [6] },
  { area: 'Odontologia (geral)', numeros: [4, 6, 9] },
  { area: 'Polícia (segurança)', numeros: [2, 4, 5, 9] },
  { area: 'Política', numeros: [1, 5, 7, 8, 11] },
  { area: 'Processamento de dados', numeros: [7] },
  { area: 'Shoppings e lojas', numeros: [2, 4, 8] },
  { area: 'Serviços domésticos', numeros: [2] },
  { area: 'Serviços sociais (todos)', numeros: [2, 7, 9] },
  { area: 'Telemarketing', numeros: [3, 5] },
  { area: 'Terapias alternativas (todas)', numeros: [2, 6, 9] },
  { area: 'Transporte', numeros: [4, 5, 7] },
  { area: 'Turismo', numeros: [2, 5] }
];

// Dados das profissões específicas
const profissoes = [
  { profissao: 'Administrador de empresas', numeros: [3, 9] },
  { profissao: 'Administrador hospitalar', numeros: [6, 22] },
  { profissao: 'Advogado', numeros: [7, 8, 9] },
  { profissao: 'Agente teatral', numeros: [8] },
  { profissao: 'Aeronauta', numeros: [22] },
  { profissao: 'Agente de viagens', numeros: [5] },
  { profissao: 'Agrimensor', numeros: [2, 6] },
  { profissao: 'Analista de sistemas', numeros: [7, 9] },
  { profissao: 'Arqueólogo', numeros: [2, 4] },
  { profissao: 'Arquiteto', numeros: [1, 4] },
  { profissao: 'Arquivista', numeros: [2, 4, 7, 9] },
  { profissao: 'Artista (pintor, cantor, ator)', numeros: [3, 5, 6] },
  { profissao: 'Assistente social', numeros: [9, 11, 22] },
  { profissao: 'Astrólogo', numeros: [4, 7] },
  { profissao: 'Autor teatral', numeros: [9] },
  { profissao: 'Aviador', numeros: [3, 5, 22] },
  { profissao: 'Bancário', numeros: [2, 4] },
  { profissao: 'Banqueiro', numeros: [8] },
  { profissao: 'Bibliotecário', numeros: [2, 6, 7, 9] },
  { profissao: 'Biólogo', numeros: [7] },
  { profissao: 'Bolsa de valores (operador)', numeros: [7, 8] },
  { profissao: 'Bombeiro', numeros: [4, 9] },
  { profissao: 'Cabeleireiro/a', numeros: [3] },
  { profissao: 'Caixa de banco', numeros: [2, 4] },
  { profissao: 'Camareiro', numeros: [6] },
  { profissao: 'Cientista', numeros: [7, 9, 22] },
  { profissao: 'Cineasta', numeros: [5, 7] },
  { profissao: 'Comerciante', numeros: [1, 8] },
  { profissao: 'Compositor', numeros: [3, 5, 6] },
  { profissao: 'Comprador', numeros: [2, 7, 8] },
  { profissao: 'Consultor', numeros: [1, 8, 11] },
  { profissao: 'Corretor de imóveis', numeros: [4, 6, 7, 8] },
  { profissao: 'Cozinheiro', numeros: [6] },
  { profissao: 'Crítico literário', numeros: [3] },
  { profissao: 'Diplomata', numeros: [1, 2, 11] },
  { profissao: 'Diretor (todos)', numeros: [1] },
  { profissao: 'Diretor social', numeros: [2, 7] },
  { profissao: 'Dentista', numeros: [4] },
  { profissao: 'Desenhista técnico', numeros: [5, 6] },
  { profissao: 'Designer', numeros: [1, 3, 11] },
  { profissao: 'Economista', numeros: [4, 8] },
  { profissao: 'Editor', numeros: [7, 9] },
  { profissao: 'Eletricidade', numeros: [4] },
  { profissao: 'Embaixador', numeros: [2, 11, 22] },
  { profissao: 'Empreiteiro', numeros: [1, 4] },
  { profissao: 'Engenheiro (todos)', numeros: [4, 11] },
  { profissao: 'Escritor', numeros: [1, 4, 5, 7, 11] },
  { profissao: 'Escultor', numeros: [3, 7, 9, 22] },
  { profissao: 'Esotérico', numeros: [2, 5, 6, 7, 9] },
  { profissao: 'Esportista (todos)', numeros: [1, 3] },
  { profissao: 'Estatístico', numeros: [2, 6] },
  { profissao: 'Estilista', numeros: [3] },
  { profissao: 'Executivo', numeros: [1, 8] },
  { profissao: 'Explorador', numeros: [1] },
  { profissao: 'Farmacêutico', numeros: [5, 7] },
  { profissao: 'Filantropo', numeros: [8, 9, 22] },
  { profissao: 'Filósofo', numeros: [7, 11, 22] },
  { profissao: 'Financista', numeros: [1, 4, 8] },
  { profissao: 'Físico', numeros: [7, 11] },
  { profissao: 'Floricultor', numeros: [6] },
  { profissao: 'Fonoaudiólogo', numeros: [2, 6, 11] },
  { profissao: 'Fotógrafo', numeros: [3, 6] },
  { profissao: 'Gerente de loja', numeros: [8] },
  { profissao: 'Gerente de restaurante', numeros: [1, 6] },
  { profissao: 'Gestão ambiental', numeros: [2, 6, 9] },
  { profissao: 'Historiador', numeros: [2, 4, 6, 7, 11] },
  { profissao: 'Inventor', numeros: [1, 11, 22] },
  { profissao: 'Investidor', numeros: [4, 8] },
  { profissao: 'Investigador', numeros: [2, 6, 7, 11] },
  { profissao: 'Jornalista', numeros: [3, 5] },
  { profissao: 'Jogador (xadrez, damas, videogames, sinuca, etc.)', numeros: [1, 3, 8] },
  { profissao: 'Juiz de direito', numeros: [7, 9, 11] },
  { profissao: 'Jurista', numeros: [3, 7, 9] },
  { profissao: 'Líder religioso', numeros: [7, 9, 22] },
  { profissao: 'Marinheiro', numeros: [5, 7, 9] },
  { profissao: 'Matemático', numeros: [4, 6, 7] },
  { profissao: 'Médico', numeros: [4, 6, 9, 11] },
  { profissao: 'Mecânico', numeros: [4, 9] },
  { profissao: 'Metalúrgico', numeros: [4, 9] },
  { profissao: 'Militar', numeros: [4, 9] },
  { profissao: 'Minerador', numeros: [2, 6, 8] },
  { profissao: 'Modelo', numeros: [3] },
  { profissao: 'Mordomo', numeros: [2, 6] },
  { profissao: 'Músico', numeros: [2, 3, 6, 9] },
  { profissao: 'Negociante de antiguidades', numeros: [4, 11, 22] },
  { profissao: 'Numerólogo', numeros: [4, 5, 7, 11, 22] },
  { profissao: 'Oceanógrafo', numeros: [7, 9] },
  { profissao: 'Operador de telemarketing', numeros: [3, 5] },
  { profissao: 'Operador da bolsa de valores', numeros: [4] },
  { profissao: 'Orador', numeros: [5] },
  { profissao: 'Padre', numeros: [9, 11] },
  { profissao: 'Pastor', numeros: [9, 11] },
  { profissao: 'Pecuarista', numeros: [6, 8] },
  { profissao: 'Pesquisador', numeros: [2, 7, 11] },
  { profissao: 'Presidência de empresa', numeros: [1, 8] },
  { profissao: 'Professor', numeros: [2, 6, 7, 9, 11] },
  { profissao: 'Projetista industrial', numeros: [4, 8] },
  { profissao: 'Psicanalista', numeros: [7, 9, 11] },
  { profissao: 'Psicólogo', numeros: [2, 6, 11] },
  { profissao: 'Publicitário', numeros: [1, 5] },
  { profissao: 'Químico', numeros: [4, 7] },
  { profissao: 'Radialista', numeros: [1, 3, 5, 7] },
  { profissao: 'Radiologista', numeros: [4, 6, 7] },
  { profissao: 'Redator', numeros: [1, 6] },
  { profissao: 'Relações públicas', numeros: [5] },
  { profissao: 'Repórter', numeros: [5, 11] },
  { profissao: 'Secretário/a', numeros: [2, 4, 7] },
  { profissao: 'Serralheiro', numeros: [5] },
  { profissao: 'Servidor público', numeros: [4, 5, 6] },
  { profissao: 'Técnico em comunicação', numeros: [4, 7, 9] },
  { profissao: 'Técnico em geral', numeros: [4] },
  { profissao: 'Terapeuta holístico', numeros: [2, 6, 7, 9] },
  { profissao: 'Topógrafo', numeros: [2, 6] },
  { profissao: 'Tradutor', numeros: [2, 6, 9] },
  { profissao: 'Vendedor', numeros: [1, 3, 5] },
  { profissao: 'Veterinário', numeros: [6, 7] }
];

export default function TabelaProfissoes() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = areasAtuacao.filter(item => 
    item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numeros.some(num => num.toString().includes(searchTerm))
  );

  const filteredProfissoes = profissoes.filter(item => 
    item.profissao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numeros.some(num => num.toString().includes(searchTerm))
  );

  const renderNumbers = (numeros: number[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {numeros.map((numero, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 text-base font-semibold min-w-[40px] justify-center"
          >
            {numero}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tabela de Profissões</h1>
          <p className="text-muted-foreground">
            Números numerológicos e suas áreas de atuação profissional
          </p>
        </div>
      </div>

      {/* Explicação */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Como Usar Esta Tabela
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Áreas de Atuação:</strong> Setores profissionais compatíveis com cada número</p>
            <p><strong>Profissões Específicas:</strong> Carreiras detalhadas e seus números correspondentes</p>
            <p><strong>Múltiplos Números:</strong> Profissões podem ter compatibilidade com vários números</p>
            <p className="mt-4 p-3 bg-muted/50 rounded-lg">
              <strong>Dica:</strong> Use sua data de nascimento ou nome para descobrir seus números numerológicos 
              e encontre as profissões mais alinhadas com seu perfil.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filtro de busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar área ou profissão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs para Áreas e Profissões */}
      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="areas" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Áreas de Atuação
          </TabsTrigger>
          <TabsTrigger value="profissoes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profissões Específicas
          </TabsTrigger>
        </TabsList>

        {/* Áreas de Atuação */}
        <TabsContent value="areas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Áreas de Atuação por Número
              </CardTitle>
              <CardDescription>
                Setores profissionais e suas compatibilidades numerológicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Versão Desktop */}
              <div className="hidden md:block space-y-4">
                {filteredAreas.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium text-base">{item.area}</div>
                    <div>{renderNumbers(item.numeros)}</div>
                  </div>
                ))}
              </div>

              {/* Versão Mobile */}
              <div className="md:hidden space-y-4">
                {filteredAreas.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-base">{item.area}</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {renderNumbers(item.numeros)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAreas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma área encontrada para "{searchTerm}"
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profissões Específicas */}
        <TabsContent value="profissoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profissões Específicas por Número
              </CardTitle>
              <CardDescription>
                Carreiras detalhadas e suas compatibilidades numerológicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Versão Desktop */}
              <div className="hidden md:block space-y-4">
                {filteredProfissoes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium text-base">{item.profissao}</div>
                    <div>{renderNumbers(item.numeros)}</div>
                  </div>
                ))}
              </div>

              {/* Versão Mobile */}
              <div className="md:hidden space-y-4">
                {filteredProfissoes.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-base">{item.profissao}</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {renderNumbers(item.numeros)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProfissoes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma profissão encontrada para "{searchTerm}"
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}