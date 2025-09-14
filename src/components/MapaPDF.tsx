import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Crown, Heart, Briefcase, Shield, Star, Eye, TrendingUp } from 'lucide-react';

interface MapaData {
  header: {
    titulo?: string;
    subtitulo?: string;
    nome?: string;
    name?: string;
    dataNascimento?: string;
    birth?: string;
    dataGeracao?: string;
    anoReferencia?: number;
    orientacao?: string;
  };
  numbers?: {
    motivation?: number;
    impression?: number;
    expression?: number;
    destiny?: number;
    mission?: number;
    psychic?: number;
    personalYear?: number;
    personalMonth?: number;
    personalDay?: number;
    birthDay?: number;
    ascensionDegree?: number;
    lifeCycles?: number[];
    challenges?: number[];
    decisiveMoments?: number[];
    karmicLessons?: number[];
    karmicDebts?: number[];
    hiddenTendencies?: number[];
    subconsciousResponse?: number;
  };
  // V3 format (Portuguese field names from edge function)
  numeros?: {
    motivacao?: number;
    impressao?: number;
    expressao?: number;
    destino?: number;
    missao?: number;
    psiquico?: number;
    anoPessoal?: number;
    mesPessoal?: number;
    diaPessoal?: number;
    diaNascimento?: number;
    grauAscensao?: number;
    anjoEspecial?: string;
    ciclosVida?: number[];
    desafios?: number[];
    momentos?: number[];
    licoesCarmicas?: number[];
    dividasCarmicas?: number[];
    tendenciasOcultas?: number[];
    respostaSubconsciente?: number;
  };
  // V3 format texts structure
  textos?: Record<string, {
    titulo?: string;
    numero?: number;
    explicacao?: string;
    conteudo?: string;
    cores?: string[];
    pedras?: string[];
    profissoes?: string[];
    [key: string]: any;
  }>;
  // Compatibilidade com formato antigo
  motivation?: number;
  impression?: number;
  expression?: number;
  destiny?: number;
  mission?: number;
  psychic?: number;
  personalYear?: number;
  personalMonth?: number;
  personalDay?: number;
  birthDay?: number;
  ascensionDegree?: number;
  lifeCycles?: number[];
  challenges?: number[];
  decisiveMoments?: number[];
  karmicLessons?: number[];
  karmicDebts?: number[];
  hiddenTendencies?: number[];
  subconsciousResponse?: number;
  
  texts?: Record<string, any>;
  cabalisticAngel?: {
    name?: string;
    category?: string;
    description?: string;
    invocationTime1?: string;
    invocationTime2?: string;
    psalm?: string;
    completeInvocation?: string;
  };
  complementary?: {
    colors?: any;
    stones?: any;
    professions?: any;
    health?: any;
  };
  metadata?: {
    version?: string;
    textosCarregados?: number;
    anjoEncontrado?: boolean;
    calculosCompletos?: boolean;
    totalTopicos?: number;
  };
}

interface MapaPDFProps {
  mapData: MapaData;
  texts?: Record<string, any>;
  onEditText?: (key: string, newContent: string) => void;
  editableTexts?: Record<string, string>;
}

const TopicCard = ({ 
  icon: Icon, 
  title, 
  number, 
  text, 
  onEdit, 
  editableContent 
}: { 
  icon: any, 
  title: string, 
  number?: number, 
  text?: any, 
  onEdit?: () => void,
  editableContent?: string 
}) => (
  <Card className="w-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center justify-between text-lg">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-600 dark:text-amber-400">
            {title} {number !== undefined && `${number}`}
          </span>
        </div>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {editableContent || text?.conteudo || text?.explicacao || text?.body || "Conteúdo em desenvolvimento."}
      </div>
    </CardContent>
  </Card>
);

