-- Habilitar proteção contra senhas vazadas
-- Isso previne que usuários usem senhas conhecidamente comprometidas

-- Habilitar verificação de senhas vazadas
UPDATE auth.config SET enable_leaked_password_check = true WHERE key = 'enable_leaked_password_check';

-- Se a entrada não existir, criar uma nova
INSERT INTO auth.config (key, value)
SELECT 'enable_leaked_password_check', 'true'
WHERE NOT EXISTS (SELECT 1 FROM auth.config WHERE key = 'enable_leaked_password_check');