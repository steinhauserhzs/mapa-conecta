-- Update the default conversion table to use the correct Cabalistic 1-8 grid
UPDATE conversion_tables 
SET mapping = '{
  "A":1, "I":1, "Q":1, "Y":1, "J":1,
  "B":2, "K":2, "R":2,
  "C":3, "G":3, "L":3, "S":3,
  "D":4, "M":4, "T":4,
  "E":5, "H":5, "N":5,
  "U":6, "V":6, "W":6, "X":6,
  "O":7, "Z":7,
  "F":8, "P":8, "Ç":8
}'::jsonb
WHERE is_default = true;

-- If no default exists, create one
INSERT INTO conversion_tables (name, mapping, is_default, locale)
SELECT 'Tabela Cabalística Padrão', '{
  "A":1, "I":1, "Q":1, "Y":1, "J":1,
  "B":2, "K":2, "R":2,
  "C":3, "G":3, "L":3, "S":3,
  "D":4, "M":4, "T":4,
  "E":5, "H":5, "N":5,
  "U":6, "V":6, "W":6, "X":6,
  "O":7, "Z":7,
  "F":8, "P":8, "Ç":8
}'::jsonb, true, 'pt-BR'
WHERE NOT EXISTS (SELECT 1 FROM conversion_tables WHERE is_default = true);