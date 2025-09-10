-- Enable password security features to address the security warning
ALTER SYSTEM SET 'auth.enable_signup' = 'true';
-- Enable leaked password protection
UPDATE auth.config SET enable_leaked_password_check = true WHERE key = 'leaked_password_check';