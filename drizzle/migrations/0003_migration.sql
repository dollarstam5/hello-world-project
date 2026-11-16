DROP POLICY IF EXISTS "avatars readable by members" ON storage.objects;
CREATE POLICY "avatars owner select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (auth.uid())::text);