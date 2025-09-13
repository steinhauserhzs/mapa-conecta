-- Call the function to populate PDF content
SELECT net.http_post(
  url := 'https://vbrhjptkfwugeheqmvlz.supabase.co/functions/v1/populate-pdf-content',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := '{}'::jsonb
) as result;