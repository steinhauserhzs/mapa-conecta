-- Adicionar client_id na tabela maps para conectar mapas aos clientes
ALTER TABLE public.maps ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- Criar índice para performance
CREATE INDEX idx_maps_client_id ON public.maps(client_id);

-- Criar tabela de serviços para registrar todos os trabalhos
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  map_id uuid REFERENCES public.maps(id) ON DELETE SET NULL,
  service_type text NOT NULL, -- 'map_generation', 'phone_analysis', 'address_analysis', etc.
  service_data jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for services
CREATE POLICY "Users can view their own services" 
ON public.services 
FOR SELECT 
USING (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

CREATE POLICY "Users can create their own services" 
ON public.services 
FOR INSERT 
WITH CHECK (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own services" 
ON public.services 
FOR UPDATE 
USING (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own services" 
ON public.services 
FOR DELETE 
USING (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();