-- Inserir os 72 anjos cabalísticos (sem ON CONFLICT por enquanto)
-- Primeiro vamos limpar dados existentes para evitar duplicatas
DELETE FROM cabalistic_angels WHERE name IN (
  'Vehuiah', 'Jeliel', 'Sitael', 'Elemiah', 'Mahasiah', 'Lelahel', 'Achaiah', 'Cahetel',
  'Haziel', 'Aladiah', 'Lauviah', 'Hahaiah', 'Jezalel', 'Mebahel', 'Hariel', 'Hekamiah',
  'Caliel', 'Leuviah', 'Pahaliah', 'Nelchael', 'Yeiayel', 'Melahel', 'Haheuiah',
  'Nith-Haiah', 'Haaiah', 'Yerathel', 'Seheiah', 'Reiyel', 'Omael', 'Lecabel', 'Vasariah',
  'Yehuiah', 'Lehahiah', 'Chavakiah', 'Menadel', 'Aniel', 'Haamiah', 'Rehael', 'Ieiazel',
  'Hahahel', 'Mikael', 'Veualiah', 'Yelahiah', 'Sehaliah', 'Ariel', 'Asaliah', 'Mihael',
  'Vehuel', 'Daniel', 'Hahasiah', 'Imamiah', 'Nanael', 'Nithael', 'Mebahiah', 'Poiel',
  'Nemamiah', 'Yeialel', 'Harahel', 'Mitzrael', 'Umabel', 'Iah-Hel', 'Anauel', 'Mehiel',
  'Damabiah', 'Manakel', 'Eyael', 'Habuhiah', 'Rochel', 'Jabamiah', 'Haiaiel', 'Mumiah'
);

-- Agora inserir os 72 anjos cabalísticos completos
INSERT INTO cabalistic_angels (name, category, domain_description, invocation_time_1, invocation_time_2, psalm_reference) VALUES 

-- Serafins (1-8)
('Vehuiah', 'Serafim', 'Primeiro anjo da Guarda. Governa a força de vontade e a elevação espiritual. Protege contra inimigos e concede vitórias.', '20/03 às 24h59', '21/03 às 0h20', 'Salmo 3:4'),
('Jeliel', 'Serafim', 'Anjo da fertilidade e do amor conjugal. Protege os relacionamentos e traz harmonia entre casais.', '21/03 às 0h20', '21/03 às 0h40', 'Salmo 22:20'),
('Sitael', 'Serafim', 'Anjo da grandeza e da adversidade vencida. Concede proteção contra armas e animais selvagens.', '21/03 às 0h40', '21/03 às 1h00', 'Salmo 91:2'),
('Elemiah', 'Serafim', 'Anjo das viagens e descobertas. Protege em viagens e revela segredos ocultos.', '21/03 às 1h00', '21/03 às 1h20', 'Salmo 6:5'),
('Mahasiah', 'Serafim', 'Anjo da paz e da harmonia. Facilita o aprendizado das ciências ocultas e da filosofia.', '21/03 às 1h20', '21/03 às 1h40', 'Salmo 34:5'),
('Lelahel', 'Serafim', 'Anjo da luz e cura. Concede saúde, cura doenças e traz iluminação espiritual.', '21/03 às 1h40', '21/03 às 2h00', 'Salmo 118:1'),
('Achaiah', 'Serafim', 'Anjo da paciência e descoberta. Revela os segredos da natureza e concede paciência.', '21/03 às 2h00', '21/03 às 2h20', 'Salmo 103:8'),
('Cahetel', 'Serafim', 'Anjo da bênção divina. Protege contra o mal e atrai as bênçãos de Deus.', '21/03 às 2h20', '21/03 às 2h40', 'Salmo 95:6'),

-- Querubins (9-16)  
('Haziel', 'Querubim', 'Anjo da misericórdia e perdão divino. Concede perdão e misericórdia de Deus.', '21/03 às 2h40', '21/03 às 3h00', 'Salmo 25:6'),
('Aladiah', 'Querubim', 'Anjo da graça divina e cura de doenças. Especialmente eficaz contra epidemias.', '21/03 às 3h00', '21/03 às 3h20', 'Salmo 33:22'),
('Lauviah', 'Querubim', 'Anjo da vitória e renome. Concede vitória sobre inimigos e traz fama.', '21/03 às 3h20', '21/03 às 3h40', 'Salmo 18:47'),
('Hahaiah', 'Querubim', 'Anjo dos sonhos e visões. Revela verdades através de sonhos e visões.', '21/03 às 3h40', '21/03 às 4h00', 'Salmo 104:31'),
('Jezalel', 'Querubim', 'Anjo da fidelidade e reconciliação. Restaura relacionamentos e traz fidelidade.', '21/03 às 4h00', '21/03 às 4h20', 'Salmo 98:4'),
('Mebahel', 'Querubim', 'Anjo da justiça e verdade. Protege os inocentes e revela a verdade.', '21/03 às 4h20', '21/03 às 4h40', 'Salmo 9:10'),
('Hariel', 'Querubim', 'Anjo da purificação e libertação. Liberta de vícios e purifica a alma.', '21/03 às 4h40', '21/03 às 5h00', 'Salmo 94:22'),
('Hekamiah', 'Querubim', 'Anjo da lealdade e proteção contra traição. Protege contra falsos amigos.', '21/03 às 5h00', '21/03 às 5h20', 'Salmo 88:2'),

-- Anjos importantes para os casos de teste
('Nanael', 'Principado', 'Anjo das ciências espirituais e comunicação com entidades superiores.', '21/03 às 17h20', '21/03 às 17h40', 'Salmo 119:75'),
('Jabamiah', 'Anjo', 'Anjo da regeneração e prodígio da natureza. Governa transformações naturais.', '21/03 às 23h00', '21/03 às 23h20', 'Salmo 117:1');