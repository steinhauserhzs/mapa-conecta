-- Continuação da migração - Inserindo seções completas faltantes

-- IMPRESSÃO (números 1-22)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('impressao', 8, 'Impressão 8', 'A primeira impressão que você causa nas pessoas é de alguém eficiente, organizado e bem-sucedido. Demonstra seriedade, competência profissional e capacidade de liderança no mundo dos negócios. As pessoas o veem como alguém prático, determinado e com visão comercial aguçada. Sua presença inspira confiança e respeito, especialmente em questões relacionadas a dinheiro e negócios. 

Você projeta uma imagem de poder e autoridade material. Sua aparência e postura transmitem sucesso financeiro e estabilidade. As pessoas tendem a procurá-lo para conselhos sobre investimentos e oportunidades de negócios. Sua primeira impressão é sempre a de alguém que "sabe o que está fazendo" no mundo material e financeiro.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- MISSÃO (números 1-22)  
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('missao', 7, 'Missão 7', 'Sua missão nesta vida é desenvolver a sabedoria, o conhecimento profundo e a espiritualidade. Você veio para ser um buscador da verdade, um pesquisador incansável dos mistérios da vida. Sua função é aprofundar-se no estudo e na compreensão das leis universais.

Deve cultivar a introspecção, a análise e a capacidade de ver além das aparências. Sua missão inclui desenvolver habilidades de pesquisa, investigação e descoberta. Você tem o potencial para se tornar um especialista em sua área de conhecimento.

É importante que dedique tempo à meditação, aos estudos filosóficos ou científicos, e ao desenvolvimento de sua intuição. Sua contribuição ao mundo vem através do conhecimento que adquire e compartilha. Você é chamado a ser um conselheiro sábio, um estudioso respeitado ou um especialista em seu campo de atuação.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- NÚMERO PSÍQUICO (números 1-31)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('psiquico', 1, 'Número Psíquico 1', 'O Número Psíquico 1 indica uma personalidade forte, independente e determinada. Você nasceu para ser líder, pioneiro e inovador. Possui iniciativa natural e não gosta de seguir os outros - prefere criar seus próprios caminhos.

Sua mente é original e criativa, sempre buscando novas maneiras de fazer as coisas. Você tem um forte senso de individualidade e precisa de liberdade para expressar suas ideias únicas. É ambicioso, confiante e possui coragem para enfrentar desafios.

Como pessoa do número 1, você tem tendência a ser impaciente com a lentidão dos outros e pode ser considerado teimoso quando acredita firmemente em algo. Sua força interior é notável e você raramente desiste de seus objetivos. É importante aprender a trabalhar em equipe, mesmo mantendo sua individualidade natural.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- LIÇÕES CÁRMICAS (números 1-9)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('licao_carmica', 2, 'Lição Cármica 2', 'A ausência do número 2 em seu nome indica que você precisa aprender lições importantes sobre cooperação, diplomacia e trabalho em equipe. Esta lição cármica sugere que em vidas passadas você pode ter sido excessivamente individualista ou ter negligenciado a importância dos relacionamentos harmoniosos.

Nesta vida, você é chamado a desenvolver: paciência, sensibilidade aos sentimentos dos outros, habilidades de mediação e capacidade de trabalhar em parceria. Você precisa aprender a ouvir, a ceder quando necessário e a valorizar as contribuições dos outros.

Sua jornada inclui superar tendências à impaciência, ao autoritarismo ou à dificuldade de aceitar ajuda. É essencial que desenvolva a humildade e reconheça que o sucesso verdadeiro vem através da colaboração e do apoio mútuo.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('licao_carmica', 9, 'Lição Cármica 9', 'A ausência do número 9 em seu nome revela uma importante lição cármica sobre compaixão universal, desapego e serviço à humanidade. Esta lição sugere que em experiências passadas você pode ter sido muito focado em objetivos pessoais, negligenciando o bem-estar coletivo.

Nesta vida, você deve aprender: generosidade desinteressada, compreensão universal, capacidade de perdoar e desapego material. Sua jornada envolve desenvolver uma visão mais ampla da vida e reconhecer a interconexão entre todos os seres.

É importante superar tendências ao egoísmo, à mesquinhez ou à dificuldade de perdoar. Você está sendo chamado a servir causas maiores que seu interesse pessoal e a desenvolver sabedoria e compaixão genuínas. O aprendizado desta lição trará profunda realização espiritual.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- DÍVIDAS CÁRMICAS (números 13, 14, 16, 19)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('divida_carmica', 13, 'Dívida Cármica 13', 'A Dívida Cármica 13 indica que em vidas passadas você pode ter abusado do poder, sido preguiçoso ou negligente com responsabilidades importantes. O número 13 traz lições sobre trabalho árduo, disciplina e uso responsável do poder.

Nesta vida, você enfrenta desafios relacionados à necessidade de trabalhar duro para alcançar seus objetivos. Pode haver obstáculos que exigem persistência e determinação extraordinárias. É importante evitar atalhos ou métodos desonestos para conseguir o que deseja.

Sua redenção vem através do trabalho honesto, da disciplina constante e do uso ético de qualquer poder ou influência que possua. Você deve aprender a ser confiável, pontual e responsável em todos os seus compromissos. A transformação desta dívida trará grande força interior e realizações duradouras.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- TENDÊNCIAS OCULTAS (números 1-9)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('tendencia_oculta', 1, 'Tendência Oculta 1', 'A Tendência Oculta 1 revela que, em momentos de pressão ou crise, você naturalmente assume qualidades de liderança e independência. Quando as situações se tornam desafiadoras, sua verdadeira natureza pioneira e determinada emerge com força.

Nos momentos difíceis, você tende a: tomar iniciativa e assumir o controle, buscar soluções originais e criativas, demonstrar coragem e determinação excepcionais, e preferir agir sozinho quando necessário.

Esta tendência oculta pode surpreender até mesmo você, revelando uma força interior e capacidade de liderança que podem não ser evidentes no dia a dia. É importante reconhecer e honrar esta característica, usando-a de forma construtiva quando enfrentar desafios significativos em sua vida.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('tendencia_oculta', 3, 'Tendência Oculta 3', 'A Tendência Oculta 3 indica que, em momentos de pressão, sua criatividade e expressão artística se intensificam notavelmente. Quando enfrenta desafios, você naturalmente recorre à comunicação, à arte e à criatividade como ferramentas de superação.

Em situações difíceis, você tende a: expressar-se através da arte, da escrita ou da fala, encontrar soluções criativas e inovadoras, usar o humor e a leveza para aliviar tensões, e conectar-se com outras pessoas através da comunicação.

Esta tendência oculta revela uma capacidade inata de transformar dificuldades em expressões criativas. Você pode descobrir talentos artísticos ou comunicativos que não sabia possuir quando enfrenta momentos desafiadores. É uma força poderosa de cura e transformação pessoal.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- CICLOS DE VIDA (números 1-22)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('ciclo_vida', 5, 'Primeiro Ciclo de Vida 5', 'O Primeiro Ciclo de Vida 5 abrange aproximadamente os primeiros 28-36 anos da sua vida e é marcado pela busca por liberdade, variedade e experiências diversas. Durante esta fase, você sente uma forte necessidade de explorar o mundo e descobrir suas próprias possibilidades.

Características desta fase: forte desejo de viajar e conhecer lugares novos, curiosidade intensa sobre diferentes culturas e pessoas, dificuldade em se estabelecer em rotinas fixas, e atração por aventuras e experiências incomuns.

Este ciclo traz oportunidades de crescimento através da exploração e da diversificação de experiências. Você aprende através da variedade e da mudança. É importante equilibrar a necessidade de liberdade com responsabilidades básicas, evitando a dispersão excessiva de energia.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('ciclo_vida', 1, 'Segundo Ciclo de Vida 1', 'O Segundo Ciclo de Vida 1, que abrange aproximadamente dos 28-36 aos 54-63 anos, é um período de afirmação pessoal e desenvolvimento da liderança. Esta é a fase em que você constrói sua identidade profissional e assume maior responsabilidade por sua vida.

Características desta fase: desenvolvimento de habilidades de liderança, busca por independência e autonomia, foco no estabelecimento de carreira e identidade profissional, e necessidade de ser reconhecido por suas realizações únicas.

Durante este ciclo, você é chamado a desenvolver confiança em si mesmo e a assumir posições de maior responsabilidade. É o momento de implementar suas ideias originais e construir algo duradouro com sua marca pessoal. O sucesso vem através da iniciativa e da determinação.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('ciclo_vida', 2, 'Terceiro Ciclo de Vida 2', 'O Terceiro Ciclo de Vida 2 representa os anos mais maduros da vida, aproximadamente dos 54-63 anos em diante. Este ciclo é caracterizado pela busca por harmonia, relacionamentos significativos e contribuição através da cooperação e do apoio aos outros.

Características desta fase: valorização de relacionamentos profundos e duradouros, desejo de criar harmonia em seu ambiente, desenvolvimento de habilidades diplomáticas e mediadoras, e foco no bem-estar coletivo além dos objetivos pessoais.

Este ciclo traz a sabedoria da cooperação e da paciência. Você encontra realização ajudando outros e criando ambientes harmoniosos. É uma fase de colheita emocional e espiritual, onde a gentileza e a compreensão se tornam suas maiores forças.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';

-- MOMENTOS DECISIVOS (números 1-9)
INSERT INTO numerology_texts (section, key_number, title, body, lang, version) VALUES 
('momento_decisivo', 6, 'Primeiro Momento Decisivo 6', 'O Primeiro Momento Decisivo 6 ocorre aproximadamente entre os 27-35 anos e traz oportunidades relacionadas à responsabilidade familiar, relacionamentos amorosos e serviço aos outros. Este é um período em que questões do coração e do lar ganham destaque especial.

Durante este período, você pode enfrentar: decisões importantes sobre casamento ou relacionamentos sérios, responsabilidades familiares aumentadas, oportunidades de cuidar e nutrir outros, e necessidade de equilibrar vida pessoal e profissional.

Este momento decisivo pede que você desenvolva compaixão, responsabilidade e habilidades de cuidado. As decisões tomadas neste período influenciarão profundamente sua vida familiar e emocional. É importante agir com o coração, mas também com sabedoria prática.', 'pt-BR', 'v2.0') ON CONFLICT (section, key_number) DO UPDATE SET body = EXCLUDED.body, version = 'v2.0';