-- Update the conversion table with correct Jé Fêrraz values including accented characters
UPDATE conversion_tables 
SET mapping = '{
  "A": 1, "I": 1, "Q": 1, "J": 1, "Y": 1,
  "B": 2, "K": 2, "R": 2,
  "C": 3, "G": 3, "L": 3, "S": 3,
  "D": 4, "M": 4, "T": 4,
  "E": 5, "H": 5, "N": 5,
  "U": 6, "V": 6, "W": 6, "X": 6, "Ç": 6,
  "O": 7, "Z": 7,
  "F": 8, "P": 8,
  "À": 3, "Á": 1, "Â": 8, "Ã": 4, "Ä": 1,
  "È": 5, "É": 5, "Ê": 12, "Ë": 5,
  "Ì": 1, "Í": 1, "Î": 8, "Ï": 1,
  "Ò": 7, "Ó": 7, "Ô": 14, "Õ": 10, "Ö": 7,
  "Ù": 6, "Ú": 6, "Û": 13, "Ü": 6
}'::jsonb
WHERE is_default = true;