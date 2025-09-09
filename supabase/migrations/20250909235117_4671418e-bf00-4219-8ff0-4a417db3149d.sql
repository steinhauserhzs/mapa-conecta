-- Atualizar a tabela de conversão para usar os valores corretos do método Jé Fêrraz
UPDATE conversion_tables 
SET mapping = '{
  "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 8, "G": 3, "H": 5, "I": 1,
  "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 7, "P": 8, "Q": 1, "R": 2,
  "S": 3, "T": 4, "U": 6, "V": 6, "W": 6, "X": 6, "Y": 1, "Z": 7, "Ç": 8,
  "À": 1, "Á": 1, "Â": 1, "Ã": 1, "É": 5, "Ê": 5, "Í": 1, "Ó": 7, "Ô": 7, "Õ": 7, "Ú": 6
}'::jsonb
WHERE is_default = true AND locale = 'pt-BR';