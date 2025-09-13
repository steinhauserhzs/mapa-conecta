-- Continuar populando conteúdo detalhado
-- Inserir conteúdo para Lições Cármicas 9
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects,
  karmic_lessons_detail, growth_opportunities, shadow_aspects
) VALUES (
'licoes_carmicas', 9, 'Lições Cármicas 9 - Aprendendo a Servir',
'A ausência do número 9 em seu nome revela uma importante lição cármica relacionada ao desenvolvimento da compaixão universal, do desapego ao ego pessoal e da capacidade de servir ao bem maior da humanidade.

Esta lição indica que em vidas passadas você pode ter sido excessivamente focado em interesses pessoais, negligenciando as necessidades dos outros ou usando seu poder e recursos apenas para benefício próprio. Agora, sua alma precisa aprender o verdadeiro significado do amor incondicional e do serviço altruísta.

O número 9 representa a culminação da sabedoria humana e a capacidade de ver além das diferenças superficiais para reconhecer a unidade fundamental de toda vida. Sua lição cármica é desenvolver esta visão expandida e aprender a dar sem esperar retorno.',
'main', 'pt-BR',
'Busque oportunidades de voluntariado e serviço comunitário. Pratique atos de bondade aleatórios sem esperar reconhecimento. Desenvolva sua capacidade de perdoar e de ver o melhor nas pessoas, mesmo quando elas o decepcionam.',
'Você pode resistir inicialmente ao chamado para servir, sentindo que está sendo usado ou não reconhecido adequadamente. Esta resistência é parte natural do processo de aprendizado - transforme-a em sabedoria.',
'Espiritualmente, esta lição o conecta com a verdade de que todos somos um. Ao servir outros, você está realmente servindo aspectos de si mesmo e contribuindo para a evolução coletiva da consciência.',
'Esta lição cármica ensina que a verdadeira realização vem não do que você recebe, mas do que você dá. Você está aprendendo a encontrar propósito através da contribuição para algo maior que você mesmo.',
'Oportunidades de crescimento surgem sempre que você escolhe o bem coletivo sobre o benefício pessoal, quando perdoa ao invés de guardar rancor, e quando oferece ajuda sem ser solicitado.',
'O aspecto sombra desta lição pode manifestar-se como martírio excessivo, tendência a dar até o esgotamento, ou desenvolvimento de complexo de superioridade em relação àqueles que você serve.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects,
karmic_lessons_detail = EXCLUDED.karmic_lessons_detail,
growth_opportunities = EXCLUDED.growth_opportunities,
shadow_aspects = EXCLUDED.shadow_aspects;

-- Inserir conteúdo para Dívidas Cármicas 13
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects,
  karmic_lessons_detail, growth_opportunities, shadow_aspects
) VALUES (
'dividas_carmicas', 13, 'Dívida Cármica 13 - Transformação Através do Trabalho',
'A presença da dívida cármica 13 em seu mapa indica que em vidas passadas você pode ter abusado do poder, sido preguiçoso ou negligente com suas responsabilidades, ou usado atalhos desonestos para alcançar objetivos. Agora, sua alma precisa aprender o valor do trabalho honesto e da perseverança.

O número 13 combina a individualidade do 1 com a criatividade do 3, mas sua manifestação cármica exige que você transforme tendências destrutivas em força construtiva através do esforço dedicado e da integridade moral.

Esta dívida cármica não é uma punição, mas uma oportunidade de ouro para desenvolver disciplina, responsabilidade e uma ética de trabalho sólida. Você tem o potencial de transformar qualquer situação através de determinação persistente e ação positiva.',
'main', 'pt-BR',
'Aceite o trabalho duro como uma forma de purificação. Estabeleça rotinas disciplinadas e cumpra-as religiosamente. Evite atalhos duvidosos - sempre escolha o caminho mais íntegro, mesmo que seja mais difícil.',
'Você pode sentir que precisa trabalhar mais que outros para alcançar os mesmos resultados. Esta percepção é correta e faz parte de sua jornada de aprendizado. Veja isto como desenvolvimento de caráter, não como injustiça.',
'Espiritualmente, esta dívida cármica ensina que não há atalhos para o crescimento genuíno. Cada desafio superado através do esforço honesto fortalece sua alma e aumenta sua capacidade de servir aos outros.',
'A lição principal é que o valor real de qualquer conquista não está no resultado final, mas na pessoa que você se torna através do processo de alcançá-la.',
'Cada obstáculo superado através do trabalho dedicado libera energia cármica e o aproxima de sua verdadeira natureza espiritual. Use os desafios como combustível para o crescimento.',
'Cuidado com a tendência à autocomiseração ou ao ressentimento por ter que trabalhar mais que outros. Estes sentimentos apenas perpetuam o ciclo cármico que você está tentando quebrar.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects,
karmic_lessons_detail = EXCLUDED.karmic_lessons_detail,
growth_opportunities = EXCLUDED.growth_opportunities,
shadow_aspects = EXCLUDED.shadow_aspects;