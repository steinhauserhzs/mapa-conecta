-- Create clients table for client management
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for client access
CREATE POLICY "Users can view their own clients" 
ON public.clients 
FOR SELECT 
USING (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

CREATE POLICY "Users can create their own clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own clients" 
ON public.clients 
FOR UPDATE 
USING (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own clients" 
ON public.clients 
FOR DELETE 
USING (user_id = ( SELECT profiles.id FROM profiles WHERE profiles.auth_user_id = auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();