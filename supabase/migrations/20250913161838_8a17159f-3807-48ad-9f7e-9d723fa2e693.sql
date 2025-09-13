-- Continuar populando conteúdo detalhado para Tendências Ocultas, Resposta Subconsciente, Ciclos, Desafios e Momentos

-- Inserir Tendências Ocultas 1
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects
) VALUES (
'tendencias_ocultas', 1, 'Tendências Ocultas 1 - Liderança Natural',
'A presença do número 1 como tendência oculta revela uma força interior de liderança, independência e pioneirismo que influencia subconscientemente suas escolhas e reações. Esta energia do 1 atua como um motor interno que o impulsiona a tomar iniciativas, buscar originalidade e assumir posições de destaque.

Mesmo quando você não percebe conscientemente, há uma parte de você que naturalmente assume comando de situações, busca soluções inovadoras e prefere trilhar caminhos próprios ao invés de seguir multidões. Esta tendência oculta o torna uma pessoa que inspira confiança nos outros e atrai oportunidades de liderança.

Esta energia subconsciente do 1 também o protege de se perder em situações onde sua individualidade possa ser comprometida, agindo como uma bússola interna que sempre o orienta de volta ao seu centro pessoal e aos seus valores únicos.',
'main', 'pt-BR',
'Reconheça e cultive conscientemente suas qualidades de liderança. Não tenha medo de assumir iniciativas ou de ser o primeiro a tentar algo novo. Sua tendência oculta do 1 é um dom que deve ser usado para inspirar e guiar outros.',
'Esta tendência pode criar um conflito interno se você conscientemente prefere evitar responsabilidades de liderança. Aceite que liderar é parte de sua natureza essencial, mesmo que você lidere através do exemplo silencioso.',
'Espiritualmente, esta tendência conecta você com a energia primordial da criação - o impulso divino de iniciar, criar e manifestar algo novo no mundo.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects;

-- Inserir Tendências Ocultas 5
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects
) VALUES (
'tendencias_ocultas', 5, 'Tendências Ocultas 5 - Busca da Liberdade',
'O número 5 como tendência oculta revela uma necessidade subconsciente profunda de liberdade, variedade e experiências diversificadas. Esta energia interior o impulsiona constantemente a buscar novos horizontes, quebrar rotinas limitantes e explorar diferentes aspectos da vida.

Mesmo quando sua vida parece estável externamente, há uma parte de você que sempre está planejando a próxima aventura, sonhando com mudanças ou sentindo uma inquietação quando as coisas ficam muito previsíveis. Esta tendência oculta o torna naturalmente curioso, adaptável e resistente a qualquer forma de aprisionamento ou limitação.

Esta energia do 5 também o dota de uma versatilidade natural e uma capacidade de se reinventar conforme necessário, funcionando como uma força que o mantém jovem de espírito e aberto a novas possibilidades.',
'main', 'pt-BR',
'Aceite sua necessidade de variedade e mudança como algo natural e saudável. Planeje regularmente novas experiências, viagens ou aprendizados. Sua tendência oculta do 5 precisa de expressão para que você se sinta verdadeiramente vivo.',
'Você pode sentir-se culpado por sua necessidade de mudança, especialmente se outros dependem de sua estabilidade. Compreenda que sua natureza mutável é um presente que pode trazer renovação e inspiração para sua vida e a dos outros.',
'Espiritualmente, esta tendência conecta você com a energia da transformação constante e do crescimento através da experiência. Você está aqui para explorar a diversidade da criação divina.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects;

-- Inserir Resposta Subconsciente 8
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, spiritual_aspects
) VALUES (
'resposta_subconsciente', 8, 'Resposta Subconsciente 8 - Poder e Controle',
'Sua resposta subconsciente às pressões e crises da vida é governada pela energia do número 8, que se manifestar através de uma busca instintiva por controle, organização e soluções práticas baseadas em poder pessoal e recursos materiais.

Quando confrontado com desafios, você automaticamente ativa sua capacidade de liderança executiva, buscando tomar controle da situação através de planejamento estratégico, mobilização de recursos e implementação de soluções estruturadas. Há uma parte de você que acredita que qualquer problema pode ser resolvido com a aplicação correta de poder, influência e determinação.

Esta resposta subconsciente o torna naturalmente resiliente e capaz de transformar crises em oportunidades de crescimento e fortalecimento. Você instintivamente compreende que o verdadeiro poder vem da capacidade de manter a compostura e agir de forma decisiva mesmo sob pressão.',
'main', 'pt-BR',
'Confie em sua capacidade natural de lidar com crises através da organização e liderança. Quando enfrentar desafios, ative conscientemente seu lado executivo e busque soluções que fortaleçam sua posição e a dos outros.',
'Sua tendência de assumir controle pode ser interpretada como autoritarismo pelos outros. Lembre-se de equilibrar sua resposta natural de liderança com sensibilidade às necessidades e opiniões dos outros.',
'Espiritualmente, esta resposta conecta você com o princípio divino da manifestação material e da responsabilidade consciente. Você está aprendendo a usar o poder de forma sábia e benevolente.'
) ON CONFLICT (section, key_number) DO UPDATE SET
body = EXCLUDED.body,
practical_guidance = EXCLUDED.practical_guidance,
psychological_analysis = EXCLUDED.psychological_analysis,
spiritual_aspects = EXCLUDED.spiritual_aspects;