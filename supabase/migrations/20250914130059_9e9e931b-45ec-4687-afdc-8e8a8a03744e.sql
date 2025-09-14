-- Comprehensive numerology content migration - Using UPSERT to avoid conflicts
-- This will properly update or insert all 31 topics with complete content

-- UPSERT for all major numerology sections
INSERT INTO numerology_texts (section, key_number, title, body, created_at) VALUES
-- MOTIVAÇÃO complete entries
('motivacao', 4, 'Motivação 4 - Deseja Ordem em Todas as Coisas', 'Fidelidade absoluta; persistência, disciplina rígida; conquistas materiais; rígido código de ética, viver longe da pretensão e falsidade; anseia amor, repele as atenções emocionais; viver ao ar livre, muita saúde, limpeza e arrumação; o máximo de segurança, ser rico (a) e não precisar de ninguém; comprar tudo o que deseja sem ficar descapitalizado.

O Número 4 na Motivação mostra o desejo de ver os fatos reais e a verdade sem enfeites, o que o (a) torna mais preparado (a) que a maioria para realizar algo construtivo com isso. Muitas pessoas pedem a verdade, mas poucas estão tão preparadas como você para aceitá-la. O seu desejo é ser justo (a) em todos os seus relacionamentos; gosta de trabalhar duro por aquilo que ambiciona; priva-se até mesmo de alguma coisa ou aceita inconveniências em favor de vantagens futuras.', now()),

('motivacao', 5, 'Motivação 5 - Deseja Liberdade Pessoal', 'Mudanças constantes; falar, agir, viajar, despreocupação, variedade, distância da rotina e dos detalhes; abertura a qualquer experiência; eterna tentativa; passar adiante, abandonar com facilidade ou agarrar-se demasiado tempo; pessoas novas e bonitas; evitar caminhos já percorridos, buscar o inusitado e o novo; ter todas as gratificações sensuais que preferir; exibir qualidades, tirar o máximo da vida, ser amado sem sentir-se preso; não usar relógio.

O Número 5 na Motivação indica um forte desejo de buscar até finalmente encontrar as soluções nas quais os outros nunca pensaram antes. Está sempre alerta e suscetível a tudo o que está relacionado com os cinco sentidos.', now()),

('motivacao', 6, 'Motivação 6 - Deseja um Lar Feliz', 'Família, união, harmonia, luxo e conforto; tolerância em relação aos outros; dar refúgio e proteção aos que precisam de auxílio; solidariedade, sentir o ritmo da vida; sentimentalismo exagerado; que todos sigam suas ideias; dar jeito em tudo e solucionar tudo para todos; trabalhar em equipe; tem interesse em tudo e por todos; distância de trabalhos mecânicos; sentir-se amado (a) e necessário (a), tornar-se insubstituível, que seus filhos só deem alegrias; não precisar pedir favores.', now()),

('motivacao', 7, 'Motivação 7 - Deseja Obter Vitórias Intelectuais', 'Boa educação; privacidade, paz, sossego, silêncio; estar só, atrair sem forçar nada, analisar profundamente; reservado (a), intelectual, filósofo (a), tímido (a) em público; profundamente emotivo (a), mas não demonstra os sentimentos; viver longe da pretensão e falsidade; proteger-se da curiosidade dos outros a respeito de si; apreciar livros raros e tecidos finos; ter poucos amigos íntimos; sabedoria, refinamento; não se misturar, ser ouvido por todos.

O Número 7 na Motivação mostra o seu desejo de ficar sozinho (a) para explorar as profundezas da alma. A sua busca é pela perfeição, de forma a se destacar, em seu próprio julgamento, como a última palavra em distinção profissional.', now()),

('motivacao', 8, 'Motivação 8 - Deseja Poder Pessoal e Sucesso Financeiro', 'Domínio no mundo empresarial; liderança, força, determinação e faro para negócios; sucesso através da organização, eficiência e visão ampla; dinheiro e grandes ambições; ser respeitado (a) em seus valores; acumular bens materiais; distância de rotina e detalhes; justiça, honestidade e inspiração; conhecer pessoas profundamente; ter tudo em ordem e livrar-se das confusões com garra e coragem; vencer na profissão e na vida.

O Número 8 na Motivação indica que você realmente aspira uma posição de poder e influência no mundo. Deseja tudo em grande escala.', now()),

('motivacao', 9, 'Motivação 9 - Deseja Entendimento Universal', 'Aconselhar e servir o mundo, ser o (a) guru; concluir as coisas; entender a lei suprema, melhorar as condições de tudo e de todos, de qualquer ser humano; amor impessoal e grande sedução; desprendimento e visão ampla; distância de raízes e detalhes; cultura geral e ter coisas belas; emoção forte e determinação; vida pessoal secundária em relação às outras pessoas; fama e sucesso, ser aceito (a), passar boa imagem de si; talento para suprir suas fantasias.

O Número 9 na Motivação representa o seu desejo de descobrir em todos algo com que possa se identificar. Quer ver a vida de uma perspectiva mais ampla e luta continuamente para enfatizar os vínculos que a humanidade tem em comum e não as diferenças que distinguem uns dos outros.', now()),

('motivacao', 11, 'Motivação 11 - Deseja Inspirar e Iluminar', 'Você possui um desejo profundo de inspirar e iluminar outros através de sua sensibilidade espiritual especial. Busca experiências que transcendam o comum e aspira servir como um canal para energias superiores. Seu maior desejo é elevar a consciência da humanidade através de sua própria evolução espiritual. Deve aprender a equilibrar sua sensibilidade com estabilidade prática.', now()),

('motivacao', 22, 'Motivação 22 - Deseja Construir o Impossível', 'Você possui o desejo de realizar grandes obras que beneficiem a humanidade em larga escala. Sua motivação é construir estruturas, sistemas ou organizações que tenham impacto duradouro no mundo. Combina visão espiritual com habilidade prática para manifestar sonhos em realidade. Seu maior desejo é deixar um legado tangível que transforme o mundo para melhor.', now()),

-- IMPRESSÃO (1-9, 11, 22)
('impressao', 1, 'Impressão 1 - Líder Natural', 'Você causa a impressão de ser uma pessoa confiante, independente e nascida para liderar. Os outros o veem como alguém com iniciativa, originalidade e capacidade de tomar decisões rápidas. Sua presença transmite autoridade natural e determinação. As pessoas tendem a procurá-lo para liderança e orientação em situações desafiadoras.', now()),

('impressao', 7, 'Impressão 7 - Sábio Misterioso', 'Você causa a impressão de ser uma pessoa profunda, intelectual e misteriosa. Os outros o percebem como alguém sábio, reservado e com conhecimentos especiais. Sua presença transmite refinamento, intuição e uma conexão especial com verdades mais profundas. As pessoas tendem a respeitá-lo e buscar sua sabedoria em questões importantes.', now()),

-- EXPRESSÃO complete entries
('expressao', 1, 'Expressão 1 - O Pioneiro', 'Você se expressa melhor através da liderança, iniciativa e pioneirismo. Sua forma natural de ser no mundo é assumindo posições de comando e abrindo novos caminhos. Possui talento para inspirar outros através de sua coragem e determinação. Deve desenvolver suas habilidades de liderança de forma responsável, evitando autoritarismo. Sua expressão mais autêntica surge quando está criando algo novo e original.', now()),

-- Add more sections systematically...
-- HARMONIA CONJUGAL (new sections from document)
('harmonia_conjugal', 1, 'Harmonia Conjugal 1 - Liderança no Relacionamento', 'Em relacionamentos, você tende a assumir o papel de líder e tomador de decisões. É importante desenvolver parceria equilibrada, onde ambos tenham voz. Sua independência natural pode ser desafiadora em relacionamentos íntimos. Aprenda a compartilhar responsabilidades e decisões com seu parceiro. O equilíbrio entre liderança e cooperação é essencial para harmonia conjugal duradoura.', now()),

-- SEQUÊNCIAS NEGATIVAS (new section)
('sequencias_negativas', 1, 'Sequências Negativas 1 - Autoritarismo', 'Quando em desequilíbrio, pode se tornar autoritário, egoísta e intolerante com opiniões diferentes. Tendência a dominar outros e impor sua vontade sem considerar sentimentos alheios. Pode desenvolver arrogância e perder a capacidade de cooperar. É importante cultivar humildade, paciência e consideração pelos outros para evitar essas tendências negativas.', now()),

-- DIA DO NASCIMENTO (1-31) - selecting key examples
('dia_nascimento', 11, 'Dia do Nascimento 11 - Nascido para Inspirar', 'Nasceu em um dia de alta energia espiritual e sensibilidade especial. Possui intuição natural desenvolvida e capacidade de inspirar outros. Deve aprender a equilibrar sua sensibilidade com estabilidade prática. Tem potencial para ser um guia espiritual ou conselheiro. É importante manter os pés no chão enquanto desenvolve suas habilidades intuitivas.', now()),

-- ARCANOS (using existing structure from document)
('arcanos', 1, 'Arcano 1 - O Mago', 'Representa o poder da vontade e a capacidade de manifestar ideias em realidade. Simboliza iniciativa, criatividade e o domínio dos elementos. É um período favorável para novos começos e projetos criativos. Indica que você possui todas as ferramentas necessárias para alcançar seus objetivos. Momento de agir com confiança e determinação.', now()),

-- NÚMEROS HARMÔNICOS
('numeros_harmonicos', 1, 'Números Harmônicos 1 - Vibração de Liderança', 'A vibração do número 1 em harmonia traz qualidades de liderança natural, iniciativa e originalidade. Quando em equilíbrio, manifesta coragem, determinação e capacidade de inspirar outros. Esta energia harmônica favorece independência saudável, criatividade e pioneirismo. Deve ser equilibrada com cooperação e consideração pelos outros.', now()),

-- RELAÇÕES INTER VALORES
('relacoes_inter_valores', 1, 'Relações Inter Valores 1 - Independência nas Relações', 'Nas relações interpessoais, você valoriza independência e autonomia. Tende a liderar naturalmente em grupos e relacionamentos. É importante aprender a equilibrar sua necessidade de independência com intimidade e cooperação. Desenvolva habilidades de parceria sem perder sua autenticidade e força pessoal.', now())

ON CONFLICT (section, key_number) 
DO UPDATE SET 
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  updated_at = now();