const MapaPDF: React.FC<MapaPDFProps> = ({ 
  mapData, 
  texts = {}, 
  onEditText, 
  editableTexts = {} 
}) => {
  // Function to render all 31 topics in the correct order
  const renderTopicsByOrder = (mapData: MapaData, texts: Record<string, any>) => {
    const topics = [
      // 1. Motivação
      {
        icon: Crown,
        title: "Motivação",
        number: mapData.numbers?.motivation || mapData.numeros?.motivacao || mapData.motivation,
        section: "motivacao"
      },
      // 2. Ano Pessoal  
      {
        icon: TrendingUp,
        title: `Ano Pessoal ${mapData.numbers?.personalYear || mapData.numeros?.anoPessoal || mapData.personalYear} - ${mapData.header?.anoReferencia || new Date().getFullYear()}`,
        number: mapData.numbers?.personalYear || mapData.numeros?.anoPessoal || mapData.personalYear,
        section: "ano_pessoal"
      },
      // 3. Arcanos
      {
        icon: Star,
        title: "Arcanos",
        number: mapData.numbers?.expression || mapData.numeros?.expressao || mapData.expression,
        section: "arcanos"
      },
      // 4. Desafios
      {
        icon: Shield,
        title: "Desafios",
        number: null, // Multiple numbers
        section: "desafios",
        isMultiple: true
      },
      // 5. Destino
      {
        icon: TrendingUp,
        title: "Destino",
        number: mapData.numbers?.destiny || mapData.numeros?.destino || mapData.destiny,
        section: "destino"
      },
      // 6. Dia Pessoal
      {
        icon: Star,
        title: "Dia Pessoal",
        number: mapData.numbers?.personalDay || mapData.numeros?.diaPessoal || mapData.personalDay,
        section: "dia_pessoal"
      },
      // 7. Dívida Cármica
      {
        icon: Shield,
        title: "Dívida Cármica",
        number: null,
        section: "dividas_carmicas",
        isMultiple: true
      },
      // 8. Expressão
      {
        icon: Star,
        title: "Expressão",
        number: mapData.numbers?.expression || mapData.numeros?.expressao || mapData.expression,
        section: "expressao"
      },
      // 9. Harmonia Conjugal
      {
        icon: Heart,
        title: "Harmonia Conjugal",
        number: mapData.numbers?.motivation || mapData.numeros?.motivacao || mapData.motivation,
        section: "harmonia_conjugal"
      },
      // 10. Impressão
      {
        icon: Eye,
        title: "Impressão",
        number: mapData.numbers?.impression || mapData.numeros?.impressao || mapData.impression,
        section: "impressao"
      },
      // 11. Lições Cármicas
      {
        icon: Shield,
        title: "Lições Cármicas",
        number: null,
        section: "licoes_carmicas",
        isMultiple: true
      },
      // 12. Missão
      {
        icon: Shield,
        title: "Missão",
        number: mapData.numbers?.mission || mapData.numeros?.missao || mapData.mission,
        section: "missao"
      },
      // 13. Mês Pessoal
      {
        icon: Star,
        title: "Mês Pessoal",
        number: mapData.numbers?.personalMonth || mapData.numeros?.mesPessoal || mapData.personalMonth,
        section: "mes_pessoal"
      },
      // 14. Dia do Nascimento
      {
        icon: Star,
        title: "Dia do Nascimento",
        number: mapData.numbers?.birthDay || mapData.numeros?.diaNascimento || mapData.birthDay,
        section: "dia_nascimento"
      },
      // 15. Números Harmônicos
      {
        icon: Star,
        title: "Números Harmônicos",
        number: mapData.numbers?.expression || mapData.numeros?.expressao || mapData.expression,
        section: "numeros_harmonicos"
      },
      // 16. Número Psíquico
      {
        icon: Heart,
        title: "Número Psíquico",
        number: mapData.numbers?.psychic || mapData.numeros?.psiquico || mapData.psychic,
        section: "psiquico"
      },
      // 17. Potencialidade Profissional
      {
        icon: Briefcase,
        title: "Potencialidade Profissional",
        number: mapData.numbers?.destiny || mapData.numeros?.destino || mapData.destiny,
        section: "potencialidade_profissional"
      },
      // 18-20. Ciclos de Vida (Primeiro, Segundo, Terceiro)
      {
        icon: TrendingUp,
        title: "Ciclos de Vida",
        number: null,
        section: "ciclos_vida",
        isMultiple: true
      },
      // 19-22. Momentos Decisivos (Primeiro, Segundo, Terceiro, Quarto)
      {
        icon: Star,
        title: "Momentos Decisivos",
        number: null,
        section: "momentos_decisivos",
        isMultiple: true
      },
      // 21. Relações Inter valores
      {
        icon: Heart,
        title: "Relações Inter Valores",
        number: mapData.numbers?.expression || mapData.numeros?.expressao || mapData.expression,
        section: "relacoes_inter_valores"
      },
      // 22. Resposta Subconsciente
      {
        icon: Briefcase,
        title: "Resposta Subconsciente",
        number: mapData.numbers?.subconsciousResponse || mapData.numeros?.respostaSubconsciente || mapData.subconsciousResponse,
        section: "resposta_subconsciente"
      },
      // 25. Sequências Negativas
      {
        icon: Shield,
        title: "Sequências Negativas",
        number: mapData.numbers?.expression || mapData.numeros?.expressao || mapData.expression,
        section: "sequencias_negativas"
      },
      // 26. Tendências Ocultas
      {
        icon: Eye,
        title: "Tendências Ocultas",
        number: null,
        section: "tendencias_ocultas",
        isMultiple: true
      },
      // 29. Cores Favoráveis
      {
        icon: Star,
        title: "Cores Favoráveis",
        number: mapData.numbers?.psychic || mapData.numeros?.psiquico || mapData.psychic,
        section: "cores_favoraveis"
      },
      // 30. Grau de Ascensão
      {
        icon: TrendingUp,
        title: "Grau de Ascensão",
        number: mapData.numbers?.ascensionDegree || mapData.numeros?.grauAscensao || mapData.ascensionDegree,
        section: "grau_ascensao"
      },
      // 31. Dias do Mês Favoráveis
      {
        icon: Star,
        title: "Dias do Mês Favoráveis",
        number: mapData.numbers?.personalMonth || mapData.numeros?.mesPessoal || mapData.personalMonth,
        section: "dias_favoraveis"
      }
    ];

    return topics.map((topic, index) => {
      if (topic.isMultiple) {
        return renderMultipleSection(topic, mapData, texts, index);
      } else {
        const textKey = `${topic.section}-${topic.number}`;
        return (
          <TopicCard
            key={index}
            icon={topic.icon}
            title={topic.title}
            number={topic.number}
            text={texts?.[textKey] || mapData.textos?.[textKey]}
            onEdit={onEditText ? () => onEditText(textKey, texts?.[textKey]?.conteudo || '') : undefined}
            editableContent={editableTexts[textKey]}
          />
        );
      }
    });
  };

  // Function to render sections with multiple numbers (like challenges, life cycles, etc.)
  const renderMultipleSection = (topic: any, mapData: MapaData, texts: Record<string, any>, index: number) => {
    const getSectionData = () => {
      switch (topic.section) {
        case "desafios":
          return mapData.numbers?.challenges || mapData.numeros?.desafios || mapData.challenges || [];
        case "dividas_carmicas":
          return mapData.numbers?.karmicDebts || mapData.numeros?.dividasCarmicas || mapData.karmicDebts || [];
        case "licoes_carmicas":
          return mapData.numbers?.karmicLessons || mapData.numeros?.licoesCarmicas || mapData.karmicLessons || [];
        case "ciclos_vida":
          return mapData.numbers?.lifeCycles || mapData.numeros?.ciclosVida || mapData.lifeCycles || [];
        case "momentos_decisivos":
          return mapData.numbers?.decisiveMoments || mapData.numeros?.momentos || mapData.decisiveMoments || [];
        case "tendencias_ocultas":
          return mapData.numbers?.hiddenTendencies || mapData.numeros?.tendenciasOcultas || mapData.hiddenTendencies || [];
        default:
          return [];
      }
    };

    const data = getSectionData();
    
    if (data.length === 0) return null;

    return (
      <Card key={index} className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <topic.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-600 dark:text-amber-400">{topic.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((number: number, subIndex: number) => {
            const textKey = `${topic.section.replace('s_', '_').replace('s_', '-')}-${number}`;
            const altTextKey = `${topic.section.replace('_', '-')}-${number}`;
            const text = texts?.[textKey] || texts?.[altTextKey] || mapData.textos?.[textKey] || mapData.textos?.[altTextKey];
            
            return (
              <div key={subIndex} className="border-l-2 border-amber-200 dark:border-amber-800 pl-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {getSubTitle(topic.section, subIndex, number)}
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {editableTexts[textKey] || text?.conteudo || text?.explicacao || text?.body || `Análise estruturada baseada no número: ${number}`}
                </div>
                {onEditText && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => onEditText(textKey, text?.conteudo || '')}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  // Helper function to get subtitle for multiple sections
  const getSubTitle = (section: string, index: number, number: number) => {
    switch (section) {
      case "desafios":
        return `Desafio ${index + 1} (${number})`;
      case "dividas_carmicas":
        return `Dívida Cármica ${number}`;
      case "licoes_carmicas":
        return `Lição Cármica ${number}`;
      case "ciclos_vida":
        const cycleNames = ['Primeiro', 'Segundo', 'Terceiro'];
        return `${cycleNames[index]} Ciclo de Vida (${number})`;
      case "momentos_decisivos":
        const momentNames = ['Primeiro', 'Segundo', 'Terceiro', 'Quarto'];
        return `${momentNames[index]} Momento Decisivo (${number})`;
      case "tendencias_ocultas":
        return `Tendência Oculta ${number}`;
      default:
        return `${section} ${number}`;
    }
  };

  const renderComplementaryCorrespondences = (complementary: any) => {
    if (!complementary) return null;

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-amber-600 dark:text-amber-400">
            Correspondências Complementares
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {complementary.colors && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Cores Harmônicas</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {complementary.colors.descricao || "Cores que harmonizam com sua vibração pessoal"}
                {complementary.colors.cores && (
                  <div className="mt-2">
                    <strong>Cores:</strong> {Array.isArray(complementary.colors.cores) ? complementary.colors.cores.join(', ') : complementary.colors.cores}
                  </div>
                )}
              </div>
            </div>
          )}

          {complementary.stones && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Pedras e Cristais</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {complementary.stones.descricao || "Pedras que amplificam sua energia"}
                {complementary.stones.pedras && (
                  <div className="mt-2">
                    <strong>Pedras:</strong> {Array.isArray(complementary.stones.pedras) ? complementary.stones.pedras.join(', ') : complementary.stones.pedras}
                  </div>
                )}
              </div>
            </div>
          )}

          {complementary.professions && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Profissões Ideais</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {complementary.professions.descricao || "Áreas profissionais que combinam com seu perfil"}
                {complementary.professions.areas && (
                  <div className="mt-2">
                    <strong>Áreas:</strong> {Array.isArray(complementary.professions.areas) ? complementary.professions.areas.join(', ') : complementary.professions.areas}
                  </div>
                )}
              </div>
            </div>
          )}

          {complementary.health && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Orientações de Saúde</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {complementary.health.orientacoes || "Cuidados especiais para seu bem-estar"}
                {complementary.health.areas && (
                  <div className="mt-2">
                    <strong>Áreas de atenção:</strong> {Array.isArray(complementary.health.areas) ? complementary.health.areas.join(', ') : complementary.health.areas}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCabalisticAngel = (angel: any) => {
    if (!angel) return null;

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-amber-600 dark:text-amber-400">
            Anjo Cabalístico: {angel.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Categoria</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{angel.category}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Descrição</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{angel.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Horários de Invocação</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {angel.invocationTime1}<br/>
                {angel.invocationTime2}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Salmo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{angel.psalm}</p>
            </div>
          </div>

          {angel.completeInvocation && (
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Invocação Completa</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">{angel.completeInvocation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!mapData) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 dark:text-gray-400">Nenhum mapa foi gerado ainda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {mapData.header?.titulo || "Estudo Numerológico Pessoal"}
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400">
          {mapData.header?.subtitulo || "(Mapa Numerológico Cabalístico)"}
        </h2>
        <div className="text-lg font-medium text-amber-600 dark:text-amber-400">
          {mapData.header?.nome || mapData.header?.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Nascimento: {mapData.header?.dataNascimento || mapData.header?.birth} | 
          Gerado em: {mapData.header?.dataGeracao}
        </div>
        {mapData.header?.orientacao && (
          <div className="text-xs text-gray-400 dark:text-gray-500 italic max-w-3xl mx-auto mt-4">
            {mapData.header.orientacao}
          </div>
        )}
      </div>

      {/* All 31 Topics */}
      <div className="space-y-8">
        {renderTopicsByOrder(mapData, texts)}
      </div>

      {/* Correspondências Complementares */}
      {renderComplementaryCorrespondences(mapData.complementary)}

      {/* Anjo Cabalístico */}
      {renderCabalisticAngel(mapData.cabalisticAngel)}

      {/* Metadata Footer */}
      {mapData.metadata && (
        <Card className="w-full bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Estatísticas do Mapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <strong>Versão:</strong> {mapData.metadata.version || 'v3.0'}
              </div>
              <div>
                <strong>Textos carregados:</strong> {mapData.metadata.textosCarregados || 0}
              </div>
              <div>
                <strong>Anjo encontrado:</strong> {mapData.metadata.anjoEncontrado ? '✅' : '❌'}
              </div>
              <div>
                <strong>Cálculos:</strong> {mapData.metadata.calculosCompletos ? '✅ Completos' : '⚠️ Parciais'}
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
              Este mapa foi gerado pelo Sistema NumApp - Numerologia Profissional Completa
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapaPDF;