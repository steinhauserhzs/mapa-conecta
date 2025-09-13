-- Popular conteúdo detalhado para todos os números específicos
-- Usando UPDATE para não duplicar dados existentes

-- Atualizar/Inserir Expressão 11
INSERT INTO numerology_texts (
  section, key_number, title, body, is_master_number, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects, 
  career_guidance, relationship_advice, health_recommendations
) VALUES (
'expressao', 11, 'Expressão 11 - O Mensageiro Iluminado',
'Sua expressão no mundo é governada pelo poderoso número mestre 11, que o coloca na posição de um verdadeiro mensageiro da luz. Este número representa a capacidade excepcional de servir como ponte entre o mundo material e as dimensões superiores da consciência.

Você possui um talento natural para inspirar, iluminar e elevar os outros através de suas palavras, ações e presença. Sua expressão carrega uma qualidade quase magnética que atrai pessoas em busca de orientação espiritual, sabedoria profunda ou simplesmente uma conexão mais significativa com a vida.

Como um 11 na expressão, você é dotado de uma sensibilidade psíquica aguçada e uma intuição que frequentemente surpreende pela sua precisão. Sua maneira de se comunicar e interagir com o mundo carrega uma vibração elevada que pode transformar ambientes e tocar corações de forma profunda.',
true, 'main', 'pt-BR',
'Canalize sua expressão através da comunicação inspiradora, arte, escrita, ensino ou qualquer forma de transmitir luz e sabedoria. Sua presença tem poder de cura - use-a conscientemente.',
'Você pode sentir-se sobrecarregado pela intensidade de sua própria sensibilidade. É importante criar momentos de retiro e silêncio para equilibrar sua energia receptiva com sua expressão no mundo.',
'Sua expressão é um canal direto de luz divina. Você está aqui para ser um farol de esperança e iluminação em um mundo que muitas vezes esquece sua natureza espiritual.',
'Profissões ideais incluem psicologia, terapias alternativas, consultoria espiritual, arte, música, escrita, ensino ou liderança inspiracional em qualquer área.',
'Nos relacionamentos, você busca conexões profundas e significativas. Sua expressão sensível atrai pessoas que reconhecem e valorizam sua natureza espiritual.',
'Sua sensibilidade elevada requer cuidados especiais. Pratique técnicas de proteção energética, meditação regular e mantenha ambientes harmoniosos.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects,
career_guidance = EXCLUDED.career_guidance,
relationship_advice = EXCLUDED.relationship_advice,
health_recommendations = EXCLUDED.health_recommendations;

-- Atualizar/Inserir Destino 9
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects,
  career_guidance, relationship_advice, health_recommendations
) VALUES (
'destino', 9, 'Destino 9 - O Humanitário Universal',
'Seu caminho de vida é marcado pela missão nobre de servir à humanidade. O número 9 representa a culminação da sabedoria adquirida através de todas as experiências numéricas anteriores, tornando você um ser naturalmente compassivo, generoso e voltado para o bem comum.

Você veio a este mundo para contribuir de forma significativa para a evolução coletiva. Seu destino envolve usar sua sabedoria, experiência e recursos para ajudar outros a crescerem, curarem-se e encontrarem seu próprio caminho. É um caminho de doação, serviço e amor incondicional.

Ao longo de sua jornada, você será testado em sua capacidade de perdoar, de se desprender do ego pessoal e de abraçar uma perspectiva mais ampla e universal. Seu maior crescimento vem quando você consegue transformar experiências pessoais difíceis em sabedoria que pode ser compartilhada para o benefício de todos.',
'main', 'pt-BR',
'Busque maneiras de servir que se alinhem com seus talentos naturais. Desenvolva projetos que tenham impacto social positivo. Pratique o desapego material - sua riqueza verdadeira está na diferença que você faz na vida dos outros.',
'Você pode lutar com sentimentos de isolamento ou incompreensão, especialmente quando sua natureza generosa é mal interpretada. Aprenda a estabelecer limites saudáveis sem perder sua compaixão natural.',
'Espiritualmente, você está completando um ciclo importante de aprendizado. Seu destino é transformar-se em um sábio que guia outros através das complexidades da existência humana.',
'Carreiras ideais incluem trabalho social, psicologia, medicina, educação, artes que inspirem, liderança em organizações beneficentes, ou qualquer área que permita ajudar diretamente a humanidade.',
'Nos relacionamentos, você tende a assumir o papel de conselheiro e curador. Busque parceiros que apreciem sua natureza doadora mas que também possam nutrir você emocionalmente.',
'Sua tendência de dar demais pode levar ao esgotamento emocional e físico. É essencial que você aprenda a cuidar de si mesmo com a mesma dedicação que cuida dos outros.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects,
career_guidance = EXCLUDED.career_guidance,
relationship_advice = EXCLUDED.relationship_advice,
health_recommendations = EXCLUDED.health_recommendations;