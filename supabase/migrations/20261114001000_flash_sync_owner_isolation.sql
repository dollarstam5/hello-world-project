BEGIN;

-- Sync pulls use SELECT on public.flashes and must only hydrate the owner's
-- private workspace. Public discovery is served by the narrow, scope-aware
-- scan_public_flashes projection instead of broad table reads.
DROP POLICY IF EXISTS "flashes readable by members" ON public.flashes;
CREATE POLICY "flashes readable by owner"
  ON public.flashes
  FOR SELECT TO authenticated
  USING (author_id = auth.uid() AND deleted_at IS NULL);

COMMENT ON POLICY "flashes readable by owner" ON public.flashes IS
  'Sync can read only the signed-in author''s Flash records. Public discovery must use the restricted Scan RPC projection.';

COMMIT;
