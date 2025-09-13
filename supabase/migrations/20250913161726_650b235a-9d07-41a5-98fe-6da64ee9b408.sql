-- Continuar populando conteúdo para Ciclos de Vida, Desafios e outras seções

-- Inserir textos para Ciclos de Vida
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, life_periods, growth_opportunities
) VALUES (
'ciclos_vida', 5, 'Primeiro Ciclo de Vida 5 - Exploração e Liberdade (0-28 anos)',
'O primeiro ciclo de sua vida (nascimento até aproximadamente 28 anos) é governado pela energia dinâmica do número 5. Este período é caracterizado por uma necessidade intensa de exploração, experimentação e descoberta de sua própria identidade através de experiências diversificadas.

Durante esta fase, você naturalmente busca variedade, mudança e aventura. É um tempo de experimentar diferentes caminhos, conhecer pessoas diversas, e descobrir quais aspectos da vida realmente ressoam com sua alma. Você pode sentir-se inquieto se forçado a seguir um caminho muito estruturado ou restritivo.

Este ciclo estabelece as bases para sua compreensão de liberdade pessoal e sua necessidade de manter flexibilidade ao longo da vida. As experiências vividas durante este período moldam sua capacidade futura de adaptação e seu apreço pela diversidade da existência humana.',
'main', 'pt-BR',
'Abrace a experimentação - teste diferentes carreiras, hobbies e estilos de vida. Viaje sempre que possível. Mantenha-se aberto a mudanças de direção. Não se pressione para "definir" sua vida muito cedo.',
'Este período inclui infância explorativa, adolescência aventureira, e jovem adulto experimentando liberdades. Cada fase traz oportunidades únicas de descoberta pessoal através da experiência direta.',
'Cada nova experiência durante este ciclo contribui para a formação de uma base sólida de autoconhecimento. A variedade vivida agora enriquece todas as fases posteriores da vida.'
),
('ciclos_vida', 11, 'Segundo Ciclo de Vida 11 - Despertar Espiritual (28-56 anos)',
'O segundo ciclo de sua vida (aproximadamente 28 a 56 anos) é governado pelo poderoso número mestre 11. Este é um período de despertar espiritual significativo, desenvolvimento de intuição elevada, e reconhecimento de seu papel como ponte entre mundos materiais e espirituais.

Durante esta fase, você desenvolve uma sensibilidade aguçada para dimensões mais sutis da existência. É comum experimentar insights profundos, sincronicidades marcantes, e uma percepção crescente de sua missão espiritual. Você pode se sentir chamado a inspirar, ensinar ou guiar outros de alguma forma.

Este ciclo frequentemente traz desafios que testam sua fé e forçam o desenvolvimento de uma conexão mais profunda com sua sabedoria interior. É um período de refinamento espiritual que o prepara para servir como canal de luz e inspiração para outros.',
'main', 'pt-BR',
'Desenvolva práticas espirituais regulares. Confie em sua intuição crescente. Aceite oportunidades de ensinar ou inspirar outros. Mantenha diário de insights e sincronicidades.',
'Este período inclui maturidade emergente (28-35), plenitude criativa (35-45), e sabedoria consolidada (45-56). Cada fase oferece oportunidades crescentes de influência espiritual positiva.',
'Desafios durante este ciclo aceleram o desenvolvimento espiritual. Cada prova superada fortalece sua capacidade de servir como farol de luz para outros.'
),
('ciclos_vida', 2, 'Terceiro Ciclo de Vida 2 - Harmonia e Colaboração (56+ anos)',
'O terceiro ciclo de sua vida (aproximadamente 56 anos em diante) é governado pela energia gentil e cooperativa do número 2. Este é um período de colheita das sementes plantadas em ciclos anteriores, com foco em relacionamentos profundos, colaboração harmoniosa, e serviço através da parceria.

Durante esta fase, você desenvolve uma apreciação profunda pela beleza da cooperação e do apoio mútuo. É um tempo de nutrir relacionamentos significativos, compartilhar sabedoria adquirida, e encontrar formas gentis de contribuir para o bem-estar dos outros.

Este ciclo frequentemente traz oportunidades de ser um conselheiro sábio, um mediador pacífico, ou um mentor amoroso. Sua experiência acumulada, combinada com a energia harmoniosa do 2, permite que você tenha um impacto profundo através de ações gentis e presença compassiva.',
'main', 'pt-BR',
'Cultive relacionamentos profundos e significativos. Ofereça sua sabedoria de forma gentil e não invasiva. Busque oportunidades de colaboração harmoniosa. Pratique a arte da escuta compassiva.',
'Este período pode incluir mentoria (56-65), sabedoria compartilhada (65-75), e legado pacífico (75+). Cada fase oferece oportunidades únicas de impacto através do amor e da cooperação.',
'Cada relacionamento nutrido durante este ciclo multiplica seu impacto positivo. Sua capacidade de criar harmonia torna-se um presente para as gerações futuras.'
);

