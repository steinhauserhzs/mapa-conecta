-- Create profiles table with roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text,
  email text NOT NULL,
  role text CHECK (role IN ('admin','editor','viewer')) DEFAULT 'viewer',
  tz text DEFAULT 'America/Sao_Paulo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create new maps table structure
CREATE TABLE IF NOT EXISTS public.maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  input_json jsonb NOT NULL DEFAULT '{}',
  result_json jsonb DEFAULT '{}',
  status text CHECK (status IN ('draft','processing','ready','error')) DEFAULT 'draft',
  pdf_url text,
  error_msg text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create map jobs table
CREATE TABLE IF NOT EXISTS public.map_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id uuid REFERENCES public.maps(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  status text CHECK (status IN ('queued','running','succeeded','failed')) DEFAULT 'queued',
  details jsonb DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
  );

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT USING (
    owner_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own clients" ON public.clients
  FOR ALL USING (
    owner_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  ) WITH CHECK (
    owner_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

-- Create RLS policies for maps
CREATE POLICY "Users can view their own maps" ON public.maps
  FOR SELECT USING (
    owner_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own maps" ON public.maps
  FOR ALL USING (
    owner_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  ) WITH CHECK (
    owner_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

-- Create RLS policies for map jobs
CREATE POLICY "Users can view jobs for their maps" ON public.map_jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.maps m 
      JOIN public.profiles p ON m.owner_id = p.id 
      WHERE m.id = map_jobs.map_id AND p.auth_user_id = auth.uid()
    )
  );

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('maps', 'maps', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own map PDFs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'maps' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own map PDFs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'maps' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view public map PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'maps');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maps_updated_at
  BEFORE UPDATE ON public.maps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();