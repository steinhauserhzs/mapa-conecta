import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CANVA_CONTENT = `[CONTEÚDO NUMEROLÓGICO COMPLETO - Version 2.0]

# NUMEROLOGIA APLICADA - GUIA COMPLETO

## ASPECTOS BÁSICOS DA NUMEROLOGIA

### NÚMEROS DE 1 A 9 - EXPRESSÃO/PERSONALIDADE

**Número 1 - O PIONEIRO**
Características: Liderança, iniciativa, independência, originalidade, determinação
Personalidade: Pessoas nascidas para liderar, com forte senso de individualidade
Profissões: Empresários, executivos, inventores, líderes políticos
Desafios: Arrogância, impaciência, autoritarismo
Relacionamentos: Precisa de parceiros que respeitem sua independência

**Número 2 - O COOPERADOR**
Características: Diplomacia, sensibilidade, cooperação, parceria, intuição
Personalidade: Pessoas que buscam harmonia e trabalham melhor em equipe
Profissões: Diplomatas, conselheiros, mediadores, artistas
Desafios: Indecisão, dependência emocional, timidez
Relacionamentos: Valoriza união e busca parceiro para toda vida

**Número 3 - O COMUNICADOR**
Características: Criatividade, comunicação, otimismo, expressão artística
Personalidade: Pessoas alegres, criativas e comunicativas
Profissões: Artistas, escritores, palestrantes, professores
Desafios: Dispersão, superficialidade, falta de foco
Relacionamentos: Busca parceiros que apreciem sua criatividade

**Número 4 - O CONSTRUTOR**
Características: Praticidade, organização, disciplina, trabalho duro, estabilidade
Personalidade: Pessoas confiáveis, metódicas e trabalhadoras
Profissões: Engenheiros, contadores, administradores, técnicos
Desafios: Rigidez, teimosia, falta de flexibilidade
Relacionamentos: Busca estabilidade e compromisso sério

**Número 5 - O AVENTUREIRO**
Características: Liberdade, versatilidade, curiosidade, mudança, aventura
Personalidade: Pessoas que amam liberdade e novas experiências
Profissões: Viajantes, jornalistas, vendedores, guias turísticos
Desafios: Instabilidade, impulsividade, falta de compromisso
Relacionamentos: Precisa de liberdade dentro do relacionamento

**Número 6 - O CUIDADOR**
Características: Responsabilidade, cuidado, família, serviço, compaixão
Personalidade: Pessoas carinhosas que gostam de cuidar dos outros
Profissões: Médicos, enfermeiros, professores, terapeutas
Desafios: Excesso de proteção, sacrifício excessivo, controle
Relacionamentos: Família é prioridade, parceiro dedicado

**Número 7 - O BUSCADOR**
Características: Espiritualidade, análise, introspecção, mistério, sabedoria
Personalidade: Pessoas introspectivas que buscam conhecimento profundo
Profissões: Pesquisadores, filósofos, psicólogos, místicos
Desafios: Isolamento, pessimismo, falta de praticidade
Relacionamentos: Precisa de parceiro que respeite sua necessidade de solidão

**Número 8 - O EXECUTIVO**
Características: Ambição, poder material, organização, justiça, autoridade
Personalidade: Pessoas focadas no sucesso material e reconhecimento
Profissões: Executivos, banqueiros, políticos, juízes
Desafios: Materialismo, workaholismo, falta de flexibilidade
Relacionamentos: Busca parceiro bem-sucedido e ambicioso

**Número 9 - O HUMANITÁRIO**
Características: Humanitarismo, compaixão, universalidade, sabedoria, generosidade
Personalidade: Pessoas que se preocupam com o bem-estar da humanidade
Profissões: Assistentes sociais, médicos, professores, filantropistas
Desafios: Idealismo excessivo, mártir, dispersão emocional
Relacionamentos: Busca parceiro que compartilhe ideais humanitários

### NÚMEROS MESTRES

**Número 11 - O ILUMINADO**
Características: Intuição elevada, inspiração, liderança espiritual, sensibilidade
Personalidade: Pessoas com grande intuição e capacidade de inspirar outros
Missão: Trazer luz e inspiração ao mundo
Desafios: Nervosismo, instabilidade emocional, pressão interna

**Número 22 - O MESTRE CONSTRUTOR**
Características: Visão grandiosa, capacidade de materializar sonhos, liderança
Personalidade: Pessoas capazes de transformar visões em realidade
Missão: Construir algo duradouro para a humanidade
Desafios: Pressão interna, perfeccionismo, tendência ao esgotamento

**Número 33 - O MESTRE PROFESSOR**
Características: Amor incondicional, cura, ensino espiritual, compaixão
Personalidade: Pessoas com grande capacidade de cura e ensino
Missão: Ensinar através do exemplo e do amor incondicional
Desafios: Sacrifício excessivo, tendência ao martírio

### MOTIVAÇÃO (VOGAIS) - O QUE TE MOVE

**Motivação 1**: Busca liderança, independência e reconhecimento
**Motivação 2**: Busca harmonia, cooperação e relacionamentos
**Motivação 3**: Busca expressão criativa e comunicação
**Motivação 4**: Busca estabilidade, segurança e organização
**Motivação 5**: Busca liberdade, aventura e variedade
**Motivação 6**: Busca servir, cuidar e responsabilidade familiar
**Motivação 7**: Busca conhecimento, espiritualidade e introspecção
**Motivação 8**: Busca poder, sucesso material e reconhecimento
**Motivação 9**: Busca servir a humanidade e fazer a diferença

### IMPRESSÃO (CONSOANTES) - COMO OS OUTROS TE VEEM

**Impressão 1**: Visto como líder natural, confiante e independente
**Impressão 2**: Visto como diplomático, sensível e cooperativo
**Impressão 3**: Visto como criativo, comunicativo e alegre
**Impressão 4**: Visto como confiável, prático e organizado
**Impressão 5**: Visto como aventureiro, versátil e livre
**Impressão 6**: Visto como responsável, cuidadoso e familiar
**Impressão 7**: Visto como misterioso, sábio e introspectivo
**Impressão 8**: Visto como poderoso, ambicioso e bem-sucedido
**Impressão 9**: Visto como humanitário, generoso e sábio

### DESTINO (DATA DE NASCIMENTO) - SUA MISSÃO DE VIDA

**Destino 1**: Missão de liderar, inovar e abrir caminhos
**Destino 2**: Missão de cooperar, mediar e criar harmonia
**Destino 3**: Missão de inspirar, criar e comunicar alegria
**Destino 4**: Missão de construir, organizar e criar estabilidade
**Destino 5**: Missão de explorar, ensinar e promover mudanças
**Destino 6**: Missão de cuidar, servir e responsabilidade social
**Destino 7**: Missão de pesquisar, ensinar e elevar consciência
**Destino 8**: Missão de organizar, liderar e criar prosperidade
**Destino 9**: Missão de servir humanidade e elevar consciência global

### MISSÃO (EXPRESSÃO + DESTINO)

A missão combina sua personalidade (Expressão) com sua missão de vida (Destino).

**Cálculos de Missão:**
- Soma-se o número da Expressão com o número do Destino
- Reduz-se o resultado conforme regras numerológicas
- O resultado indica como realizar sua missão de vida

### PSÍQUICO (DIA DE NASCIMENTO) - SUA ESSÊNCIA

**Psíquico 1**: Essência de liderança e pioneirismo
**Psíquico 2**: Essência de cooperação e diplomacia
**Psíquico 3**: Essência de criatividade e comunicação
**Psíquico 4**: Essência de praticidade e organização
**Psíquico 5**: Essência de liberdade e aventura
**Psíquico 6**: Essência de cuidado e responsabilidade
**Psíquico 7**: Essência de busca espiritual e conhecimento
**Psíquico 8**: Essência de ambição e materialização
**Psíquico 9**: Essência de humanitarismo e sabedoria

### LIÇÕES CÁRMICAS - O QUE PRECISA APRENDER

As lições cármicas são números ausentes no nome completo:

**Lição 1**: Aprender liderança e independência
**Lição 2**: Aprender cooperação e diplomacia
**Lição 3**: Aprender expressão criativa e comunicação
**Lição 4**: Aprender disciplina e organização
**Lição 5**: Aprender liberdade construtiva e adaptabilidade
**Lição 6**: Aprender responsabilidade e cuidado
**Lição 7**: Aprender busca interior e espiritualidade
**Lição 8**: Aprender autoridade e materialização ética
**Lição 9**: Aprender compaixão e serviço universal

### DÍVIDAS CÁRMICAS - DESAFIOS A SUPERAR

**Dívida 13/4**: Relacionada à preguiça e irresponsabilidade em vidas passadas
- Superação: Disciplina, trabalho duro e organização
- Manifestação: Tendência à preguiça, dificuldade com disciplina

**Dívida 14/5**: Relacionada ao abuso da liberdade em vidas passadas
- Superação: Uso construtivo da liberdade, moderação
- Manifestação: Vícios, excessos, irresponsabilidade

**Dívida 16/7**: Relacionada ao ego e orgulho espiritual em vidas passadas
- Superação: Humildade, busca genuína da espiritualidade
- Manifestação: Quedas súbitas, lições humilhantes

**Dívida 19/1**: Relacionada ao abuso de poder em vidas passadas
- Superação: Liderança servil, uso correto do poder
- Manifestação: Dificuldade com autoridade, obstáculos na liderança

### TENDÊNCIAS OCULTAS - TALENTOS NATURAIS

São números que aparecem mais vezes no nome completo:

**Tendência 1**: Talento natural para liderança
**Tendência 2**: Talento natural para mediação
**Tendência 3**: Talento natural para comunicação
**Tendência 4**: Talento natural para organização
**Tendência 5**: Talento natural para adaptação
**Tendência 6**: Talento natural para cuidado
**Tendência 7**: Talento natural para análise
**Tendência 8**: Talento natural para administração
**Tendência 9**: Talento natural para compreensão

### RESPOSTA SUBCONSCIENTE - REAÇÕES INSTINTIVAS

**Resposta 1**: Reage com liderança e iniciativa
**Resposta 2**: Reage buscando cooperação e harmonia
**Resposta 3**: Reage com otimismo e criatividade
**Resposta 4**: Reage com praticidade e organização
**Resposta 5**: Reage buscando liberdade e mudança
**Resposta 6**: Reage assumindo responsabilidades
**Resposta 7**: Reage com análise e introspecção
**Resposta 8**: Reage com autoridade e determinação
**Resposta 9**: Reage com compreensão e compaixão

### CICLOS DE VIDA - FASES DA EXISTÊNCIA

**PRIMEIRO CICLO (0 aos 28-35 anos)**
- Baseado no mês de nascimento
- Fase de formação e desenvolvimento inicial
- Influencia juventude e início da vida adulta

**SEGUNDO CICLO (28-35 aos 52-60 anos)**
- Baseado no dia de nascimento
- Fase de produtividade e realização
- Período de maior atividade profissional

**TERCEIRO CICLO (52-60 anos em diante)**
- Baseado no ano de nascimento
- Fase de colheita e sabedoria
- Período de maturidade e transmissão de conhecimento

### DESAFIOS - OBSTÁCULOS A SUPERAR

**PRIMEIRO DESAFIO (0 aos 28-35 anos)**
**SEGUNDO DESAFIO (28-35 aos 52-60 anos)**  
**TERCEIRO DESAFIO (52-60 anos em diante)**
**DESAFIO PRINCIPAL (vida toda)**

**Desafio 0**: Ausência de desafios - escolha livre
**Desafio 1**: Superar dependência, desenvolver liderança
**Desafio 2**: Superar timidez, desenvolver cooperação
**Desafio 3**: Superar dispersão, focar criatividade
**Desafio 4**: Superar rigidez, desenvolver flexibilidade
**Desafio 5**: Superar instabilidade, encontrar foco
**Desafio 6**: Superar excesso de proteção, equilibrar cuidado
**Desafio 7**: Superar isolamento, compartilhar conhecimento
**Desafio 8**: Superar materialismo, desenvolver compaixão

### MOMENTOS DECISIVOS - PERÍODOS DE MUDANÇA

**PRIMEIRO MOMENTO (nascimento aos 28-35 anos)**
**SEGUNDO MOMENTO (28-35 aos 52-60 anos)**
**TERCEIRO MOMENTO (52-60 aos 76-84 anos)**
**QUARTO MOMENTO (76-84 anos em diante)**

Cada momento indica as oportunidades e temas principais de cada fase da vida.

### ANO PESSOAL - CICLO ANUAL DE 9 ANOS

**Ano 1**: Novos começos, iniciativas, plantio de sementes
**Ano 2**: Cooperação, parcerias, desenvolvimento lento
**Ano 3**: Criatividade, comunicação, expressão pessoal
**Ano 4**: Trabalho duro, construção de bases, organização
**Ano 5**: Mudanças, liberdade, novas oportunidades
**Ano 6**: Responsabilidades familiares, cuidado, serviço
**Ano 7**: Introspecção, estudo, desenvolvimento espiritual
**Ano 8**: Realização material, reconhecimento, colheita
**Ano 9**: Conclusões, finalizações, preparação para novo ciclo

### MÊS E DIA PESSOAL

**Mês Pessoal**: Influência mensal dentro do ano pessoal
**Dia Pessoal**: Influência diária dentro do mês pessoal

### ANJO ESPECIAL - PROTEÇÃO ESPIRITUAL

Cada pessoa tem um anjo especial baseado em cálculos específicos do nome e data de nascimento.

### COMPATIBILIDADE AMOROSA

**Números Compatíveis:**
- 1 com 5, 7, 9
- 2 com 4, 6, 8
- 3 com 1, 5, 9
- 4 com 2, 6, 8
- 5 com 1, 3, 7, 9
- 6 com 2, 4, 8
- 7 com 1, 5, 9
- 8 com 2, 4, 6
- 9 com 1, 3, 5, 7

### PROFISSÕES IDEAIS POR NÚMERO

**Número 1**: Líder empresarial, CEO, político, inventor, pioneiro
**Número 2**: Diplomata, mediador, conselheiro, assistente, cooperativo
**Número 3**: Artista, escritor, ator, palestrante, professor criativo
**Número 4**: Engenheiro, contador, administrador, técnico, construtor
**Número 5**: Vendedor, jornalista, guia turístico, piloto, aventureiro
**Número 6**: Médico, enfermeiro, professor, terapeuta, cuidador
**Número 7**: Pesquisador, analista, filósofo, psicólogo, místico
**Número 8**: Executivo, banqueiro, advogado, juiz, empreendedor
**Número 9**: Assistente social, médico humanitário, professor, filantropo

### SAÚDE E NÚMEROS

**Número 1**: Tendência a problemas cardíacos, pressão alta
**Número 2**: Sensibilidade digestiva, problemas emocionais
**Número 3**: Problemas de garganta, tensão nervosa
**Número 4**: Problemas ósseos, rigidez corporal
**Número 5**: Problemas nervosos, acidentes
**Número 6**: Problemas familiares afetam saúde
**Número 7**: Problemas psicossomáticos, melancolia
**Número 8**: Problemas de estresse, workaholic
**Número 9**: Problemas de dispersão energética

### CORES E NÚMEROS

**Número 1**: Vermelho, laranja (cores de liderança)
**Número 2**: Azul claro, prata (cores de harmonia)
**Número 3**: Amarelo, dourado (cores de alegria)
**Número 4**: Verde, marrom (cores de estabilidade)
**Número 5**: Cores variadas, multicolorido (versatilidade)
**Número 6**: Rosa, verde claro (cores de amor)
**Número 7**: Roxo, violeta (cores místicas)
**Número 8**: Preto, cinza (cores de poder)
**Número 9**: Branco, todas as cores (universalidade)

### PEDRAS E NÚMEROS

**Número 1**: Rubi, granada (pedras de liderança)
**Número 2**: Pérola, moonstone (pedras de intuição)
**Número 3**: Topázio, âmbar (pedras de criatividade)
**Número 4**: Esmeralda, jade (pedras de estabilidade)
**Número 5**: Turquesa, aventurina (pedras de liberdade)
**Número 6**: Rosa quartzo, jade rosa (pedras de amor)
**Número 7**: Ametista, lápis lazúli (pedras místicas)
**Número 8**: Diamante, hematita (pedras de poder)
**Número 9**: Cristal transparente, opala (pedras universais)

### DIAS DA SEMANA E NÚMEROS

**Domingo**: Número 1 (dia do Sol, liderança)
**Segunda**: Número 2 (dia da Lua, intuição)
**Terça**: Números 1, 8 (dia de Marte, ação)
**Quarta**: Números 3, 5 (dia de Mercúrio, comunicação)
**Quinta**: Número 3 (dia de Júpiter, expansão)
**Sexta**: Números 2, 6 (dia de Vênus, amor)
**Sábado**: Números 4, 7, 8 (dia de Saturno, disciplina)

Este é um guia completo da numerologia aplicada que deve ser usado como referência para todos os mapas numerológicos gerados. Cada seção contém informações detalhadas que devem ser aplicadas conforme os cálculos específicos de cada pessoa.`;

export function useContentSync() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const updateContent = async () => {
    try {
      setIsUpdating(true);
      
      const { data, error } = await supabase.functions.invoke('update-numerology-content', {
        body: { content: CANVA_CONTENT }
      });

      if (error) {
        console.error('Erro ao atualizar conteúdo:', error);
        toast.error('Erro ao atualizar conteúdo numerológico');
        return false;
      }

      setLastUpdate(new Date());
      toast.success('Conteúdo numerológico atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      toast.error('Erro ao atualizar conteúdo numerológico');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const checkContentVersion = async () => {
    try {
      const { data, error } = await supabase
        .from('numerology_texts')
        .select('version, created_at')
        .limit(1)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Se não há dados ou erro, força atualização
        console.log('Nenhum conteúdo encontrado, iniciando atualização...');
        return updateContent();
      }

      const currentVersion = data[0]?.version || 'v1.0';
      if (currentVersion !== 'v2.0') {
        console.log('Versão desatualizada detectada, atualizando conteúdo...');
        return updateContent();
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar versão do conteúdo:', error);
      return updateContent();
    }
  };

  useEffect(() => {
    // Verifica e atualiza conteúdo automaticamente ao carregar o hook
    const initContentSync = async () => {
      const success = await checkContentVersion();
      if (success) {
        setLastUpdate(new Date());
      }
    };

    initContentSync();
  }, []);

  return {
    isUpdating,
    lastUpdate,
    updateContent,
    checkContentVersion
  };
}