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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🚀 Populando conteúdo do PDF Material Complementar 9');

    // Comprehensive content from Material_Complementar_9.pdf
    const numerologyContent = [
      // Motivação
      {
        section: "Motivacao",
        key_number: 1,
        title: "Motivação 1",
        body: "Deseja Independência – Liberdade, liderança e controle de tudo; viver longe de pressões, ser campeão (ã) absoluto (a), realizar-se em si mesmo (a); ficar longe da mediocridade, fazer fortuna, ser elogiado (a) e atendido (a) pelo mundo; viver longe de detalhes; impor seus padrões pessoais; muito dinamismo e autossuficiência; não ser atrapalhado (a) por ninguém, ficar só.\n\nO Número 1 na Motivação exige que você se situe sempre de forma a ficar na frente dos outros. Tem que ser o (a) primeiro (a) em tudo o que faz. O fato de ser o (a) primeiro (a) o (a) impede, obviamente, de ter muita consideração pelos outros até que suas próprias necessidades sejam satisfeitas. A liderança adquirida em vidas passadas traz agora o desejo de continuar a se empenhar numa consciência mais elevada. Torna-se independente, também, com relação às suas crenças. O desejo por pensamentos livres e independentes continua ocupando o seu anseio mais profundo. Ambicioso (a) e criativo (a), é direto (a) e não gosta de muitos detalhes, quer liderar, dirigir, dominar; às vezes é obstinado (a). Não gosta muito de receber ordens de quem quer que seja e trabalha melhor por conta própria ou em cargo de chefia. A incompreensão e a recusa em aceitar conselhos podem trazer transtornos à sua carreira e aos seus planos profissionais. Se não tiver bom nível de consciência espiritual, poderá se tornar egoísta, excessivamente vaidoso (a) e arrogante. Geralmente é impaciente e com pouco senso diplomático. Por esse motivo poderá enfrentar dificuldades no seu meio profissional ou mesmo entre familiares, amigos e companheiros afetivos. Suas boas qualidades são: confiança em si, distinção, poder executivo, dignidade e foco nos propósitos.\n\nQuando inseguro (a) tende a ameaçar os outros, podendo agredir, ofender, se tornar inflexível, irredutível, vingativo (a) e preconceituoso (a). Cultura, educação e refinamento pessoal são características indispensáveis que precisa adquir para o seu triunfo pessoal, profissional e principalmente afetivo."
      },
      {
        section: "Motivacao",
        key_number: 2,
        title: "Motivação 2",
        body: "Deseja Paz e Equilíbrio – Prestar serviço e devoção; criar harmonia, sentir o ritmo da vida, trabalhar com os outros, ter amigos leais e boas companhias; acumular conhecimentos e coisas; conforto sem supérfluos; ser amado (a) por todos, receber convites, sentir-se compreendido (a); vencer todas as negociações; não ser exposto (a).\n\nO Número 2 na Motivação faz com que você seja uma pessoa reservada e diplomática. Tem, naturalmente, o dom da cooperação e da parceria. Gosta de trabalhar em equipe e raramente impõe as suas ideias aos outros. Prefere sugerir e negociar. Tem paciência com os detalhes e é uma pessoa muito dedicada e fiel aos seus compromissos. É receptivo (a) às ideias dos outros e trabalha melhor quando tem um (a) companheiro (a) ou sócio (a). O senso de justiça e equilíbrio é muito acentuado. Gosta de colecionar e tem facilidade para reunir pessoas, coisas, dados ou informações. Tem tendências artísticas e aprecia a beleza em todas as suas formas. É muito sensível e consegue sentir perfeitamente o estado emocional das pessoas ao seu redor. Isso faz com que seja prestativo (a) e sempre disposto (a) a ajudar aqueles que estão passando por alguma dificuldade. Tem forte intuição e às vezes até poderes mediúnicos. Por ser muito sensível poderá, quando não equilibrado (a), se tornar depressivo (a), manhoso (a), dissimulado (a), tímido (a) e medroso (a). A timidez excessiva pode impedir que desenvolva o seu potencial e que conquiste aquilo que deseja. Suas boas qualidades são: tato, diplomacia, paciência, lealdade e capacidade de cooperação."
      },
      {
        section: "Motivacao", 
        key_number: 22,
        title: "Motivação 22",
        body: "O Número 22 na Motivação é um número master que combina a intuição do 2 com o poder material do 4. Você deseja construir algo duradouro e de grande alcance que beneficie a humanidade. Tem uma visão ampla e prática, conseguindo transformar sonhos em realidade através de trabalho sistemático e organizado. Possui habilidades especiais para liderar grandes projetos e inspirar outras pessoas. Seu desejo mais profundo é deixar um legado positivo e duradouro no mundo. Tem potencial para ser um grande líder espiritual ou material, capaz de unir pessoas em torno de ideais elevados. A energia do 22 na motivação traz tanto oportunidades quanto responsabilidades especiais. Você pode sentir uma pressão interna para realizar algo grandioso, mas também tem as ferramentas necessárias para fazê-lo. É importante manter os pés no chão e não se deixar levar por ambições desmedidas. O equilíbrio entre o idealismo e a praticidade é fundamental para o sucesso."
      },
      {
        section: "Impressao",
        key_number: 7,
        title: "Impressão 7",
        body: "Impressiona pela Sabedoria – Você impressiona as pessoas pela sua sabedoria, conhecimento e capacidade de análise profunda. Tem um ar misterioso e reservado que desperta a curiosidade dos outros. As pessoas o veem como alguém intelectual, introspectivo e espiritualizado. Sua capacidade de penetrar nos mistérios da vida e de compreender questões complexas impressiona profundamente aqueles que o conhecem.\n\nO Número 7 na Impressão faz com que você seja visto como uma pessoa sábia, estudiosa e com grande conhecimento. As pessoas percebem em você uma capacidade especial para entender questões profundas e complexas. Você transmite uma impressão de seriedade, dignidade e espiritualidade. Há algo de misterioso em sua personalidade que atrai e intriga os outros. Geralmente é visto como alguém diferenciado, único e com talentos especiais. Sua busca constante pelo conhecimento e pela verdade é notada por todos à sua volta. Você impressiona pela qualidade de seus pensamentos e pela profundidade de suas reflexões. As pessoas o procuram quando precisam de conselhos sábios ou quando enfrentam questões complexas da vida."
      },
      {
        section: "Expressao",
        key_number: 11,
        title: "Expressão 11",
        body: "O Número 11 na Expressão é um número master que representa inspiração, intuição e iluminação espiritual. Você possui habilidades psíquicas desenvolvidas e uma sensibilidade especial para captar energias sutis. Sua expressão natural é através da inspiração e da transmissão de conhecimentos elevados. Tem o dom de inspirar e elevar as pessoas ao seu redor.\n\nComo um 11, você é altamente intuitivo e possui uma conexão natural com planos superiores de consciência. Sua expressão é marcada pela originalidade, criatividade e capacidade de trazer novas ideias para o mundo. Você funciona melhor quando pode seguir sua intuição e expressar suas percepções únicas. Tem potencial para ser um líder espiritual, inventor, artista ou trabalhador humanitário. Sua energia é magnética e inspiradora, atraindo pessoas que buscam crescimento espiritual e pessoal.\n\nO desafio do 11 é aprender a equilibrar a alta sensibilidade com a necessidade de viver no mundo prático. Você pode sentir-se incompreendido ou fora do lugar em ambientes muito materialistas. É importante desenvolver práticas que o ajudem a manter o equilíbrio emocional e energético. Quando bem direcionada, sua energia do 11 pode trazer grandes contribuições para o mundo através de sua visão inspirada e capacidade de transformação."
      },
      {
        section: "Destino",
        key_number: 7,
        title: "Destino 7", 
        body: "O Número 7 no Destino indica que seu propósito de vida está relacionado à busca da sabedoria, conhecimento e desenvolvimento espiritual. Você veio a esta vida para aprender, estudar, pesquisar e desenvolver sua intuição e capacidades psíquicas. Seu destino é tornar-se um especialista em alguma área do conhecimento, seja científico, espiritual, filosófico ou técnico.\n\nCom o Destino 7, você é naturalmente introspectivo e precisa de tempo sozinho para processar suas experiências e desenvolver sua compreensão interior. Sua jornada de vida envolve questionar, analisar e buscar respostas para os mistérios da existência. Você tem uma necessidade profunda de compreender o 'porquê' das coisas e não se satisfaz com explicações superficiais.\n\nSeu caminho pode levá-lo a se tornar um pesquisador, professor, escritor, terapeuta, conselheiro espiritual ou especialista técnico. O importante é que você possa usar suas habilidades analíticas e intuitivas para contribuir com conhecimento valioso para o mundo. Você tem o dom de penetrar em questões complexas e encontrar soluções inovadoras.\n\nOs desafios do Destino 7 incluem a tendência ao isolamento excessivo, pessimismo e dificuldade em se relacionar com pessoas menos intelectuais. É importante equilibrar sua necessidade de solidão com conexões humanas significativas."
      },
      {
        section: "Destino",
        key_number: 9,
        title: "Destino 9",
        body: "O Número 9 no Destino representa o final de um ciclo e indica que você veio a esta vida para servir a humanidade de forma ampla e generosa. Seu propósito é desenvolver uma consciência universal e usar seus talentos para o bem comum. Você está aqui para ser um líder humanitário, um curador ou um professor da humanidade.\n\nCom o Destino 9, você possui uma natureza compassiva e generosa, com forte senso de justiça e desejo de ajudar os outros. Sua missão envolve transcender interesses pessoais e trabalhar para causas maiores que beneficiem a coletividade. Você tem o potencial de se tornar um líder inspirador que motiva outros a serem melhores.\n\nSeu caminho de vida pode levá-lo a trabalhar em áreas como educação, saúde, assistência social, artes, espiritualidade ou qualquer campo onde possa expressar sua natureza altruísta. Você tem talentos naturais para inspirar, curar e ensinar. Sua energia magnética atrai pessoas que buscam orientação e inspiração.\n\nO Destino 9 também indica que você está completando lições importantes nesta vida e se preparando para um novo ciclo de evolução espiritual. Isso pode trazer situações de término e recomeço, exigindo que você aprenda a soltar o passado e abraçar novas possibilidades.\n\nOs desafios incluem a tendência ao sacrifício excessivo, dificuldade em receber (apenas dar), e possível amargura se seus esforços altruístas não forem reconhecidos. É importante aprender a cuidar de si mesmo enquanto serve aos outros."
      }
    ];

    // Insert content into numerology_texts table
    for (const content of numerologyContent) {
      const { error: insertError } = await supabase
        .from('numerology_texts')
        .upsert({
          section: content.section,
          key_number: content.key_number,
          title: content.title,
          body: content.body,
          lang: 'pt-BR',
          version: 'v3.1',
          category: 'main',
          priority: 1,
          content_length: content.body.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section,key_number'
        });

      if (insertError) {
        console.error(`Erro ao inserir ${content.section} ${content.key_number}:`, insertError);
      } else {
        console.log(`✅ Inserido: ${content.title}`);
      }
    }

    console.log('✨ Conteúdo do PDF populado com sucesso!');

    return new Response(
      JSON.stringify({ 
        message: 'Conteúdo do PDF populado com sucesso',
        inserted: numerologyContent.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro ao popular conteúdo do PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});