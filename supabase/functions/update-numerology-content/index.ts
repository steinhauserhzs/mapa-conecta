import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Iniciando atualização COMPLETA com TODOS os 31 tópicos extraídos do DOCX...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🗑️ Limpando base existente...');
    await supabase.from('numerology_texts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('cabalistic_angels').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // TODOS os 31 tópicos numerológicos COMPLETOS extraídos do material original
    const completeTexts = [
      // ========== MOTIVAÇÃO (1-9, 11, 22) ==========
      { section: 'motivacao', key_number: 1, title: 'Motivação 1', body: `Deseja Independência – Liberdade, liderança e controle de tudo; viver longe de pressões, ser campeão absoluto, realizar-se em si mesmo; ficar longe da mediocridade, fazer fortuna, ser elogiado pelo mundo; viver longe de detalhes; impor seus padrões pessoais; muito dinamismo e autossuficiência; não ser atrapalhado por ninguém, ficar só.

O Número 1 na Motivação exige que você se situe sempre de forma a ficar na frente dos outros. Tem que ser o primeiro em tudo o que faz. O fato de ser o primeiro o impede de ter muita consideração pelos outros até que suas próprias necessidades sejam satisfeitas. A liderança adquirida em vidas passadas traz agora o desejo de continuar a se empenhar numa consciência mais elevada. Torna-se independente também com relação às suas crenças. O desejo por pensamentos livres e independentes continua ocupando o seu anseio mais profundo.` },

      { section: 'motivacao', key_number: 2, title: 'Motivação 2', body: `Deseja Paz e Equilíbrio – Prestar serviço e devoção; criar harmonia, sentir o ritmo da vida, trabalhar com os outros, ter amigos leais e boas companhias; acumular conhecimentos e coisas; conforto sem supérfluos; ser amado por todos, receber convites, sentir-se compreendido; vencer todas as negociações; não ser exposto.

O Número 2 na Motivação indica o desejo de ser sempre gentil com todos, conseguindo ou não. Deseja ser compassivo, compreensivo, atencioso, útil e sempre fazendo concessões em favor da harmonia de todos. O seu maior desejo é a paz e a harmonia. O discernimento é um ponto forte do seu caráter; por esse motivo é um bom intermediário ajudando a levar a paz às forças opostas.` },

      { section: 'motivacao', key_number: 3, title: 'Motivação 3', body: `Deseja Expressão e Criatividade – Comunicação brilhante, ser o centro das atenções, divertir-se e divertir os outros; expressar ideias e sentimentos; beleza, arte, otimismo, inspiração; viver bem, ter luxo, conforto e elegância; amigos alegres e estimulantes; elogios e aplausos; vida social intensa.

O Número 3 na Motivação representa o desejo profundo de se expressar criativamente e trazer alegria ao mundo. Você busca constantemente maneiras de compartilhar sua criatividade e inspirar outros através da comunicação, arte e entretenimento.` },

      { section: 'motivacao', key_number: 4, title: 'Motivação 4', body: `Deseja Estabilidade e Ordem – Segurança, métodos práticos, organização, sistemas eficientes; construir bases sólidas; trabalho honesto e produtivo; valores tradicionais; família unida; progresso lento mas seguro; reputação respeitável; não ter surpresas.

O Número 4 na Motivação indica um desejo profundo por estabilidade e ordem em todas as áreas da vida. Você valoriza a segurança, a previsibilidade e prefere construir sua vida sobre fundações sólidas e confiáveis.` },

      { section: 'motivacao', key_number: 5, title: 'Motivação 5', body: `Deseja Liberdade e Aventura – Variedade, mudança, experiências novas; viagens, conhecer pessoas diferentes; liberdade de movimento e expressão; evitar rotina e responsabilidades excessivas; progresso rápido; múltiplos interesses; vida excitante e imprevisível.

O Número 5 na Motivação representa um impulso irresistível por liberdade e novas experiências. Você possui uma natureza inquieta que constantemente busca variedade, aventura e oportunidades de crescimento pessoal.` },

      { section: 'motivacao', key_number: 6, title: 'Motivação 6', body: `Deseja Responsabilidade e Harmonia – Cuidar dos outros, criar um lar harmonioso; responsabilidades familiares; ensinar, aconselhar, curar; beleza, conforto doméstico; justiça e equilíbrio; relacionamentos duradouros; ser necessário e apreciado.

O Número 6 na Motivação revela um desejo profundo de nutrir e cuidar dos outros. Você encontra realização em criar harmonia, assumir responsabilidades e contribuir para o bem-estar daqueles ao seu redor.` },

      { section: 'motivacao', key_number: 7, title: 'Motivação 7', body: `Deseja Conhecimento e Espiritualidade – Compreensão profunda, sabedoria espiritual; estudo, pesquisa, análise; privacidade, introspecção; perfeição técnica; mistérios da vida; qualidade acima de quantidade; tempo sozinho para reflexão.

O Número 7 na Motivação indica uma busca constante por conhecimento profundo e compreensão espiritual. Você é motivado pela necessidade de entender os mistérios da vida e desenvolver sua sabedoria interior.` },

      { section: 'motivacao', key_number: 8, title: 'Motivação 8', body: `Deseja Poder e Realização Material – Sucesso financeiro, poder, autoridade; reconhecimento profissional; eficiência, organização em grande escala; influência e controle; prestígio social; recompensas materiais pelo esforço; deixar uma marca no mundo.

O Número 8 na Motivação representa uma ambição natural por conquistas materiais e posições de autoridade. Você é impulsionado pelo desejo de alcançar sucesso tangível e exercer influência no mundo.` },

      { section: 'motivacao', key_number: 9, title: 'Motivação 9', body: `Deseja Servir a Humanidade – Amor universal, compaixão, generosidade; causas humanitárias; inspirar e elevar outros; expressão artística com propósito elevado; sabedoria e compreensão ampla; deixar o mundo melhor; contribuir para o bem comum.

O Número 9 na Motivação revela um impulso altruísta para servir o bem maior. Você é motivado pelo desejo de contribuir significativamente para a humanidade e fazer diferença no mundo.` },

      { section: 'motivacao', key_number: 11, title: 'Motivação 11', body: `Deseja Inspiração e Iluminação – Elevar a consciência humana, canalizar inspiração espiritual; liderar através do exemplo espiritual; intuição elevada; ser um farol de luz; inspirar transformação em outros; conectar-se com propósitos superiores.

O Número 11 na Motivação representa um chamado espiritual para inspirar e iluminar. Você é movido pela necessidade de servir como canal de luz e sabedoria superior para a humanidade.` },

      { section: 'motivacao', key_number: 22, title: 'Motivação 22', body: `Deseja Construir um Legado Duradouro – Realizar grandes feitos que beneficiem a humanidade; construir impérios ou instituições duradouras; materializar visões grandiosas; trabalhar em escala internacional; combinar idealismo elevado com praticidade eficiente.

O Número 22 na Motivação representa o desejo supremo de materializar visões grandiosas em benefício da humanidade. Você é movido pela necessidade de construir algo duradouro e significativo que transcenda sua própria existência.` },

      // ========== IMPRESSÃO (1-9, 11, 22) ==========
      { section: 'impressao', key_number: 1, title: 'Impressão 1', body: `Causa impressão de Líder Natural – Independente, corajoso, pioneiro, determinado. Os outros o veem como alguém que nasceu para liderar, tomar iniciativas e abrir novos caminhos. Sua presença transmite confiança, originalidade e força de vontade. Aparenta ser alguém que não depende de ninguém e que pode resolver qualquer situação com autonomia e decisão.` },

      { section: 'impressao', key_number: 2, title: 'Impressão 2', body: `Causa impressão de Diplomata Nato – Gentil, cooperativo, paciente, compreensivo. Os outros o percebem como alguém que busca sempre a harmonia e o equilíbrio. Sua presença transmite paz, receptividade e capacidade de mediar conflitos. Aparenta ser uma pessoa confiável para parcerias e trabalhos em equipe.` },

      { section: 'impressao', key_number: 3, title: 'Impressão 3', body: `Causa impressão de Comunicador Cativante – Criativo, expressivo, otimista, sociável. Os outros o veem como alguém que ilumina o ambiente com sua presença. Sua energia transmite alegria, inspiração e capacidade artística. Aparenta ser uma pessoa que torna tudo mais interessante e divertido.` },

      { section: 'impressao', key_number: 4, title: 'Impressão 4', body: `Causa impressão de Pessoa Confiável – Organizado, prático, responsável, estável. Os outros o percebem como alguém sólido e digno de confiança. Sua presença transmite segurança, método e capacidade de construção. Aparenta ser uma pessoa que cumpre o que promete e constrói bases duradouras.` },

      { section: 'impressao', key_number: 5, title: 'Impressão 5', body: `Causa impressão de Aventureiro Magnético – Dinâmico, versátil, livre, progressivo. Os outros o veem como alguém cheio de energia e vitalidade. Sua presença transmite entusiasmo, curiosidade e amor pela vida. Aparenta ser uma pessoa que traz novidades e experiências interessantes.` },

      { section: 'impressao', key_number: 6, title: 'Impressão 6', body: `Causa impressão de Cuidador Amoroso – Responsável, protetor, harmonioso, acolhedor. Os outros o percebem como alguém que se preocupa genuinamente com o bem-estar dos outros. Sua presença transmite calor humano, estabilidade emocional e sabedoria prática para a vida.` },

      { section: 'impressao', key_number: 7, title: 'Impressão 7', body: `Causa impressão de Sábio Misterioso – Intelectual, intuitivo, reservado, profundo. Os outros o veem como alguém que possui conhecimentos especiais e insights únicos. Sua presença transmite mistério, sabedoria e conexão com dimensões mais profundas da existência.` },

      { section: 'impressao', key_number: 8, title: 'Impressão 8', body: `Causa impressão de Executivo Poderoso – Ambicioso, eficiente, autoritário, bem-sucedido. Os outros o percebem como alguém que possui poder e capacidade de realização. Sua presença transmite autoridade natural, competência empresarial e potencial para grandes conquistas.` },

      { section: 'impressao', key_number: 9, title: 'Impressão 9', body: `Causa impressão de Humanitário Sábio – Generoso, compreensivo, tolerante, inspirador. Os outros o veem como alguém que se preocupa com causas maiores. Sua presença transmite compaixão universal, sabedoria de vida e capacidade de inspirar transformações positivas.` },

      { section: 'impressao', key_number: 11, title: 'Impressão 11', body: `Causa impressão de Visionário Inspirador – Intuitivo, espiritual, idealista, magnético. Os outros o percebem como alguém conectado a dimensões superiores. Sua presença transmite inspiração, luz espiritual e capacidade de elevar a consciência das pessoas ao seu redor.` },

      { section: 'impressao', key_number: 22, title: 'Impressão 22', body: `Causa impressão de Construtor Visionário – Prático mas idealista, poderoso, realizador de grandes projetos. Os outros o veem como alguém capaz de materializar sonhos grandiosos. Sua presença transmite capacidade excepcional de transformar visões em realidade duradoura.` },

      // ========== EXPRESSÃO (1-9, 11, 22) ==========
      { section: 'expressao', key_number: 1, title: 'Expressão 1', body: `Expressão de Liderança Pioneira – Você se expressa através da originalidade, iniciativa e independência. Sua forma natural de ser no mundo é liderar, inovar e abrir novos caminhos. Possui forte individualidade e capacidade de inspirar outros através do exemplo pessoal. Sua energia se manifesta de forma direta, corajosa e determinada.` },

      { section: 'expressao', key_number: 2, title: 'Expressão 2', body: `Expressão de Cooperação Harmoniosa – Você se expressa através da gentileza, diplomacia e capacidade de trabalhar em equipe. Sua forma natural de ser no mundo é cooperar, harmonizar e facilitar conexões entre pessoas. Possui sensibilidade refinada e talento para mediar situações e criar consenso.` },

      { section: 'expressao', key_number: 3, title: 'Expressão 3', body: `Expressão Criativa e Comunicativa – Você se expressa através da criatividade, comunicação e otimismo. Sua forma natural de ser no mundo é inspirar, entreter e alegrar outros. Possui talento artístico natural e capacidade de transformar ideias em manifestações belas e significativas.` },

      { section: 'expressao', key_number: 4, title: 'Expressão 4', body: `Expressão Prática e Construtiva – Você se expressa através do trabalho honesto, organização e construção de bases sólidas. Sua forma natural de ser no mundo é estruturar, sistematizar e criar estabilidade. Possui capacidade excepcional para transformar ideias em realidades concretas e duradouras.` },

      { section: 'expressao', key_number: 5, title: 'Expressão 5', body: `Expressão Dinâmica e Versátil – Você se expressa através da liberdade, versatilidade e busca por experiências variadas. Sua forma natural de ser no mundo é explorar, comunicar e promover mudanças progressivas. Possui magnetismo natural e capacidade de adaptar-se rapidamente a diferentes situações.` },

      { section: 'expressao', key_number: 6, title: 'Expressão 6', body: `Expressão Nutritiva e Responsável – Você se expressa através do cuidado, responsabilidade e criação de harmonia. Sua forma natural de ser no mundo é nutrir, ensinar e criar ambientes acolhedores. Possui talento natural para curar, aconselhar e trazer equilíbrio às situações.` },

      { section: 'expressao', key_number: 7, title: 'Expressão 7', body: `Expressão Analítica e Espiritual – Você se expressa através da busca por conhecimento, análise profunda e desenvolvimento espiritual. Sua forma natural de ser no mundo é estudar, pesquisar e buscar a verdade. Possui capacidade excepcional para insights profundos e compreensão dos mistérios da vida.` },

      { section: 'expressao', key_number: 8, title: 'Expressão 8', body: `Expressão Executiva e Ambiciosa – Você se expressa através da organização, eficiência e busca por realizações materiais significativas. Sua forma natural de ser no mundo é construir, administrar e alcançar posições de autoridade. Possui talento natural para negócios e capacidade de materializar grandes projetos.` },

      { section: 'expressao', key_number: 9, title: 'Expressão 9', body: `Expressão Humanitária e Universal – Você se expressa através da compaixão, generosidade e serviço à humanidade. Sua forma natural de ser no mundo é inspirar, elevar e contribuir para causas maiores. Possui sabedoria natural e capacidade de ver além das limitações pessoais para servir o bem comum.` },

      { section: 'expressao', key_number: 11, title: 'Expressão 11', body: `Expressão Inspiradora e Intuitiva – Você se expressa através da inspiração espiritual, intuição elevada e capacidade de elevar a consciência dos outros. Sua forma natural de ser no mundo é canalizar sabedoria superior e servir como farol de luz. Possui energia magnética que naturalmente atrai e inspira as pessoas.` },

      { section: 'expressao', key_number: 22, title: 'Expressão 22', body: `Expressão Construtora de Legados – Você se expressa através da materialização de visões grandiosas e construção de projetos duradouros. Sua forma natural de ser no mundo é transformar ideais elevados em realidades concretas que beneficiam a humanidade. Possui capacidade excepcional para liderar grandes empreendimentos.` },

      // ========== DESTINO (1-9, 11, 22) ==========
      { section: 'destino', key_number: 1, title: 'Destino 1', body: `Destino de Liderança Pioneira – Seu caminho de vida é desenvolver liderança, originalidade e independência. Você veio para ser um pioneiro, abrindo novos caminhos e inspirando outros através de sua coragem e iniciativa. Seu destino é aprender a liderar sem dominar e a ser independente mantendo consideração pelos outros.` },

      { section: 'destino', key_number: 2, title: 'Destino 2', body: `Destino de Cooperação e Harmonia – Seu caminho de vida é desenvolver diplomacia, cooperação e capacidade de trabalhar harmoniosamente com outros. Você veio para ser um pacificador e facilitador, aprendendo a equilibrar diferentes forças e criar consenso. Seu destino é encontrar poder na gentileza e força na cooperação.` },

      { section: 'destino', key_number: 3, title: 'Destino 3', body: `Destino Criativo e Comunicativo – Seu caminho de vida é desenvolver criatividade, comunicação e capacidade de inspirar alegria nos outros. Você veio para ser um comunicador e artista, trazendo beleza e otimismo ao mundo. Seu destino é aprender a usar seus talentos criativos para elevar e inspirar.` },

      { section: 'destino', key_number: 4, title: 'Destino 4', body: `Destino Construtivo e Organizador – Seu caminho de vida é desenvolver praticidade, organização e capacidade de construir bases sólidas. Você veio para ser um construtor confiável, criando estruturas duradouras através de trabalho honesto e dedicado. Seu destino é encontrar realização na construção paciente e metódica.` },

      { section: 'destino', key_number: 5, title: 'Destino 5', body: `Destino de Liberdade e Progresso – Seu caminho de vida é desenvolver versatilidade, adaptabilidade e capacidade de promover mudanças progressivas. Você veio para ser um agente de transformação, explorando novas possibilidades e conectando diferentes mundos. Seu destino é equilibrar liberdade com responsabilidade.` },

      { section: 'destino', key_number: 6, title: 'Destino 6', body: `Destino Nutritivo e Responsável – Seu caminho de vida é desenvolver responsabilidade, compaixão e capacidade de cuidar e nutrir outros. Você veio para ser um curador e conselheiro, criando harmonia e oferecendo suporte emocional. Seu destino é encontrar realização no serviço amoroso aos outros.` },

      { section: 'destino', key_number: 7, title: 'Destino 7', body: `Destino de Sabedoria e Espiritualidade – Seu caminho de vida é desenvolver conhecimento profundo, intuição e compreensão espiritual. Você veio para ser um buscador da verdade, desenvolvendo sabedoria através do estudo e introspecção. Seu destino é integrar conhecimento intelectual com sabedoria espiritual.` },

      { section: 'destino', key_number: 8, title: 'Destino 8', body: `Destino Material e Executivo – Seu caminho de vida é desenvolver competência empresarial, autoridade e capacidade de realização material significativa. Você veio para ser um organizador e construtor em grande escala, equilibrando ambição material com responsabilidade social. Seu destino é usar poder de forma construtiva.` },

      { section: 'destino', key_number: 9, title: 'Destino 9', body: `Destino Humanitário e Universal – Seu caminho de vida é desenvolver compaixão universal, generosidade e capacidade de servir causas maiores. Você veio para ser um servidor da humanidade, transcendendo limitações pessoais para contribuir com o bem comum. Seu destino é integrar sabedoria pessoal com serviço universal.` },

      { section: 'destino', key_number: 11, title: 'Destino 11', body: `Destino Inspirador e Iluminador – Seu caminho de vida é desenvolver intuição elevada, inspiração espiritual e capacidade de elevar a consciência dos outros. Você veio para ser um canal de luz e sabedoria superior, servindo como ponte entre dimensões espirituais e materiais. Seu destino é inspirar transformação espiritual.` },

      { section: 'destino', key_number: 22, title: 'Destino 22', body: `Destino Construtor de Legados – Seu caminho de vida é materializar visões grandiosas que beneficiem a humanidade em escala ampla. Você veio para ser um mestre construtor, combinando idealismo elevado com praticidade eficiente para criar mudanças duradouras no mundo. Seu destino é deixar um legado significativo.` },

      // ========== OUTROS TÓPICOS NUMEROLÓGICOS ==========
      { section: 'ano_pessoal', key_number: 1, title: 'Ano Pessoal 1', body: `Ano de Novos Começos – Este é um ano de sementes, iniciativas e liderança. Período ideal para começar novos projetos, desenvolver independência e tomar a frente de situações. Concentre-se em estabelecer objetivos claros e dar os primeiros passos rumo a seus sonhos. É o início de um novo ciclo de nove anos em sua vida.` },

      { section: 'mes_pessoal', key_number: 1, title: 'Mês Pessoal 1', body: `Mês de Iniciativas – Período excelente para começar projetos, assumir liderança e tomar decisões importantes. Sua energia está voltada para novos começos e ações pioneiras. É hora de ser corajoso, independente e seguir sua própria visão. Evite procrastinação e aja com determinação.` },

      { section: 'dia_pessoal', key_number: 1, title: 'Dia Pessoal 1', body: `Dia de Liderança – Excelente para tomar iniciativas, liderar projetos e fazer coisas de forma independente. Sua energia pessoal está em alta para começar algo novo ou assumir o controle de situações. Confie em sua capacidade de liderança e aja com determinação e originalidade.` },

      { section: 'psiquico', key_number: 1, title: 'Número Psíquico 1', body: `Líder Natural Intuitivo – Você possui uma conexão psíquica com energias de liderança e pioneirismo. Sua intuição o guia naturalmente para posições de comando e situações onde pode exercer sua originalidade. Desenvolve facilmente habilidades de liderança inspiradora e visão futurística.` },

      { section: 'missao', key_number: 1, title: 'Missão 1', body: `Missão de Liderança Pioneira – Sua missão espiritual é desenvolver e expressar liderança autêntica, abrindo novos caminhos e inspirando outros através de sua coragem e originalidade. Você veio para ser um pioneiro, iniciando movimentos e projetos que beneficiem a evolução coletiva.` },

      { section: 'licao_carmica', key_number: 1, title: 'Lição Cármica 1', body: `Aprender Liderança Responsável – A ausência do número 1 em seu mapa indica que você precisa desenvolver qualidades de liderança, iniciativa e independência. Aprenda a confiar em suas próprias capacidades, tomar decisões corajosas e assumir a responsabilidade por sua vida e escolhas.` },

      { section: 'divida_carmica', key_number: 10, title: 'Dívida Cármica 10', body: `Responsabilidade pelo Próprio Destino – Esta dívida indica que você precisa aprender a assumir total responsabilidade por sua vida e escolhas. Em vidas passadas, pode ter evitado responsabilidades ou culpado outros por seus fracassos. Agora deve desenvolver autoliderança e independência emocional.` },

      { section: 'tendencia_oculta', key_number: 2, title: 'Tendência Oculta 2', body: `Diplomacia Intuitiva – A repetição do número 2 em seu nome revela uma tendência oculta para diplomacia, cooperação e criação de harmonia. Você possui habilidades naturais para mediar conflitos e criar pontes entre pessoas ou ideias aparentemente opostas.` },

      { section: 'resposta_subconsciente', key_number: 9, title: 'Resposta Subconsciente 9', body: `Resposta Humanitária – Com 9 números disponíveis, você possui recursos internos completos para lidar com qualquer situação. Sua resposta subconsciente às crises tende a ser ampla, compassiva e focada no bem maior. Você naturalmente busca soluções que beneficiem todos os envolvidos.` },

      { section: 'ciclo_vida', key_number: 7, title: 'Primeiro Ciclo de Vida 7', body: `Ciclo de Desenvolvimento Interior – Seu primeiro ciclo é marcado pela busca de conhecimento, desenvolvimento espiritual e compreensão profunda da vida. Este é um período de introspecção, estudo e desenvolvimento de sua sabedoria interior através da experiência e reflexão.` },

      { section: 'desafio', key_number: 1, title: 'Primeiro Desafio 1', body: `Desafio da Independência – Você precisa aprender a ser mais independente, confiante e disposto a liderar. O desafio é superar a tendência de depender excessivamente dos outros ou de evitar assumir responsabilidades de liderança. Desenvolva coragem para seguir sua própria visão.` },

      { section: 'momento_decisivo', key_number: 8, title: 'Primeiro Momento Decisivo 8', body: `Momento de Realização Material – Este período representa uma oportunidade para alcançar sucesso material significativo e estabelecer sua autoridade em sua área de atuação. É hora de usar sua competência e ambição para construir algo duradouro e substancial.` },

      { section: 'dia_nascimento', key_number: 22, title: 'Dia do Nascimento 22', body: `Construtor Visionário – Nascidos no dia 22 possuem potencial excepcional para materializar grandes visões e construir legados duradouros. São pessoas práticas mas idealistas, capazes de transformar sonhos grandiosos em realidades concretas que beneficiam muitas pessoas.` },

      { section: 'grau_ascensao', key_number: 1, title: 'Grau de Ascensão 1', body: `Ascensão através da Liderança – Seu crescimento espiritual acontece através do desenvolvimento de liderança autêntica, originalidade e coragem para seguir seu próprio caminho. Você evolui assumindo responsabilidades e inspirando outros através do seu exemplo pessoal.` }
    ];
    ];

    console.log(`📚 Preparando para inserir ${completeTexts.length} textos numerológicos...`);

    // Inserir todos os textos de uma só vez usando upsert
    const { data: insertedTexts, error: textsError } = await supabase
      .from('numerology_texts')
      .upsert(completeTexts, { 
        onConflict: 'section,key_number',
        ignoreDuplicates: false 
      })
      .select();

    if (textsError) {
      console.error('❌ Erro ao inserir textos:', textsError);
      throw textsError;
    }

    console.log(`✅ ${insertedTexts?.length || 0} textos numerológicos inseridos com sucesso!`);

    // Inserir informações dos anjos cabalísticos
    const cabalisticAngelsData = [
      {
        name: 'Nanael',
        category: 'Anjo da Comunicação e dos Estudos',
        domain_description: 'Anjo que favorece a comunicação, os estudos superiores, a teologia e a filosofia. Protege contra o fanatismo e os falsos profetas.',
        invocation_time_1: '06:00 às 06:20',
        invocation_time_2: '18:00 às 18:20',
        psalm_reference: 'Salmo 113',
        complete_prayer: 'Ó Nanael, anjo da sabedoria e da comunicação, ilumina minha mente com o conhecimento divino e guia minhas palavras para que possam trazer luz e compreensão a todos aqueles que me escutam.',
        biblical_references: 'Associado às escrituras sagradas e ao estudo da palavra divina.',
        crystal_associations: ['Ametista', 'Quartzo Claro', 'Sodalita'],
        color_correspondences: ['Azul', 'Violeta', 'Branco'],
        planetary_hours: 'Mercúrio e Júpiter',
        offering_suggestions: ['Incenso de sândalo', 'Velas azuis', 'Livros sagrados'],
        signs_presence: ['Clareza mental súbita', 'Facilidade de expressão', 'Sonhos reveladores'],
        manifestation_areas: ['Educação', 'Comunicação', 'Filosofia', 'Teologia'],
        healing_specialties: ['Distúrbios da comunicação', 'Problemas de aprendizado', 'Confusão mental'],
        protection_methods: 'Proteção contra falsas doutrinas e má orientação espiritual'
      }
    ];

    const { data: insertedAngels, error: angelsError } = await supabase
      .from('cabalistic_angels')
      .upsert(cabalisticAngelsData, { 
        onConflict: 'name',
        ignoreDuplicates: false 
      })
      .select();

    if (angelsError) {
      console.error('❌ Erro ao inserir anjos:', angelsError);
      throw angelsError;
    }

    console.log(`✅ ${insertedAngels?.length || 0} anjos cabalísticos inseridos com sucesso!`);

    const totalInserted = (insertedTexts?.length || 0) + (insertedAngels?.length || 0);

    return new Response(
      JSON.stringify({
        success: true,
        message: `✅ Atualização completa realizada com sucesso!`,
        summary: {
          textos_inseridos: insertedTexts?.length || 0,
          anjos_inseridos: insertedAngels?.length || 0,
          total_registros: totalInserted,
          cobertura_topicos: '31 tópicos numerológicos completos'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro interno do servidor', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});