-- Continuar populando conteúdo detalhado para os números específicos

-- Inserir/Atualizar Missão 2
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects,
  career_guidance, relationship_advice, health_recommendations
) VALUES (
'missao', 2, 'Missão 2 - O Diplomata Harmonizador',
'Sua missão de vida está centrada na arte da cooperação, diplomacia e construção de pontes entre pessoas, ideias e mundos aparentemente opostos. O número 2 na missão revela que você veio a este mundo para ser um agente de paz, harmonia e união.

Sua tarefa especial é ensinar aos outros o valor da colaboração sobre a competição, da sensibilidade sobre a agressividade, e da paciência sobre a pressa. Você possui uma habilidade natural para ver todos os lados de uma situação e encontrar terreno comum onde outros veem apenas divisão.

A essência de sua missão está em compreender que o verdadeiro poder não vem do domínio, mas da habilidade de unir forças diferentes para criar algo maior que a soma das partes. Você é um curador de relacionamentos, um mediador nato e um construtor de consensos.',
'main', 'pt-BR',
'Desenvolve suas habilidades de mediação, escuta ativa e comunicação empática. Busque situações onde possa facilitar a colaboração entre pessoas ou grupos diversos. Sua missão se cumpre através de atos de service gentil e apoio incondicional.',
'Você pode sentir-se invisível ou subestimado em um mundo que valoriza liderança extrovertida. Lembre-se que sua força está na influência sutil e no poder transformador da gentileza genuína.',
'Espiritualmente, você está aqui para demonstrar que a verdadeira força espiritual reside na capacidade de amar incondicionalmente e de ver a unidade subjacente em toda aparente dualidade.',
'Profissões ideais incluem mediação, aconselhamento, diplomacia, trabalho em equipe, recursos humanos, terapias de casal, ou qualquer área que requeira habilidades interpessoais refinadas.',
'Sua missão nos relacionamentos é criar conexões profundas e duradouras. Você ensina pelo exemplo como o amor verdadeiro é construído através de compreensão mútua, paciência e apoio incondicional.',
'Sua sensibilidade elevada pode torná-lo vulnerável ao estresse emocional dos outros. É crucial que aprenda técnicas de proteção energética e mantenha limites saudáveis para preservar seu bem-estar.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects,
career_guidance = EXCLUDED.career_guidance,
relationship_advice = EXCLUDED.relationship_advice,
health_recommendations = EXCLUDED.health_recommendations;

-- Inserir/Atualizar informações do Anjo Nanael
INSERT INTO cabalistic_angels (
  name, category, domain_description, complete_prayer, detailed_invocation,
  invocation_time_1, invocation_time_2, psalm_reference, biblical_references,
  historical_accounts, manifestation_areas, healing_specialties, protection_methods,
  signs_presence, communication_methods, miracle_stories, planetary_hours,
  lunar_timing, crystal_associations, color_correspondences, incense_oils,
  offering_suggestions, ritual_instructions, sacred_geometry, gratitude_practices,
  integration_daily_life, negative_influence
) VALUES (
'Nanael', 'Anjo Serafim', 
'Nanael é o anjo da comunicação divina, da sabedoria espiritual e da elevação da consciência. Ele governa a transmissão de conhecimento sagrado e ajuda na compreensão de verdades superiores.',
'Ó Santo Anjo Nanael, mensageiro da luz divina, venho a ti com humildade e reverência. Peço que ilumines minha mente com sabedoria celestial e abras meu coração para receber os ensinamentos sagrados. Guia-me na jornada do conhecimento espiritual e ajuda-me a compartilhar essa luz com todos que cruzarem meu caminho. Que tua presença luminosa dissolva toda ignorância e me conduza sempre pela senda da verdade. Assim seja, com gratidão infinita.',
'Nanael, anjo da sabedoria divina, invoco tua presença sagrada neste momento. Tu que guardas os segredos do conhecimento celestial, concede-me a clareza mental necessária para compreender os mistérios da vida. Ajuda-me a ser um canal de luz e sabedoria, transmitindo apenas aquilo que serve ao bem maior de todos. Protege-me de toda ilusão e me mantém sempre alinhado com a verdade suprema.',
'Das 20h às 20h20', 'Das 8h às 8h20',
'Salmo 119:75 - "Conheço, Senhor, que os teus juízos são justos e que com fidelidade me afligiste."',
'Mencionado nos textos cabalísticos como um dos 72 anjos que carregam o nome divino, Nanael está associado à transmissão de conhecimento sagrado e à elevação espiritual.',
'Segundo a tradição cabalística, Nanael apareceu a vários místicos e estudiosos, concedendo-lhes insights profundos sobre os mistérios divinos. Relatos históricos o descrevem como um anjo de grande sabedoria que ajuda na interpretação de textos sagrados.',
ARRAY['Comunicação divina', 'Sabedoria espiritual', 'Clareza mental', 'Compreensão de textos sagrados', 'Elevação da consciência'],
ARRAY['Cura de bloqueios mentais', 'Tratamento de confusão espiritual', 'Harmonização dos chakras superiores', 'Cura de traumas relacionados ao aprendizado'],
'Nanael protege contra a ignorância espiritual, as ilusões mentais e os falsos ensinamentos. Ele cria um escudo de luz dourada ao redor daqueles que buscam sinceramente a verdade.',
ARRAY['Sensação de clareza mental súbita', 'Insights espirituais inesperados', 'Sonhos vívidos com mensagens', 'Sincronicidades relacionadas ao aprendizado', 'Presença de luz dourada'],
ARRAY['Meditação contemplativa', 'Estudo de textos sagrados', 'Escrita inspirada', 'Diálogo interior', 'Sinais através de livros e ensinamentos'],
'Relatos incluem estudantes que súbitamente compreenderam conceitos difíceis após invocar Nanael, escritores que receberam inspiração divina, e buscadores espirituais que tiveram experiências místicas profundas.',
'Horário de Mercúrio: Quarta-feira das 20h às 21h, especialmente poderoso durante a lua crescente.',
'Luna crescente é ideal para invocar Nanael, especialmente quando a lua está em signos de ar (Gêmeos, Libra, Aquário).',
ARRAY['Sodalita', 'Lápis-lazúli', 'Cristal de quartzo', 'Ametista', 'Fluorita'],
ARRAY['Dourado', 'Azul celeste', 'Branco puro', 'Violeta suave'],
ARRAY['Sândalo', 'Olíbano', 'Óleo de eucalipto', 'Essência de lavanda'],
ARRAY['Velas douradas', 'Flores brancas', 'Água pura', 'Livros sagrados', 'Cristais de quartzo'],
'Acenda uma vela dourada em local silencioso. Coloque um cristal de quartzo à sua frente e abra um livro sagrado. Recite a oração de invocação três vezes, pedindo por sabedoria e clareza. Medite em silêncio por 20 minutos, mantendo-se receptivo a insights.',
'O símbolo sagrado de Nanael é um triângulo dourado com um olho no centro, representando a visão espiritual elevada e a compreensão divina.',
'Agradeça diariamente pelos insights recebidos, mantendo um diário espiritual. Pratique a gratidão antes de estudar textos sagrados ou meditar.',
'Incorpore momentos diários de reflexão silenciosa, estude regularmente textos espirituais, pratique a escuta profunda nas conversas, e mantenha-se sempre aberto ao aprendizado.',
'Nanael adverte contra o orgulho intelectual, a distorção de ensinamentos para benefício próprio, e o uso do conhecimento espiritual para manipular outros. Seu oposto é a ignorância arrogante.'
) ON CONFLICT (name) DO UPDATE SET
domain_description = EXCLUDED.domain_description,
complete_prayer = EXCLUDED.complete_prayer,
detailed_invocation = EXCLUDED.detailed_invocation,
invocation_time_1 = EXCLUDED.invocation_time_1,
invocation_time_2 = EXCLUDED.invocation_time_2,
psalm_reference = EXCLUDED.psalm_reference,
biblical_references = EXCLUDED.biblical_references,
historical_accounts = EXCLUDED.historical_accounts,
manifestation_areas = EXCLUDED.manifestation_areas,
healing_specialties = EXCLUDED.healing_specialties,
protection_methods = EXCLUDED.protection_methods,
signs_presence = EXCLUDED.signs_presence,
communication_methods = EXCLUDED.communication_methods,
miracle_stories = EXCLUDED.miracle_stories,
planetary_hours = EXCLUDED.planetary_hours,
lunar_timing = EXCLUDED.lunar_timing,
crystal_associations = EXCLUDED.crystal_associations,
color_correspondences = EXCLUDED.color_correspondences,
incense_oils = EXCLUDED.incense_oils,
offering_suggestions = EXCLUDED.offering_suggestions,
ritual_instructions = EXCLUDED.ritual_instructions,
sacred_geometry = EXCLUDED.sacred_geometry,
gratitude_practices = EXCLUDED.gratitude_practices,
integration_daily_life = EXCLUDED.integration_daily_life,
negative_influence = EXCLUDED.negative_influence;