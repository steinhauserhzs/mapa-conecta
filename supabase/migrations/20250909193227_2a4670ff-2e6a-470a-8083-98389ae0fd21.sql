-- Create numerology_texts table for official content library
CREATE TABLE public.numerology_texts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'motivacao', 'expressao', 'impressao', 'destino', 'ano_pessoal'
  key_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt-BR',
  version TEXT NOT NULL DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.numerology_texts ENABLE ROW LEVEL SECURITY;

-- Create policies for reading texts (public for all users)
CREATE POLICY "Anyone can view numerology texts" 
ON public.numerology_texts 
FOR SELECT 
USING (true);

-- Create policies for admins to manage texts
CREATE POLICY "Admins can manage numerology texts" 
ON public.numerology_texts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE auth_user_id = auth.uid() AND role = 'admin'
));

-- Create index for faster lookups
CREATE INDEX idx_numerology_texts_lookup ON public.numerology_texts(section, key_number, lang);

-- Add trigger for updated_at
CREATE TRIGGER update_numerology_texts_updated_at
BEFORE UPDATE ON public.numerology_texts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data structure (to be replaced with official texts)
INSERT INTO public.numerology_texts (section, key_number, title, body, lang) VALUES
('motivacao', 1, 'Motivação 1', 'Texto oficial da Motivação 1 será inserido aqui pelo administrador.', 'pt-BR'),
('motivacao', 2, 'Motivação 2', 'Texto oficial da Motivação 2 será inserido aqui pelo administrador.', 'pt-BR'),
('expressao', 1, 'Expressão 1', 'Texto oficial da Expressão 1 será inserido aqui pelo administrador.', 'pt-BR'),
('expressao', 2, 'Expressão 2', 'Texto oficial da Expressão 2 será inserido aqui pelo administrador.', 'pt-BR'),
('impressao', 1, 'Impressão 1', 'Texto oficial da Impressão 1 será inserido aqui pelo administrador.', 'pt-BR'),
('impressao', 2, 'Impressão 2', 'Texto oficial da Impressão 2 será inserido aqui pelo administrador.', 'pt-BR'),
('destino', 1, 'Destino 1', 'Texto oficial do Destino 1 será inserido aqui pelo administrador.', 'pt-BR'),
('destino', 2, 'Destino 2', 'Texto oficial do Destino 2 será inserido aqui pelo administrador.', 'pt-BR'),
('ano_pessoal', 1, 'Ano Pessoal 1', 'Texto oficial do Ano Pessoal 1 será inserido aqui pelo administrador.', 'pt-BR'),
('ano_pessoal', 2, 'Ano Pessoal 2', 'Texto oficial do Ano Pessoal 2 será inserido aqui pelo administrador.', 'pt-BR');