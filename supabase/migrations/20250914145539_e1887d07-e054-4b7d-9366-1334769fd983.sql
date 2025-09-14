-- Ensure unique constraint for upsert on numerology_texts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'idx_numerology_texts_section_key_number'
  ) THEN
    CREATE UNIQUE INDEX idx_numerology_texts_section_key_number
      ON public.numerology_texts (section, key_number);
  END IF;
END $$;

-- Optional: keep angels unique by name to avoid duplicates in future ingestions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'idx_cabalistic_angels_name_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_cabalistic_angels_name_unique
      ON public.cabalistic_angels (name);
  END IF;
END $$;