-- Update the update-numerology-content function to seed complete content
-- This will be called via the edge function to populate all 31 topics

-- Just ensure we have proper indexing for faster text retrieval
CREATE INDEX IF NOT EXISTS idx_numerology_texts_section_key ON numerology_texts(section, key_number);
CREATE INDEX IF NOT EXISTS idx_cabalistic_angels_name ON cabalistic_angels(name);