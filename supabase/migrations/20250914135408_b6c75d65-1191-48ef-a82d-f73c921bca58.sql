-- Criar índices otimizados para busca rápida de textos numerológicos
CREATE INDEX IF NOT EXISTS idx_numerology_texts_section_key ON numerology_texts(section, key_number);
CREATE INDEX IF NOT EXISTS idx_numerology_texts_lookup ON numerology_texts(section, key_number, lang, version);

-- Otimizar consultas de anjos cabalísticos
CREATE INDEX IF NOT EXISTS idx_cabalistic_angels_name ON cabalistic_angels(name);

-- Melhorar performance das consultas de correspondências
CREATE INDEX IF NOT EXISTS idx_numerology_correspondences_lookup ON numerology_correspondences(number, correspondence_type);