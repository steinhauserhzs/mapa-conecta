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
    totalTexts?: number;
    angelFound?: boolean;
    calculationsComplete?: boolean;
  };
}

interface MapaPDFProps {
  data: MapaData;
  isEditing?: boolean;
  editedTexts?: Record<string, any>;
  onEdit?: (section: string, field?: string) => void;
}

const MapaPDF: React.FC<MapaPDFProps> = ({ data, isEditing = false, editedTexts = {}, onEdit }) => {
  // Debug logging das propriedades essenciais
  console.log('🔍 MapaPDF Debug:', {
    hasHeader: !!data.header,
    hasNumeros: !!data.numeros,
    hasTextos: !!data.textos,
    hasTexts: !!data.texts,
    headerNome: data.header?.nome || data.header?.name,
    numerosKeys: data.numeros ? Object.keys(data.numeros) : [],
    textosKeys: data.textos ? Object.keys(data.textos) : [],
    textsKeys: data.texts ? Object.keys(data.texts) : []
  });

  const isV3Format = data.metadata?.version === 'v3.0' || data.textos?.motivacao;

  // Normalize texts from both v3 and v2 formats
  const normalizedTexts: Record<string, { title: string; body: string }> = {};
  
  // Process v3 format first (Portuguese)
  if (data.textos) {
    Object.entries(data.textos).forEach(([key, content]: [string, any]) => {
      normalizedTexts[key] = {
        title: content.titulo || content.title || key.replace(/[-_]/g, ' '),
        body: content.conteudo || content.body || content.text || 'Conteúdo em desenvolvimento'
      };
    });
  }
  
  // Process v2 format as fallback (English)
  if (data.texts) {
    Object.entries(data.texts).forEach(([key, content]: [string, any]) => {
      if (!normalizedTexts[key]) { // Don't overwrite v3 data
        normalizedTexts[key] = {
          title: content.title || key.replace(/[-_]/g, ' '),
          body: content.body || content.text || 'Conteúdo em desenvolvimento'
        };
      }
    });
  }

  console.log('📚 Textos normalizados:', Object.keys(normalizedTexts));
  
  // Helper functions
  const getNumber = (field: string): number => {
    // Map English field names to Portuguese (edge function format)
    const fieldMap: Record<string, string> = {
      'motivation': 'motivacao',
      'impression': 'impressao', 
      'expression': 'expressao',
      'destiny': 'destino',
      'mission': 'missao',
      'psychic': 'psiquico',
      'personalYear': 'anoPessoal',
      'personalMonth': 'mesPessoal',
      'personalDay': 'diaPessoal'
    };

    // Debug logging (conciso)
    const mappedField = fieldMap[field] || field;
    console.log('🔢 getNumber', { field, mappedField });

    // Try new format first (data.numeros.motivacao from edge function)
    if (data.numeros && typeof (data.numeros as any)[mappedField] === 'number') {
      return (data.numeros as any)[mappedField] as number;
    }

    // Try v2 format (data.numbers.motivation)
    const numberValue = data.numbers?.[field as keyof NonNullable<typeof data.numbers>] as number | undefined;
    if (typeof numberValue === 'number') {
      return numberValue;
    }
    
    // Try direct field access (legacy format)
    const directValue = data[field as keyof MapaData] as unknown;
    if (typeof directValue === 'number') {
      return directValue as number;
    }
    
    return 0;
  };

  const renderEditButton = (section: string) => {
    if (!isEditing || !onEdit) return null;
    return (
      <Button variant="ghost" size="sm" onClick={() => onEdit(section)} className="ml-2 h-6 w-6 p-0">
        <Edit2 className="h-3 w-3" />
      </Button>
    );
  };

  const getEditedText = (section: string, originalText: string) => {
    return editedTexts[section] || originalText;
  };

  // Helper para obter arrays de números (lições, tendências, etc.)
  const getNumberArray = (field: string): number[] => {
    // Try v3 format first (data.numeros.licoesCarmicas)
    const v3Value = data.numeros?.[field as keyof NonNullable<typeof data.numeros>];
    if (Array.isArray(v3Value)) return v3Value;
    
    // Try v2 format (data.karmicLessons)
    const v2Map: Record<string, string> = {
      'licoesCarmicas': 'karmicLessons',
      'dividasCarmicas': 'karmicDebts', 
      'tendenciasOcultas': 'hiddenTendencies',
      'ciclosVida': 'lifeCycles',
      'desafios': 'challenges',
      'momentos': 'decisiveMoments'
    };
    const v2Field = v2Map[field] || field;
    const v2Value = data.numbers?.[v2Field as keyof NonNullable<typeof data.numbers>] || data[v2Field as keyof MapaData];
    if (Array.isArray(v2Value)) return v2Value;
    
    return [];
  };

  // Helper para formatar lista de números
  const formatNumberList = (numbers: number[]): string => {
    if (numbers.length === 0) return 'Nenhum';
    if (numbers.length === 1) return numbers[0].toString();
    if (numbers.length === 2) return `${numbers[0]} e ${numbers[1]}`;
    return `${numbers.slice(0, -1).join(', ')} e ${numbers[numbers.length - 1]}`;
  };

  // Helper to get text content from v3/v2 formats de forma robusta
  const getTextContent = (section: string, defaultText: string = ''): string => {
    console.log('📖 getTextContent', { section, hasTextos: !!data.textos, hasTexts: !!data.texts });
    
    // Try v3 format first (data.textos.<section>.conteudo)
    const fromTextos = (data as any).textos?.[section];
    if (fromTextos) {
      const content = fromTextos.conteudo || fromTextos.body || fromTextos.text || fromTextos.content;
      if (typeof content === 'string' && content.trim() && content !== 'Conteúdo em desenvolvimento') {
        console.log('✅ Texto encontrado em textos:', section);
        return content;
      }
    }

    // Try v2 format (data.texts[section] pode ser string ou objeto)
    const fromTexts = (data as any).texts?.[section];
    if (fromTexts) {
      if (typeof fromTexts === 'string') {
        console.log('✅ Texto encontrado em texts (string):', section);
        return fromTexts;
      }
      const content = fromTexts.conteudo || fromTexts.body || fromTexts.text || fromTexts.content;
      if (typeof content === 'string' && content.trim()) {
        console.log('✅ Texto encontrado em texts (objeto):', section);
        return content;
      }
    }

    console.log('❌ Texto não encontrado para:', section);
    return defaultText || 'Análise numerológica para este aspecto está sendo processada.';
  };
  // Renderização do Índice
  const renderIndice = () => (
    <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="text-center text-primary flex items-center justify-center">
          <Crown className="w-5 h-5 mr-2" />
          ÍNDICE DO MAPA NUMEROLÓGICO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-primary mb-3">ANÁLISE PESSOAL</div>
            <div>• Sumário Executivo ............................ Pág. 2</div>
            <div>• Seus Números Básicos ........................ Pág. 3</div>
            <div>• Análise Psicológica Profunda ................. Pág. 4</div>
            <div>• Potenciais e Talentos ....................... Pág. 6</div>
            <div>• Desafios e Oportunidades .................... Pág. 7</div>
            <div>• Aspectos Cármicos ........................... Pág. 8</div>
            <div>• Anjo Cabalístico Pessoal .................... Pág. 10</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-primary mb-3">ORIENTAÇÕES PRÁTICAS</div>
            <div>• Carreira e Profissões Ideais ................ Pág. 12</div>
            <div>• Saúde e Bem-Estar .......................... Pág. 14</div>
            <div>• Relacionamentos e Amor ..................... Pág. 16</div>
            <div>• Períodos de Vida e Previsões ................ Pág. 18</div>
            <div>• Correspondências Numerológicas .............. Pág. 20</div>
            <div>• Orientações Espirituais .................... Pág. 22</div>
            <div>• Resumo e Conclusões ........................ Pág. 24</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Sumário Executivo Profissional
  const renderSumarioExecutivo = () => (
    <Card className="mb-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          {renderEditButton('sumario-executivo')}
          <Star className="w-6 h-6 mr-2" />
          SUMÁRIO EXECUTIVO NUMEROLÓGICO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                PERFIL DOMINANTE
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {getEditedText('sumario-perfil', 
                  getTextContent('expressao', `Com Expressão ${getNumber('expression')}, você possui um perfil ${
                    getNumber('expression') === 1 ? 'de liderança natural e pioneirismo' :
                    getNumber('expression') === 2 ? 'cooperativo, diplomático e harmonizador' :
                    getNumber('expression') === 3 ? 'criativo, comunicativo e inspirador' :
                    getNumber('expression') === 4 ? 'organizador, prático e estruturador' :
                    getNumber('expression') === 5 ? 'aventureiro, versátil e libertário' :
                    getNumber('expression') === 6 ? 'cuidador, responsável e familiar' :
                    getNumber('expression') === 7 ? 'analítico, introspectivo e espiritual' :
                    getNumber('expression') === 8 ? 'ambicioso, executivo e material' :
                    getNumber('expression') === 9 ? 'humanitário, generoso e universal' :
                    getNumber('expression') === 11 ? 'intuitivo, inspirador e visionário' :
                    getNumber('expression') === 22 ? 'construtor mestre e realizador' :
                    'único e especial'
                  }. Sua energia natural de Motivação ${getNumber('motivation')} ${
                    getNumber('motivation') === 1 ? 'busca independência e liderança' :
                    getNumber('motivation') === 2 ? 'valoriza harmonia e cooperação' :
                    getNumber('motivation') === 3 ? 'procura criatividade e expressão' :
                    getNumber('motivation') === 4 ? 'deseja estabilidade e organização' :
                    getNumber('motivation') === 5 ? 'anseia por liberdade e aventura' :
                    getNumber('motivation') === 6 ? 'prioriza família e responsabilidade' :
                    getNumber('motivation') === 7 ? 'busca conhecimento e espiritualidade' :
                    getNumber('motivation') === 8 ? 'almeja sucesso e reconhecimento' :
                    getNumber('motivation') === 9 ? 'serve à humanidade com amor' :
                    'possui motivações especiais'
                  }.`)
                )}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <h4 className="font-bold text-orange-700 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                PRINCIPAIS DESAFIOS
              </h4>
              <p className="text-orange-800 text-sm leading-relaxed">
                {getEditedText('sumario-desafios',
                  getTextContent('desafios', `Seu maior desafio pessoal é representado pelo número ${(data.numeros?.desafios?.[2] || data.challenges?.[2]) || 'a ser calculado'}, que ${
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 1 ? 'exige o desenvolvimento de liderança sem autoritarismo' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 2 ? 'requer equilibrar sensibilidade com assertividade' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 3 ? 'demanda focar criatividade sem dispersão' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 4 ? 'pede organização sem rigidez excessiva' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 5 ? 'necessita liberdade com responsabilidade' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 6 ? 'solicita cuidar sem controlar' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 7 ? 'busca conhecimento sem isolamento' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 8 ? 'almeja sucesso material com ética' :
                    ((data.numeros?.desafios?.[2] || data.challenges?.[2]) || 0) === 9 ? 'serve sem se sacrificar completamente' :
                    'apresenta lições especiais de crescimento'
                  }. Este será um tema recorrente que oferece grandes oportunidades de evolução.`)
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-700 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                POTENCIAL DE REALIZAÇÃO
              </h4>
              <p className="text-green-800 text-sm leading-relaxed">
                {getEditedText('sumario-potencial',
                  getTextContent('destino', `Com Destino ${getNumber('destiny')}, você está destinado a ${
                    getNumber('destiny') === 1 ? 'ser um pioneiro e abrir novos caminhos para outros' :
                    getNumber('destiny') === 2 ? 'ser um mediador e construtor de pontes entre pessoas' :
                    getNumber('destiny') === 3 ? 'ser um comunicador e inspirador através das artes' :
                    getNumber('destiny') === 4 ? 'ser um construtor sólido de sistemas duradouros' :
                    getNumber('destiny') === 5 ? 'ser um promotor de mudanças e liberdade' :
                    getNumber('destiny') === 6 ? 'ser um curador e protetor da família humana' :
                    getNumber('destiny') === 7 ? 'ser um sábio e guia espiritual' :
                    getNumber('destiny') === 8 ? 'ser um líder em negócios e organizações' :
                    getNumber('destiny') === 9 ? 'ser um servidor humanitário da coletividade' :
                    getNumber('destiny') === 11 ? 'ser um inspirador e iluminador de consciências' :
                    getNumber('destiny') === 22 ? 'ser um construtor mestre de projetos grandiosos' :
                    'cumprir uma missão especial e única'
                  }. Sua Missão ${getNumber('mission')} amplifica este potencial.`)
                )}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-700 mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                PERÍODO ATUAL
              </h4>
              <p className="text-purple-800 text-sm leading-relaxed">
                {getEditedText('sumario-periodo',
                  getTextContent('ano_pessoal', `Você está vivenciando o Ano Pessoal ${getNumber('personalYear') || 'a ser calculado'}, que representa ${
                    (getNumber('personalYear') || 1) === 1 ? 'um período de novos começos, iniciativas e plantio de sementes' :
                    (getNumber('personalYear') || 1) === 2 ? 'um tempo de cooperação, parcerias e desenvolvimento gradual' :
                    (getNumber('personalYear') || 1) === 3 ? 'uma fase de criatividade, comunicação e expressão pessoal' :
                    (getNumber('personalYear') || 1) === 4 ? 'um período de trabalho, organização e construção sólida' :
                    (getNumber('personalYear') || 1) === 5 ? 'um tempo de mudanças, liberdade e expansão' :
                    (getNumber('personalYear') || 1) === 6 ? 'uma fase de responsabilidades familiares e cuidado' :
                    (getNumber('personalYear') || 1) === 7 ? 'um período de introspecção, estudo e desenvolvimento espiritual' :
                    (getNumber('personalYear') || 1) === 8 ? 'um tempo de realização material e reconhecimento' :
                    (getNumber('personalYear') || 1) === 9 ? 'uma fase de conclusões, generosidade e preparação para novo ciclo' :
                    'um período de energia especial'
                  }. Este é o momento ideal para focar em ${
                    (getNumber('personalYear') || 1) <= 3 ? 'novos projetos e iniciativas criativas' :
                    (getNumber('personalYear') || 1) <= 6 ? 'consolidação e desenvolvimento de relacionamentos' :
                    'crescimento interior e preparação para próximos ciclos'
                  }.`)
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Seção "Os seus Números" - Lista completa como no modelo do usuário
  const renderSeusNumeros = () => (
    <Card className="mb-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <Crown className="w-6 h-6 mr-2" />
          OS SEUS NÚMEROS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="font-bold text-purple-700">Motivação: {getNumber('motivation')}</div>
              <div className="text-xs text-purple-600">O que te move interiormente</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="font-bold text-blue-700">Impressão: {getNumber('impression')}</div>
              <div className="text-xs text-blue-600">Como os outros te veem</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="font-bold text-green-700">Expressão: {getNumber('expression')}</div>
              <div className="text-xs text-green-600">Seus talentos naturais</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="font-bold text-orange-700">Destino: {getNumber('destiny')}</div>
              <div className="text-xs text-orange-600">Sua missão de vida</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
              <div className="font-bold text-red-700">Missão: {getNumber('mission')}</div>
              <div className="text-xs text-red-600">Sua vocação principal</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
              <div className="font-bold text-indigo-700">Psíquico: {getNumber('psychic')}</div>
              <div className="text-xs text-indigo-600">Essência da personalidade</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg border border-pink-200">
              <div className="font-bold text-pink-700">Ano Pessoal: {getNumber('personalYear')}</div>
              <div className="text-xs text-pink-600">Energia do período atual</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
              <div className="font-bold text-teal-700">Seu Anjo: {data.numeros?.anjoEspecial || data.cabalisticAngel?.name || 'A definir'}</div>
              <div className="text-xs text-teal-600">Protetor cabalístico</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
              <div className="font-bold text-amber-700">Lições Cármicas: {formatNumberList(getNumberArray('licoesCarmicas'))}</div>
              <div className="text-xs text-amber-600">Qualidades a desenvolver</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
              <div className="font-bold text-emerald-700">Tendências Ocultas: {formatNumberList(getNumberArray('tendenciasOcultas'))}</div>
              <div className="text-xs text-emerald-600">Características mais fortes</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-violet-50 to-violet-100 rounded-lg border border-violet-200">
              <div className="font-bold text-violet-700">Resposta Subconsciente: {getNumber('subconsciousResponse') || data.numeros?.respostaSubconsciente || 'A calcular'}</div>
              <div className="text-xs text-violet-600">Reação instintiva</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
              <div className="font-bold text-cyan-700">Dívidas Cármicas: {formatNumberList(getNumberArray('dividasCarmicas'))}</div>
              <div className="text-xs text-cyan-600">Desafios de vidas passadas</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-lime-50 to-lime-100 rounded-lg border border-lime-200">
              <div className="font-bold text-lime-700">Ciclos de Vida: {formatNumberList(getNumberArray('ciclosVida'))}</div>
              <div className="text-xs text-lime-600">Fases da jornada (juventude, maturidade, velhice)</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-rose-50 to-rose-100 rounded-lg border border-rose-200">
              <div className="font-bold text-rose-700">Desafios: {formatNumberList(getNumberArray('desafios'))}</div>
              <div className="text-xs text-rose-600">Obstáculos principais</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-700">Momentos Decisivos: {formatNumberList(getNumberArray('momentos'))}</div>
              <div className="text-xs text-slate-600">Períodos de mudança</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Números Básicos Melhorados (versão compacta para compatibilidade)
  const renderNumerosBasicos = () => {
    const numbers = [
      { 
        label: 'Motivação', 
        value: getNumber('motivation'),
        subtitle: 'O que te move interiormente',
        color: 'from-purple-500 to-purple-600',
        bg: 'from-purple-50 to-purple-100',
        icon: '💫'
      },
      { 
        label: 'Impressão', 
        value: getNumber('impression'),
        subtitle: 'Como os outros te veem',
        color: 'from-blue-500 to-blue-600',
        bg: 'from-blue-50 to-blue-100',
        icon: '👁️'
      },
      { 
        label: 'Expressão', 
        value: getNumber('expression'),
        subtitle: 'Seus talentos naturais',
        color: 'from-green-500 to-green-600',
        bg: 'from-green-50 to-green-100',
        icon: '🎯'
      },
      { 
        label: 'Destino', 
        value: getNumber('destiny'),
        subtitle: 'Sua missão de vida',
        color: 'from-orange-500 to-orange-600',
        bg: 'from-orange-50 to-orange-100',
        icon: '🌟'
      },
      { 
        label: 'Missão', 
        value: getNumber('mission'),
        subtitle: 'Seu propósito maior',
        color: 'from-red-500 to-red-600',
        bg: 'from-red-50 to-red-100',
        icon: '🎭'
      },
      { 
        label: 'Psíquico', 
        value: getNumber('psychic'),
        subtitle: 'Sua intuição natural',
        color: 'from-indigo-500 to-indigo-600',
        bg: 'from-indigo-50 to-indigo-100',
        icon: '🔮'
      },
    ];

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center text-primary text-xl">
            OS SEUS NÚMEROS FUNDAMENTAIS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {numbers.map((num, index) => (
              <div key={index} className={`relative text-center p-6 rounded-xl bg-gradient-to-br ${num.bg} border-2 border-transparent hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md`}>
                <div className="text-2xl mb-2">{num.icon}</div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${num.color} bg-clip-text text-transparent`}>
                  {num.value || '0'}
                </div>
                <div className="font-semibold text-gray-800 mb-1">{num.label}</div>
                <div className="text-xs text-gray-600 leading-tight">{num.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Ano Pessoal em destaque */}
          {getNumber('personalYear') > 0 && (
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl border-2 border-amber-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-4xl font-bold text-amber-600 mb-2">{getNumber('personalYear')}</div>
                <div className="font-semibold text-amber-700">ANO PESSOAL ATUAL</div>
                <div className="text-sm text-amber-600 mt-1">
                  Energia dominante deste ciclo de vida
                </div>
              </div>
            </div>
          )}

          {/* Anjo Cabalístico em destaque */}
          {data.cabalisticAngel?.name && (
            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 rounded-xl border-2 border-yellow-300">
              <div className="text-center">
                <div className="text-2xl mb-2">👼</div>
                <div className="text-xl font-bold text-yellow-700 mb-1">{data.cabalisticAngel.name}</div>
                <div className="font-semibold text-yellow-600 mb-2">SEU ANJO CABALÍSTICO</div>
                <div className="text-sm text-yellow-600">{data.cabalisticAngel.category}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Análise Psicológica Profunda
  const renderAnalisisPsicologica = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-primary flex items-center">
          {renderEditButton('analise-psicologica')}
          <Briefcase className="w-5 h-5 mr-2" />
          ANÁLISE PSICOLÓGICA PROFUNDA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <h4 className="font-bold text-blue-700 mb-3">🧠 PADRÕES MENTAIS</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {getEditedText('psico-mental', 
                  `Seu número de Expressão ${getNumber('expression')} revela uma mente que ${
                    getNumber('expression') === 1 ? 'processa informações de forma direta e objetiva, preferindo tomar decisões rápidas e liderar processos de pensamento. Possui facilidade para ver o panorama geral e identificar oportunidades únicas.' :
                    getNumber('expression') === 2 ? 'funciona de forma colaborativa e intuitiva, processando múltiplas perspectivas antes de chegar a conclusões. Excelente para mediação e síntese de ideias complexas.' :
                    getNumber('expression') === 3 ? 'opera de forma criativa e associativa, conectando conceitos aparentemente desconectados. Pensa em imagens, metáforas e possui facilidade para comunicar ideias complexas.' :
                    getNumber('expression') === 7 ? 'funciona de forma analítica e profunda, questionando constantemente e buscando verdades ocultas. Prefere qualidade à quantidade nas informações.' :
                    'possui padrões únicos de processamento mental que facilitam a inovação e descobertas.'
                  } Sua capacidade de concentração e foco está alinhada com a energia do número ${getNumber('psychic')}.`
                )}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
              <h4 className="font-bold text-rose-700 mb-3">💖 PADRÕES EMOCIONAIS</h4>
              <p className="text-sm text-rose-800 leading-relaxed">
                {getEditedText('psico-emocional',
                  `Emocionalmente, você é governado pela energia de Motivação ${getNumber('motivation')}, que ${
                    getNumber('motivation') === 1 ? 'gera um padrão emocional de independência e autoconfiança. Você se sente energizado quando pode tomar suas próprias decisões e pode se frustrar com microgerenciamento ou dependência excessiva.' :
                    getNumber('motivation') === 2 ? 'cria uma natureza emocional sensível e empática. Você absorve facilmente as emoções do ambiente e se nutre de harmonia, podendo se desequilibrar em conflitos prolongados.' :
                    getNumber('motivation') === 6 ? 'desenvolve uma natureza emocional protetora e cuidadora. Você se realiza cuidando dos outros, mas deve aprender a não se sacrificar completamente por amor.' :
                    'manifesta padrões emocionais únicos que influenciam profundamente suas reações e relacionamentos.'
                  } Seu número Psíquico ${getNumber('psychic')} amplifica essas características emocionais naturais.`
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h4 className="font-bold text-green-700 mb-3">🤝 PADRÕES RELACIONAIS</h4>
              <p className="text-sm text-green-800 leading-relaxed">
                {getEditedText('psico-relacional',
                  `Nos relacionamentos, sua Impressão ${getNumber('impression')} faz com que as pessoas ${
                    getNumber('impression') === 1 ? 'te vejam como alguém forte, independente e capaz de liderar. Você atrai pessoas que buscam direção e pode intimidar personalidades mais tímidas.' :
                    getNumber('impression') === 2 ? 'te percebam como alguém gentil, compreensivo e confiável. Você atrai pessoas que buscam paz e harmonia, sendo frequentemente procurado para conselhos.' :
                    getNumber('impression') === 3 ? 'te enxerguem como alguém criativo, alegre e inspirador. Você ilumina ambientes e atrai pessoas que buscam diversão e inspiração.' :
                    'tenham uma percepção especial de sua energia, o que influencia o tipo de relacionamentos que você atrai.'
                  } Isso cria dinâmicas específicas em suas interações pessoais e profissionais.`
                )}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
              <h4 className="font-bold text-purple-700 mb-3">🌟 PADRÕES DE CRESCIMENTO</h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                {getEditedText('psico-crescimento',
                  `Seu desenvolvimento pessoal está direcionado pelo Destino ${getNumber('destiny')}, que ${
                    getNumber('destiny') === 1 ? 'indica um crescimento através do desenvolvimento de liderança e pioneirismo. Você evolui assumindo responsabilidades e criando novos caminhos.' :
                    getNumber('destiny') === 7 ? 'aponta para crescimento através de estudos, introspecção e desenvolvimento espiritual. Você evolui questionando, pesquisando e buscando sabedoria.' :
                    getNumber('destiny') === 9 ? 'direciona seu crescimento para o serviço humanitário e amor universal. Você evolui ajudando outros e expandindo sua compaixão.' :
                    'oferece um caminho único de evolução pessoal baseado em lições específicas.'
                  } Os desafios representados pelo número ${(data.numeros?.desafios?.[2] || data.challenges?.[2]) || 'principal'} são oportunidades de fortalecer exatamente essas áreas de crescimento.`
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Continue with more sections...
  // Vou renderizar o restante das seções principais

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-gray-900 print:text-black" id="mapa-pdf">
      {/* CAPA PROFISSIONAL */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center mb-16 p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b-4 border-primary/20">
        <div className="space-y-6 max-w-2xl">
          <div className="text-6xl mb-6">🔮</div>
          <h1 className="text-4xl font-bold mb-4 text-primary leading-tight">
            {data.header.titulo || "MAPA NUMEROLÓGICO COMPLETO"}
          </h1>
          <h2 className="text-xl text-muted-foreground mb-8 italic">
            {data.header.subtitulo || "Análise Cabalística Pitagórica Profissional"}
          </h2>
          
          <div className="space-y-4 p-6 bg-white/80 rounded-lg shadow-sm border border-primary/20">
            <div className="text-2xl font-semibold text-primary">
              {data.header.nome || data.header.name}
            </div>
            <div className="text-lg text-muted-foreground">
              <strong>Data de Nascimento:</strong> {data.header.dataNascimento || data.header.birth}
            </div>
            {data.header.anoReferencia && (
              <div className="text-sm text-muted-foreground">
                Ano de Referência: {data.header.anoReferencia}
              </div>
            )}
          </div>

          {data.header.orientacao && (
            <div className="mt-8 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
              <p className="text-amber-800 italic leading-relaxed">
                "{data.header.orientacao}"
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-8">
            Gerado em: {data.header.dataGeracao ? 
              new Date(data.header.dataGeracao).toLocaleDateString('pt-BR') : 
              new Date().toLocaleDateString('pt-BR')
            }
          </div>
        </div>
      </div>

      {/* CONTEÚDO DO MAPA */}
      <div className="space-y-8 p-6">
        {renderIndice()}
        {renderSumarioExecutivo()}
        {renderSeusNumeros()}
        {renderNumerosBasicos()}
        {renderAnalisisPsicologica()}

        {/* PLACEHOLDER PARA OUTRAS SEÇÕES */}
        <Card className="mb-8 border-2 border-dashed border-primary/30">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-primary mb-2">Seções Adicionais em Desenvolvimento</h3>
            <p className="text-muted-foreground mb-4">
              Este mapa incluirá mais de 20 páginas de conteúdo profissional:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-left">
              <ul className="space-y-1">
                <li>• Orientações de Carreira Detalhadas</li>
                <li>• Análise de Saúde e Bem-Estar</li>
                <li>• Compatibilidade Amorosa Completa</li>
                <li>• Períodos Planetários e Previsões</li>
              </ul>
              <ul className="space-y-1">
                <li>• Correspondências (Cores, Pedras, Metais)</li>
                <li>• Aspectos Cármicos Detalhados</li>
                <li>• Orientações Espirituais Práticas</li>
                <li>• Ciclos de Vida Completos</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* RENDERIZAÇÃO DE TEXTOS EXISTENTES (Compatibilidade) */}
        {((data.textos && Object.keys(data.textos).length > 0) || (data.texts && Object.keys(data.texts).length > 0)) && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">
              ANÁLISES NUMEROLÓGICAS DETALHADAS
            </h2>
            
            {/* Renderizar textos do formato v3 (data.textos) */}
            {data.textos && Object.entries(data.textos).map(([section, content]: [string, any]) => (
              <Card key={`v3-${section}`} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary capitalize">
                    {content.titulo || content.title || section.replace(/[-_]/g, ' ')}
                    {renderEditButton(section)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {getEditedText(section, content.conteudo || content.body || 'Conteúdo em desenvolvimento.')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Renderizar textos do formato v2 (data.texts) - fallback */}
            {data.texts && Object.entries(data.texts).map(([section, content]: [string, any]) => (
              <Card key={`v2-${section}`} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary capitalize">
                    {content.title || section.replace(/[-_]/g, ' ')}
                    {renderEditButton(section)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {getEditedText(section, content.body || 'Conteúdo em desenvolvimento.')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FOOTER PROFISSIONAL */}
        <div className="mt-16 pt-8 border-t-2 border-primary/20 text-center text-sm text-muted-foreground">
          <div className="space-y-2">
            <div className="font-semibold">📊 ESTATÍSTICAS DO MAPA</div>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>Textos Carregados: {data.metadata?.totalTexts || 0}</div>
              <div>Versão: {data.metadata?.version || 'v3.0'}</div>
              <div>Cálculos: {data.metadata?.calculationsComplete ? '✅ Completos' : '⏳ Em processamento'}</div>
            </div>
            <div className="mt-4 text-xs">
              Este mapa foi gerado pelo Sistema NumApp - Numerologia Profissional Completa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPDF;