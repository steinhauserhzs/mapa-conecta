import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CANVA_CONTENT = `
ESTUDO NUMEROLÓGICO COMPLETO - NUMEROLOGIA CABALÍSTICA

CONTEÚDO COMPLETO EXTRAÍDO DO SITE CANVA

MOTIVAÇÃO - O que te move interiormente

Motivação 1 - INDIVIDUALIDADE E LIDERANÇA
O número de Motivação descreve os motivos e as razões que movem as atitudes do ser humano. Revela o aspecto interior da personalidade que se reflete em atitudes e comportamentos. Deseja liderança, reconhecimento, independência. É pioneiro nato, com forte necessidade de ser o primeiro em tudo que faz. Motivado pela busca do sucesso pessoal e reconhecimento. Precisa desenvolver autoconfiança sem cair no egoísmo.

Motivação 2 - COOPERAÇÃO E DIPLOMACIA
Deseja harmonia, cooperação, parceria. É motivado pela necessidade de estar em equipe, de mediar conflitos e criar pontes entre pessoas. Busca relacionamentos harmoniosos e duradouros. Tem necessidade profunda de ser aceito e amado. Precisa desenvolver autoestima para não se anular pelos outros.

Motivação 3 - EXPRESSÃO CRIATIVA
Deseja comunicar-se, criar, expressar sua alegria de viver. É motivado pela necessidade de se expressar através das artes, palavras ou atividades criativas. Busca reconhecimento por seus talentos artísticos. Precisa focar sua energia criativa para não se dispersar.

Motivação 4 - ESTABILIDADE E ORGANIZAÇÃO
Deseja ordem, segurança, estabilidade. É motivado pela necessidade de construir algo sólido e duradouro. Busca segurança material e emocional através do trabalho organizado e metódico. Precisa ser mais flexível para não ficar rígido demais.

Motivação 5 - LIBERDADE E AVENTURA
Deseja liberdade, mudanças, novas experiências. É motivado pela necessidade de explorar, viajar, conhecer o novo. Busca variedade e não suporta rotina. Precisa aprender a ter compromisso sem perder sua liberdade essencial.

Motivação 6 - RESPONSABILIDADE E CUIDADO
Deseja cuidar, servir, assumir responsabilidades familiares. É motivado pela necessidade de proteger e nutrir outros. Busca criar um ambiente harmonioso para família e amigos. Precisa equilibrar o cuidado com os outros sem se esquecer de si mesmo.

Motivação 7 - BUSCA ESPIRITUAL
Deseja conhecimento profundo, espiritualidade, compreensão dos mistérios da vida. É motivado pela necessidade de entender o significado mais profundo das coisas. Busca sabedoria através do estudo e meditação. Precisa compartilhar seu conhecimento com outros.

Motivação 8 - PODER MATERIAL
Deseja sucesso material, poder, autoridade, reconhecimento social. É motivado pela necessidade de conquistar posição de destaque na sociedade. Busca prosperidade e influência. Precisa usar seu poder de forma ética e justa.

Motivação 9 - HUMANITARISMO
Deseja servir a humanidade, fazer a diferença no mundo. É motivado pela necessidade de contribuir para um mundo melhor. Busca causas nobres e universais. Precisa ser prático em seus ideais humanitários.

Motivação 11 - INSPIRAÇÃO ELEVADA
Deseja inspirar outros, ser canal de luz e sabedoria superior. É motivado por ideais elevados e visão espiritual ampliada. Busca elevar a consciência da humanidade. Precisa equilibrar sensibilidade com praticidade.

Motivação 22 - CONSTRUÇÃO MUNDIAL
Deseja construir algo grandioso para a humanidade. É motivado pela visão de projetos que beneficiem o mundo inteiro. Busca deixar um legado duradouro. Precisa manter os pés no chão enquanto persegue seus grandes sonhos.

IMPRESSÃO - Como os outros te veem

Impressão 1 - LÍDER NATURAL
Aparenta ser uma pessoa segura de si, independente e determinada. Os outros veem alguém capaz de liderar e tomar iniciativas. Transmite confiança e autoridade natural. Pode parecer arrogante se não tomar cuidado.

Impressão 2 - PESSOA DIPLOMÁTICA
Aparenta ser gentil, cooperativa e sensível. Os outros veem alguém confiável para mediar conflitos e criar harmonia. Transmite paz e compreensão. Pode parecer fraco se não mostrar sua força interior.

Impressão 3 - COMUNICADOR ALEGRE
Aparenta ser criativo, comunicativo e alegre. Os outros veem alguém divertido e inspirador. Transmite otimismo e energia positiva. Pode parecer superficial se não mostrar sua profundidade.

Impressão 4 - PESSOA CONFIÁVEL
Aparenta ser organizado, prático e confiável. Os outros veem alguém em quem podem confiar para trabalhos sérios. Transmite estabilidade e competência. Pode parecer rígido se não mostrar flexibilidade.

Impressão 5 - ESPÍRITO LIVRE
Aparenta ser aventureiro, versátil e progressista. Os outros veem alguém interessante e cheio de vida. Transmite energia de mudança e novidade. Pode parecer instável se não mostrar compromisso.

Impressão 6 - PESSOA CUIDADOSA
Aparenta ser responsável, protetora e carinhosa. Os outros veem alguém em quem podem confiar questões familiares. Transmite calor humano e confiabilidade. Pode parecer controlador se exagerar no cuidado.

Impressão 7 - PESSOA MISTERIOSA
Aparenta ser sábia, reservada e profunda. Os outros veem alguém intelectual e espiritualizado. Transmite conhecimento e mistério. Pode parecer distante se não se abrir mais.

Impressão 8 - PESSOA PODEROSA
Aparenta ser ambiciosa, bem-sucedida e autoritária. Os outros veem alguém capaz de grandes realizações materiais. Transmite poder e competência executiva. Pode parecer materialista se não mostrar seu lado humano.

Impressão 9 - PESSOA SÁBIA
Aparenta ser generosa, compreensiva e humanitária. Os outros veem alguém capaz de ajudar em grandes questões. Transmite sabedoria e compaixão universal. Pode parecer idealista demais se não for prático.

Impressão 11 - PESSOA INSPIRADORA
Aparenta ser intuitiva, sensitiva e espiritualizada. Os outros veem alguém capaz de inspirar e elevar. Transmite luz espiritual e sabedoria superior. Pode parecer nervoso se não controlar a sensibilidade.

EXPRESSÃO - Seus talentos e habilidades

Expressão 1 - LIDERANÇA E PIONEIRISMO
Possui talentos naturais para liderar, inovar e abrir novos caminhos. É original, determinado e independente. Trabalha melhor quando pode tomar suas próprias decisões. Profissões ideais: executivo, empresário, inventor, político.

Expressão 2 - COOPERAÇÃO E MEDIAÇÃO
Possui talentos para trabalhar em equipe, mediar conflitos e criar harmonia. É diplomático, sensível e intuitivo. Trabalha melhor em parceria ou apoiando outros. Profissões ideais: diplomata, conselheiro, mediador, assistente.

Expressão 3 - COMUNICAÇÃO E ARTE
Possui talentos artísticos, comunicativos e criativos. É expressivo, otimista e inspirador. Trabalha melhor quando pode expressar sua criatividade. Profissões ideais: artista, escritor, ator, palestrante, professor.

Expressão 4 - ORGANIZAÇÃO E CONSTRUÇÃO
Possui talentos para organizar, construir e sistematizar. É prático, confiável e trabalhador. Trabalha melhor com projetos de longo prazo e estruturados. Profissões ideais: engenheiro, administrador, contador, construtor.

Expressão 5 - VERSATILIDADE E COMUNICAÇÃO
Possui talentos para vender, comunicar e adaptar-se a mudanças. É versátil, progressista e aventureiro. Trabalha melhor com variedade e liberdade. Profissões ideais: vendedor, jornalista, guia turístico, representante comercial.

Expressão 6 - CUIDADO E RESPONSABILIDADE
Possui talentos para cuidar, ensinar e assumir responsabilidades. É protetor, conselheiro e responsável. Trabalha melhor ajudando e servindo outros. Profissões ideais: médico, professor, enfermeiro, terapeuta, conselheiro familiar.

Expressão 7 - ANÁLISE E PESQUISA
Possui talentos para pesquisar, analisar e compreender mistérios. É investigativo, intuitivo e sábio. Trabalha melhor sozinho ou com pesquisas profundas. Profissões ideais: pesquisador, analista, cientista, filósofo, psicólogo.

Expressão 8 - ADMINISTRAÇÃO E PODER
Possui talentos para administrar, organizar grandes projetos e exercer autoridade. É ambicioso, eficiente e poderoso. Trabalha melhor com responsabilidades executivas. Profissões ideais: executivo, banqueiro, político, juiz, empresário.

Expressão 9 - HUMANITARISMO E ARTE
Possui talentos artísticos e humanitários. É generoso, compassivo e sábio. Trabalha melhor servindo causas maiores que si mesmo. Profissões ideais: artista, professor, médico humanitário, assistente social, filantropo.

Expressão 11 - INSPIRAÇÃO E INTUIÇÃO
Possui talentos intuitivos e inspiradores elevados. É sensitivo, visionário e espiritualizado. Trabalha melhor inspirando e elevando outros. Profissões ideais: líder espiritual, artista inspirado, conselheiro intuitivo, curador.

Expressão 22 - CONSTRUÇÃO GRANDIOSA
Possui talentos para construir projetos grandiosos que beneficiem a humanidade. É visionário prático, organizador mundial. Trabalha melhor com projetos de grande escala. Profissões ideais: construtor mundial, líder internacional, organizador de grandes projetos.

DESTINO - Sua missão de vida

Destino 1 - LIDERAR E INOVAR
Veio para abrir novos caminhos, liderar e ser pioneiro em sua área. Deve desenvolver independência, originalidade e coragem para assumir a liderança quando necessário.

Destino 2 - COOPERAR E HARMONIZAR
Veio para aprender a trabalhar em equipe, mediar conflitos e criar harmonia. Deve desenvolver diplomacia, paciência e habilidades de cooperação.

Destino 3 - INSPIRAR E CRIAR
Veio para expressar criatividade, comunicar alegria e inspirar outros. Deve desenvolver seus talentos artísticos e comunicativos.

Destino 4 - CONSTRUIR E ORGANIZAR
Veio para construir bases sólidas, organizar e criar estabilidade. Deve desenvolver disciplina, praticidade e perseverança.

Destino 5 - EXPLORAR E ENSINAR
Veio para explorar novas fronteiras, promover mudanças progressivas e ensinar através da experiência. Deve desenvolver adaptabilidade e comunicação.

Destino 6 - SERVIR E CUIDAR
Veio para cuidar da família e comunidade, assumir responsabilidades e servir outros. Deve desenvolver compaixão, responsabilidade e capacidade de nutrir.

Destino 7 - PESQUISAR E ESPIRITUALIZAR
Veio para buscar conhecimento profundo, desenvolver espiritualidade e compartilhar sabedoria. Deve desenvolver intuição, análise e compreensão espiritual.

Destino 8 - ORGANIZAR E PROSPERAR
Veio para organizar recursos materiais, exercer liderança executiva e criar prosperidade. Deve desenvolver senso de justiça, organização e autoridade ética.

Destino 9 - SERVIR A HUMANIDADE
Veio para servir causas humanitárias, elevar a consciência e contribuir para um mundo melhor. Deve desenvolver compaixão universal, sabedoria e desapego.

MISSÃO - Como realizar seu destino

Missão 1 - LIDERANÇA INOVADORA
Realizar o destino através da liderança pioneira, abrindo novos caminhos e inspirando outros a seguir.

Missão 2 - MEDIAÇÃO HARMONIOSA
Realizar o destino através da cooperação, criando pontes entre pessoas e situações conflitantes.

Missão 3 - EXPRESSÃO INSPIRADORA
Realizar o destino através da expressão criativa, comunicando alegria e beleza ao mundo.

Missão 4 - CONSTRUÇÃO SÓLIDA
Realizar o destino através da construção de bases firmes e organizações duradouras.

Missão 5 - COMUNICAÇÃO PROGRESSIVA
Realizar o destino através da comunicação de ideias progressivas e promoção de mudanças positivas.

Missão 6 - SERVIÇO AMOROSO
Realizar o destino através do serviço dedicado à família, comunidade e causas humanitárias.

Missão 7 - SABEDORIA ESPIRITUAL
Realizar o destino através da busca e compartilhamento da sabedoria espiritual e conhecimento profundo.

Missão 8 - ORGANIZAÇÃO PRÓSPERA
Realizar o destino através da organização eficiente de recursos e criação de prosperidade justa.

Missão 9 - SERVIÇO UNIVERSAL
Realizar o destino através do serviço desinteressado à humanidade e elevação da consciência coletiva.

NÚMERO PSÍQUICO - Sua essência pelo dia de nascimento

Psíquico 1 - ESSÊNCIA DE LIDERANÇA
Nasceu com essência de líder, independente e pioneiro. Naturalmente assume comando e inicia projetos.

Psíquico 2 - ESSÊNCIA DE COOPERAÇÃO
Nasceu com essência cooperativa, sensível e diplomática. Naturalmente busca harmonia e trabalha em equipe.

Psíquico 3 - ESSÊNCIA CRIATIVA
Nasceu com essência criativa, comunicativa e alegre. Naturalmente expressa-se através das artes e comunicação.

Psíquico 4 - ESSÊNCIA PRÁTICA
Nasceu com essência prática, organizada e trabalhadora. Naturalmente constrói e organiza tudo ao seu redor.

Psíquico 5 - ESSÊNCIA DE LIBERDADE
Nasceu com essência livre, aventureira e versátil. Naturalmente busca experiências variadas e mudanças.

Psíquico 6 - ESSÊNCIA DE CUIDADO
Nasceu com essência cuidadora, responsável e protetora. Naturalmente assume responsabilidades familiares.

Psíquico 7 - ESSÊNCIA ESPIRITUAL
Nasceu com essência espiritual, analítica e sábia. Naturalmente busca conhecimento profundo e compreensão.

Psíquico 8 - ESSÊNCIA DE PODER
Nasceu com essência poderosa, ambiciosa e organizadora. Naturalmente busca sucesso material e reconhecimento.

Psíquico 9 - ESSÊNCIA HUMANITÁRIA
Nasceu com essência humanitária, generosa e sábia. Naturalmente serve causas maiores que si mesmo.

LIÇÕES CÁRMICAS - O que precisa aprender

Lição Cármica 1 - APRENDER LIDERANÇA
Precisa desenvolver independência, iniciativa e capacidade de liderança. Deve superar dependência excessiva dos outros.

Lição Cármica 2 - APRENDER COOPERAÇÃO
Precisa desenvolver diplomacia, paciência e habilidade de trabalhar em equipe. Deve superar tendências autoritárias.

Lição Cármica 3 - APRENDER EXPRESSÃO
Precisa desenvolver criatividade, comunicação e capacidade de inspirar outros. Deve superar timidez e auto-crítica excessiva.

Lição Cármica 4 - APRENDER DISCIPLINA
Precisa desenvolver organização, disciplina e perseverança. Deve superar tendência à dispersão e falta de foco.

Lição Cármica 5 - APRENDER LIBERDADE CONSTRUTIVA
Precisa desenvolver adaptabilidade e progressividade equilibradas. Deve superar rigidez e medo de mudanças.

Lição Cármica 6 - APRENDER RESPONSABILIDADE
Precisa desenvolver senso de responsabilidade, cuidado e capacidade de nutrir. Deve superar egoísmo e individualismo excessivo.

Lição Cármica 7 - APRENDER ESPIRITUALIDADE
Precisa desenvolver busca interior, análise profunda e sabedoria espiritual. Deve superar materialismo e superficialidade.

Lição Cármica 8 - APRENDER AUTORIDADE ÉTICA
Precisa desenvolver liderança material ética e senso de justiça. Deve superar tendências à injustiça e abuso de poder.

Lição Cármica 9 - APRENDER COMPAIXÃO
Precisa desenvolver compaixão universal, generosidade e sabedoria. Deve superar preconceitos e visão limitada.

DÍVIDAS CÁRMICAS - Desafios específicos a superar

Dívida Cármica 13/4 - PREGUIÇA PASSADA
Em vidas anteriores foi preguiçoso e irresponsável. Nesta vida deve trabalhar com disciplina e organização. Manifesta-se como dificuldades com trabalho duro e tendência à preguiça.

Dívida Cármica 14/5 - ABUSO DA LIBERDADE
Em vidas anteriores abusou da liberdade e foi irresponsável. Nesta vida deve aprender liberdade com responsabilidade. Manifesta-se como tendência a vícios e excessos.

Dívida Cármica 16/7 - ORGULHO ESPIRITUAL
Em vidas anteriores foi orgulhoso espiritualmente e abusou de conhecimentos. Nesta vida deve aprender humildade espiritual. Manifesta-se como quedas súbitas e lições humilhantes.

Dívida Cármica 19/1 - ABUSO DE PODER
Em vidas anteriores abusou do poder e foi tirano. Nesta vida deve aprender liderança serviçal. Manifesta-se como dificuldades com autoridade e obstáculos na liderança.

TENDÊNCIAS OCULTAS - Talentos naturais inconscientes

Tendência Oculta 1 - TALENTO DE LIDERANÇA NATURAL
Possui talento inconsciente para liderar e tomar iniciativas. Este talento se manifesta espontaneamente em situações que requerem liderança.

Tendência Oculta 2 - TALENTO DE MEDIAÇÃO NATURAL
Possui talento inconsciente para mediar conflitos e criar harmonia. Este talento se manifesta quando há necessidade de diplomacia.

Tendência Oculta 3 - TALENTO CRIATIVO NATURAL
Possui talento inconsciente para criar e comunicar. Este talento se manifesta através de expressões artísticas espontâneas.

Tendência Oculta 4 - TALENTO ORGANIZACIONAL NATURAL
Possui talento inconsciente para organizar e estruturar. Este talento se manifesta quando há necessidade de ordem e sistema.

Tendência Oculta 5 - TALENTO DE ADAPTAÇÃO NATURAL
Possui talento inconsciente para se adaptar e promover mudanças. Este talento se manifesta em situações que requerem flexibilidade.

Tendência Oculta 6 - TALENTO DE CUIDADO NATURAL
Possui talento inconsciente para cuidar e nutrir outros. Este talento se manifesta quando há necessidade de proteção e cuidado.

Tendência Oculta 7 - TALENTO ANALÍTICO NATURAL
Possui talento inconsciente para analisar e compreender profundamente. Este talento se manifesta quando há mistérios a serem desvendados.

Tendência Oculta 8 - TALENTO ADMINISTRATIVO NATURAL
Possui talento inconsciente para administrar e organizar recursos. Este talento se manifesta em situações que requerem eficiência executiva.

Tendência Oculta 9 - TALENTO HUMANITÁRIO NATURAL
Possui talento inconsciente para compreender e servir a humanidade. Este talento se manifesta quando há necessidade de compaixão e sabedoria.

RESPOSTA SUBCONSCIENTE - Como reage instintivamente

Resposta 1 - REAÇÃO DE LIDERANÇA
Em situações de crise, reage automaticamente assumindo a liderança e tomando iniciativas para resolver problemas.

Resposta 2 - REAÇÃO DE MEDIAÇÃO
Em situações de crise, reage automaticamente buscando harmonizar e mediar conflitos para restaurar a paz.

Resposta 3 - REAÇÃO CRIATIVA
Em situações de crise, reage automaticamente buscando soluções criativas e comunicando otimismo.

Resposta 4 - REAÇÃO ORGANIZADORA
Em situações de crise, reage automaticamente organizando e estruturando para resolver problemas práticos.

Resposta 5 - REAÇÃO DE MUDANÇA
Em situações de crise, reage automaticamente promovendo mudanças e adaptações necessárias.

Resposta 6 - REAÇÃO PROTETORA
Em situações de crise, reage automaticamente protegendo e cuidando de outros, assumindo responsabilidades.

Resposta 7 - REAÇÃO ANALÍTICA
Em situações de crise, reage automaticamente analisando profundamente a situação antes de agir.

Resposta 8 - REAÇÃO EXECUTIVA
Em situações de crise, reage automaticamente organizando recursos e exercendo autoridade para resolver problemas.

Resposta 9 - REAÇÃO COMPASSIVA
Em situações de crise, reage automaticamente com compreensão e busca soluções que beneficiem a todos.

CICLOS DE VIDA - Fases evolutivas principais

Primeiro Ciclo (0 aos 28-35 anos) - FORMAÇÃO
Baseado no mês de nascimento. Período de formação da personalidade, aprendizado básico e desenvolvimento de habilidades fundamentais.

Segundo Ciclo (28-35 aos 52-60 anos) - PRODUÇÃO
Baseado no dia de nascimento. Período de maior produtividade, realização profissional e construção do lugar no mundo.

Terceiro Ciclo (52-60 anos em diante) - COLHEITA
Baseado no ano de nascimento. Período de colheita dos esforços anteriores, transmissão de conhecimento e sabedoria.

DESAFIOS - Obstáculos a superar em cada fase

Primeiro Desafio (0 aos 28-35 anos) - FORMAÇÃO
Obstáculos relacionados ao desenvolvimento da personalidade e aprendizado básico de vida.

Segundo Desafio (28-35 aos 52-60 anos) - PRODUÇÃO
Obstáculos relacionados à realização profissional e construção do lugar no mundo.

Terceiro Desafio (52-60 anos em diante) - COLHEITA
Obstáculos relacionados à aceitação da idade madura e transmissão de conhecimento.

Desafio Principal (vida toda) - CONSTANTE
Obstáculo principal que perpassa toda a vida e deve ser constantemente trabalhado.

MOMENTOS DECISIVOS - Idades de mudanças importantes

Primeiro Momento Decisivo
Idade calculada que marca uma mudança importante na juventude.

Segundo Momento Decisivo
Idade calculada que marca uma mudança importante na vida adulta.

Terceiro Momento Decisivo
Idade calculada que marca uma mudança importante na maturidade.

Quarto Momento Decisivo
Idade calculada que marca uma mudança importante na velhice.

ANO PESSOAL - Influências anuais cíclicas

Ano Pessoal 1 - NOVOS COMEÇOS
Ano para iniciar projetos, tomar iniciativas e plantar sementes para o futuro. Energia de pioneirismo e liderança.

Ano Pessoal 2 - DESENVOLVIMENTO
Ano para desenvolver projetos iniciados, cooperar e ser paciente. Energia de colaboração e crescimento lento.

Ano Pessoal 3 - EXPRESSÃO
Ano para expressar criatividade, comunicar-se e expandir socialmente. Energia de alegria e inspiração.

Ano Pessoal 4 - CONSTRUÇÃO
Ano para trabalhar duro, organizar e construir bases sólidas. Energia de disciplina e organização.

Ano Pessoal 5 - MUDANÇAS
Ano para fazer mudanças, explorar novas oportunidades e buscar liberdade. Energia de transformação e aventura.

Ano Pessoal 6 - RESPONSABILIDADES
Ano para assumir responsabilidades familiares, cuidar de outros e servir. Energia de amor e cuidado.

Ano Pessoal 7 - INTROSPECÇÃO
Ano para buscar conhecimento interior, estudar e desenvolver espiritualidade. Energia de análise e sabedoria.

Ano Pessoal 8 - REALIZAÇÕES
Ano para colher frutos do trabalho, alcançar sucesso material e reconhecimento. Energia de conquista e poder.

Ano Pessoal 9 - CONCLUSÕES
Ano para finalizar ciclos, se despedir do desnecessário e se preparar para novo começo. Energia de compaixão e finalização.

MÊS PESSOAL - Influências mensais

Cada mês dentro do ano pessoal tem sua vibração específica que modifica a energia anual.

DIA PESSOAL - Influências diárias

Cada dia tem sua vibração específica calculada com base no mês pessoal.

ANJOS CABALÍSTICOS - Proteção espiritual

Cada pessoa tem um anjo protetor específico baseado em cálculos cabalísticos do nome e data de nascimento.

HARMONIA CONJUGAL - Compatibilidade amorosa

Análise da compatibilidade entre números para relacionamentos amorosos e parcerias.

CORES HARMÔNICAS - Cores que vibram com cada número

Número 1: Vermelho, laranja - cores de liderança e energia
Número 2: Azul claro, prata - cores de harmonia e paz
Número 3: Amarelo, dourado - cores de alegria e criatividade
Número 4: Verde, marrom - cores de estabilidade e natureza
Número 5: Multicolorido, turquesa - cores de liberdade e movimento
Número 6: Rosa, verde claro - cores de amor e cuidado
Número 7: Violeta, púrpura - cores místicas e espirituais
Número 8: Preto, cinza escuro - cores de poder e autoridade
Número 9: Branco, todas as cores - cores universais e sabedoria

PROFISSÕES IDEAIS - Atividades mais adequadas

Número 1: Executivo, empresário, líder, inventor, pioneiro
Número 2: Diplomata, mediador, conselheiro, assistente, colaborador
Número 3: Artista, comunicador, escritor, ator, palestrante
Número 4: Administrador, engenheiro, contador, construtor, organizador
Número 5: Vendedor, jornalista, guia turístico, piloto, aventureiro
Número 6: Médico, professor, enfermeiro, terapeuta, cuidador
Número 7: Pesquisador, analista, científista, filósofo, místico
Número 8: Banqueiro, juiz, executivo, político, empresário
Número 9: Humanitário, artista, professor, médico social, filantropo

ORIENTAÇÕES DE SAÚDE - Cuidados específicos

Número 1: Cuidar do coração e sistema circulatório, evitar estresse excessivo
Número 2: Cuidar do sistema digestivo e nervoso, buscar equilíbrio emocional
Número 3: Cuidar da garganta e sistema respiratório, expressar-se adequadamente
Número 4: Cuidar das articulações e ossos, fazer exercícios regulares
Número 5: Cuidar do sistema nervoso, evitar excessos e vícios
Número 6: Cuidar do coração e sistema reprodutivo, equilibrar emoções
Número 7: Cuidar da mente e sistema nervoso, praticar meditação
Número 8: Cuidar da pressão arterial e estresse, equilibrar trabalho e descanso
Número 9: Cuidar de todo o organismo, praticar altruísmo e evitar dispersão energética
`;

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
      if (currentVersion !== 'v3.0') {
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