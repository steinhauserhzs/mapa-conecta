-- Corrigir e popular dados completos para numerologia
-- Inserir textos detalhados para todos os números específicos do caso de referência

-- Primeiro, inserir textos para Motivação 22
INSERT INTO numerology_texts (
  section, 
  key_number, 
  title, 
  body, 
  is_master_number,
  category,
  lang,
  practical_guidance,
  psychological_analysis,
  spiritual_aspects,
  career_guidance,
  relationship_advice,
  health_recommendations,
  karmic_lessons_detail,
  growth_opportunities,
  shadow_aspects,
  affirmations,
  recommendations
) VALUES 
('motivacao', 22, 'Motivação 22 - O Mestre Construtor', 
'Sua motivação interior é governada pelo poderoso número mestre 22, conhecido como "O Mestre Construtor". Este número representa a capacidade extraordinária de transformar sonhos e visões em realidade tangível no mundo físico. Você carrega dentro de si uma força motivacional única, direcionada para construir algo duradouro e significativo que beneficie não apenas você, mas toda a humanidade.

A essência da sua motivação está em ser um arquiteto da mudança positiva. Você sente-se impulsionado por uma necessidade profunda de criar sistemas, estruturas ou conceitos que possam perdurar através do tempo. Sua visão vai muito além do imediato - você pensa em legados, em impacto geracional, em transformações que ecoarão através das décadas.

Esta motivação mestre traz consigo uma responsabilidade especial. Você não se contenta com pequenas conquistas ou sucessos superficiais. Sua alma clama por realizações que tenham peso, substância e significado profundo. É como se você fosse um canal entre o mundo espiritual das ideias e o mundo material das manifestações.', 
true, 'main', 'pt-BR',
'Para canalizar esta poderosa motivação, estabeleça metas grandiosas mas divida-as em etapas alcançáveis. Sua visão ampla precisa ser equilibrada com planejamento detalhado e ação consistente. Busque projetos que combinem inovação com praticidade.',
'Psicologicamente, você pode alternar entre momentos de intensa inspiração e períodos de dúvida sobre sua capacidade de concretizar visões tão grandiosas. Aceite esta dualidade como parte natural do processo de um Mestre Construtor.',
'Espiritualmente, você está aqui para ser uma ponte entre mundos - o espiritual e o material. Sua missão envolve trazer luz e sabedoria superior para formas práticas que possam ajudar a evolução coletiva.',
'Sua carreira ideal envolve liderança visionária, arquitetura (literal ou metafórica), desenvolvimento de sistemas, consultoria estratégica, ou qualquer área onde você possa construir algo duradouro e impactante.',
'Nos relacionamentos, você busca parceiros que compartilhem suas visões elevadas ou que possam apoiar seus grandes projetos. Precisa de pessoas que compreendam sua necessidade de tempo para contemplação e planejamento.',
'Cuide especialmente do sistema nervoso, que pode ficar sobrecarregado pela intensidade de suas visões. Práticas de grounding como caminhadas na natureza, meditação e exercícios físicos são essenciais.',
'Sua lição cármica principal é aprender a equilibrar ambição espiritual com humildade terrena, transformando grandes visões em realidades tangíveis sem perder a essência espiritual do propósito.',
'Oportunidades de crescimento surgem quando você aceita projetos desafiadores que exigem tanto visão quanto execução prática. Trabalhe em equipe - seus sonhos precisam de muitas mãos para se materializarem.',
'Cuidado com a tendência ao perfeccionismo paralisante ou à frustração quando a realidade não corresponde imediatamente à sua visão. A paciência é sua aliada mais valiosa.',
'"Eu sou um canal de manifestação divina. Minhas visões se transformam em realidade através de ação consciente e perseverante. Construo pontes entre o céu e a terra."',
'Desenvolva projetos de longo prazo, cultive redes de contatos estratégicos, mantenha equilíbrio entre contemplação e ação, e lembre-se sempre de que sua motivação é um dom sagrado para servir ao bem maior.');

-- Inserir textos para Impressão 7
INSERT INTO numerology_texts (
  section, 
  key_number, 
  title, 
  body, 
  category,
  lang,
  practical_guidance,
  psychological_analysis,
  spiritual_aspects,
  career_guidance,
  relationship_advice,
  health_recommendations
) VALUES 
('impressao', 7, 'Impressão 7 - O Místico Sábio', 
'A primeira impressão que você causa nas pessoas é de alguém profundo, misterioso e intelectualmente sofisticado. O número 7 na impressão confere uma aura de sabedoria e espiritualidade que naturalmente atrai aqueles que buscam significado mais profundo na vida.

As pessoas percebem em você uma qualidade quase mágica - como se você possuísse conhecimentos ocultos ou uma conexão especial com dimensões superiores da existência. Sua presença transmite calma contemplativa e uma sabedoria que vai além da idade ou experiência aparente.

Outros notam que você não se deixa levar por superficialidades ou tendências passageiras. Há uma qualidade atemporal em sua maneira de ser que faz as pessoas sentirem que estão na presença de alguém especial, alguém que vê além das aparências e compreende as camadas mais profundas da vida.', 
'main', 'pt-BR',
'Cultive intencionalmente esta impressão de profundidade através do conhecimento contínuo, da reflexão consciente e da presença mindful. Sua aura natural de mistério é um dom - use-a com sabedoria.',
'Você pode não perceber quão impactante é sua presença. Outros frequentemente o veem como mais sábio e espiritualmente avançado do que você mesmo se sente. Aceite esta percepção como reflexo de sua verdadeira natureza.',
'Sua impressão espiritual é um reflexo da sabedoria da alma. Você naturalmente inspira outros a buscarem verdades mais profundas e a questionarem o status quo superficial.',
'Profissões que valorizam sabedoria, análise profunda, pesquisa, consultoria espiritual, psicologia, ou qualquer área onde sua presença contemplativa seja um diferencial.',
'Nas primeiras impressões amorosas, você atrai pessoas que buscam profundidade emocional e conexão espiritual. Sua aura misteriosa é magnética para almas sensíveis.',
'Sua impressão de serenidade pode mascarar tensões internas. Pratique técnicas de relaxamento e mantenha conexão regular com a natureza para sustentar sua aura de paz.');

-- Continuar com mais inserções de conteúdo...