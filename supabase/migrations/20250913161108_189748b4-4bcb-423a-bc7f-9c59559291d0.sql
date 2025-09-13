-- Popular banco de dados com conteúdo detalhado (atualizando existentes e inserindo novos)

-- Atualizar textos existentes e inserir novos para todos os números específicos

-- Expressão 11
INSERT INTO numerology_texts (
  section, key_number, title, body, is_master_number, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects,
  career_guidance, relationship_advice, health_recommendations
) VALUES 
('expressao', 11, 'Expressão 11 - O Inspirador Visionário', 
'Sua expressão no mundo é marcada pela poderosa vibração do número mestre 11, que representa a inspiração divina e a capacidade de iluminar caminhos para outros. Você possui uma sensibilidade extraordinária que funciona como um radar espiritual, captando energias, intuições e verdades que escapam à percepção comum.

Como um 11 na expressão, você é naturalmente um canal de luz e sabedoria. Sua presença tem o poder de despertar consciências, inspirar transformações e elevar o nível vibracional dos ambientes onde você atua. Existe em você uma qualidade quase mediúnica que permite acessar informações além do plano físico.

Sua forma de se expressar carrega uma intensidade única - quando você fala, as pessoas sentem que há algo especial em suas palavras. Você não apenas comunica ideias, mas transmite energia, emoção e uma sabedoria que toca a alma dos ouvintes. Esta é sua marca registrada no mundo.', 
true, 'main', 'pt-BR',
'Desenvolva suas habilidades intuitivas através de meditação, práticas espirituais e momentos regulares de silêncio. Sua sensibilidade é um dom que precisa ser cultivado conscientemente.',
'Você pode se sentir sobrecarregado pela intensidade de suas percepções. É importante aprender a criar filtros energéticos e estabelecer limites saudáveis para proteger sua sensibilidade.',
'Você está aqui para ser um farol de luz no mundo. Sua missão espiritual envolve despertar consciências e ajudar outros a encontrarem seu próprio caminho de iluminação.',
'Profissões ideais incluem ensino espiritual, terapia holística, arte inspiradora, consultoria intuitiva, liderança visionária ou qualquer área onde sua inspiração possa beneficiar outros.',
'Nos relacionamentos, você busca conexões profundas e significativas. Precisa de parceiros que compreendam e valorizem sua natureza sensível e espiritualizada.',
'Sua alta sensibilidade pode afetar o sistema nervoso. Pratique técnicas de grounding, passe tempo na natureza e mantenha uma rotina equilibrada para preservar seu bem-estar.')
ON CONFLICT (section, key_number) DO UPDATE SET
  body = EXCLUDED.body,
  practical_guidance = EXCLUDED.practical_guidance,
  psychological_analysis = EXCLUDED.psychological_analysis,
  spiritual_aspects = EXCLUDED.spiritual_aspects,
  career_guidance = EXCLUDED.career_guidance,
  relationship_advice = EXCLUDED.relationship_advice,
  health_recommendations = EXCLUDED.health_recommendations,
  updated_at = now();

-- Destino 9
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects,
  career_guidance, relationship_advice
) VALUES 
('destino', 9, 'Destino 9 - O Humanitário Universal', 
'Seu destino está intrinsecamente ligado ao serviço altruísta e à elevação da consciência humana. O número 9 representa a culminação de um ciclo evolutivo, onde a alma amadureceu através de múltiplas experiências e agora está pronta para doar seus dons em benefício da coletividade.

Você nasceu com uma missão de vida que transcende interesses pessoais. Sua realização verdadeira vem quando você consegue contribuir significativamente para o bem-estar, crescimento e evolução de outras pessoas. É como se você fosse um guardião da sabedoria humana, destinado a compartilhar conhecimentos e experiências que possam elevar o nível de consciência ao seu redor.

Sua jornada de vida envolve aprender a equilibrar suas necessidades pessoais com sua vocação natural para servir. Você é chamado a ser um exemplo vivo de compaixão, sabedoria e generosidade espiritual.', 
'main', 'pt-BR',
'Identifique formas práticas de servir à comunidade que estejam alinhadas com seus talentos naturais. Seu destino se manifesta através do serviço consciente e amoroso.',
'Você pode lutar com questões de auto-valor, sentindo que deve sempre colocar os outros em primeiro lugar. Aprenda que cuidar de si mesmo é essencial para poder servir efetivamente.',
'Seu destino espiritual é tornar-se um canal de amor universal. Você está aqui para demonstrar que é possível viver com compaixão genuína e fazer diferença no mundo.',
'Carreiras em educação, saúde, trabalho social, artes healing, liderança espiritual, ONGs ou qualquer área focada no bem-estar coletivo.',
'Você atrai relacionamentos onde pode oferecer orientação e apoio. Busque parceiros que compreendam sua natureza generosa e não explorem sua tendência natural a dar.')
ON CONFLICT (section, key_number) DO UPDATE SET
  body = EXCLUDED.body,
  practical_guidance = EXCLUDED.practical_guidance,
  psychological_analysis = EXCLUDED.psychological_analysis,
  spiritual_aspects = EXCLUDED.spiritual_aspects,
  career_guidance = EXCLUDED.career_guidance,
  relationship_advice = EXCLUDED.relationship_advice,
  updated_at = now();

-- Missão 2
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects
) VALUES 
('missao', 2, 'Missão 2 - O Cooperador Harmonizador', 
'Sua missão de vida é ser um agente de harmonia, cooperação e equilíbrio no mundo. O número 2 representa a diplomacia, a sensibilidade emocional e a capacidade extraordinária de compreender diferentes perspectivas e encontrar pontos de união entre pessoas e situações aparentemente opostas.

Você está aqui para demonstrar que a verdadeira força reside na suavidade, na paciência e na capacidade de trabalhar em equipe. Sua missão envolve curar divisões, mediar conflitos e criar pontes de entendimento entre pessoas, grupos ou ideias que parecem incompatíveis.

Como um 2, você possui o dom natural da empatia e da intuição emocional. Sua missão é usar essas qualidades para trazer mais paz, compreensão e colaboração para os ambientes onde você atua. Você é um unificador nato, destinado a mostrar que juntos somos sempre mais fortes.', 
'main', 'pt-BR',
'Desenvolva suas habilidades de mediação e comunicação empática. Busque situações onde você possa facilitar diálogos construtivos e promover entendimento mútuo.',
'Você pode tender a se anular em favor dos outros ou evitar confrontos necessários. Aprenda que estabelecer limites saudáveis é parte essencial de sua missão harmonizadora.',
'Espiritualmente, você está aprendendo que a verdadeira união vem do respeito às diferenças individuais. Sua missão é promover unidade sem uniformidade.')
ON CONFLICT (section, key_number) DO UPDATE SET
  body = EXCLUDED.body,
  practical_guidance = EXCLUDED.practical_guidance,
  psychological_analysis = EXCLUDED.psychological_analysis,  
  spiritual_aspects = EXCLUDED.spiritual_aspects,
  updated_at = now();