-- Inserir textos para Desafios
INSERT INTO numerology_texts (
  section, key_number, title, body, category, lang,
  practical_guidance, psychological_analysis, growth_opportunities,
  shadow_aspects, recommendations
) VALUES (
'desafios', 3, 'Desafio Principal 3 - Expressão Criativa Autêntica',
'O desafio do número 3 em sua vida centra-se na necessidade de desenvolver e expressar suas capacidades criativas de forma autêntica e confiante. Este desafio surge quando há bloqueios ou medos relacionados à autoexpressão, comunicação genuína, ou compartilhamento de seus talentos únicos com o mundo.

Você pode enfrentar situações que exigem que supere timidez, autocrítica excessiva, ou tendências a esconder suas habilidades criativas. O desafio é aprender a confiar em sua voz interior e permitir que sua criatividade flua livremente, mesmo quando se sente vulnerável ou incerto sobre a recepção dos outros.

Este desafio frequentemente se manifesta através de oportunidades que requerem expressão pública, colaboração criativa, ou situações onde você precisa comunicar ideias importantes. Superar este desafio resulta em um aumento significativo de autoconfiança e alegria de viver.',
'main', 'pt-BR',
'Pratique expressão criativa regularmente, mesmo em pequena escala. Participe de grupos ou atividades que encorajem compartilhamento criativo. Desenvolva uma prática de escrita, arte, ou outra forma de expressão pessoal.',
'Você pode lutar com dúvidas sobre o valor de suas contribuições criativas. Reconheça que estas dúvidas são parte natural do processo criativo e não reflexo real de sua capacidade ou valor.',
'Cada ato de expressão autêntica fortalece sua confiança e abre portas para oportunidades criativas maiores. O desafio superado torna-se uma fonte de alegria e inspiração contínuas.',
'Cuidado com autocrítica paralisante ou comparação excessiva com outros criativos. Evite esconder seus talentos por medo de julgamento. Não desista de expressão criativa durante períodos de bloqueio.',
'Mantenha um diário criativo. Participe de workshops ou grupos de apoio criativo. Celebre pequenas expressões criativas. Busque feedback construtivo de pessoas de confiança.'
),
('desafios', 0, 'Desafio Secundário 0 - Potencial Infinito e Escolhas Conscientes',
'O desafio do número 0 representa uma situação única onde você enfrenta possibilidades infinitas e deve aprender a fazer escolhas conscientes e direcionadas. Este desafio surge da necessidade de encontrar foco e direção em meio a múltiplas potencialidades.

Você pode sentir-se sobrecarregado pelas opções disponíveis ou paralisado pela pressão de fazer a escolha "certa". O desafio é desenvolver discernimento espiritual e confiança em sua intuição para navegar entre possibilidades infinitas de forma sábia e alinhada.

Este desafio frequentemente se manifesta em momentos de transição importante, quando múltiplos caminhos se abrem simultaneamente. É uma oportunidade de desenvolver fé em sua sabedoria interior e aprender a seguir o fluxo natural da vida com consciência e propósito.',
'main', 'pt-BR',
'Desenvolva práticas de meditação e contemplação para clarear a mente. Crie critérios baseados em valores pessoais para avaliar opções. Confie em sua intuição quando lógica sozinha não é suficiente.',
'O medo de fazer a escolha errada pode criar paralisia. Lembre-se que não existem escolhas perfeitas - apenas escolhas conscientes que levam a aprendizado e crescimento.',
'Este desafio desenvolve sabedoria espiritual profunda e capacidade de navegar a vida com fé e intuição. Cada escolha consciente fortalece sua conexão com propósito superior.',
'Evite procrastinação excessiva ou busca obsessiva pela escolha perfeita. Não se deixe paralisar pelo medo do desconhecido. Cuidado com dispersão de energia em muitas direções.',
'Pratique tomada de decisões menores para desenvolver confiança. Mantenha conexão regular com práticas espirituais. Busque orientação quando necessário, mas confie ultimamente em sua sabedoria interior.'
);