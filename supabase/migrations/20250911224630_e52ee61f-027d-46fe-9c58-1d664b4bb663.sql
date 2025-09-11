-- Create storage bucket for maps if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('maps', 'maps', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for maps bucket
CREATE POLICY "Maps are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'maps');

CREATE POLICY "Authenticated users can upload maps" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'maps' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own maps" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'maps' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own maps" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'maps' AND auth.role() = 'authenticated');