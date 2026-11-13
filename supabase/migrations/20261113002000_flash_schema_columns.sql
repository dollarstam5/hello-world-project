-- Flash schema fields required by the shared contracts and public projections.
-- Precise coordinates are deliberately stored separately: sync pulls use
-- SELECT * on public.flashes, so putting coordinates on that table would
-- expose them to every authenticated sync client.

ALTER TABLE public.flashes
  ADD COLUMN IF NOT EXISTS kind TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS time_slot TEXT,
  ADD COLUMN IF NOT EXISTS area_label TEXT,
  ADD COLUMN IF NOT EXISTS response_limit DOUBLE PRECISION;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'flashes_response_limit_range_check'
      AND conrelid = 'public.flashes'::regclass
  ) THEN
    ALTER TABLE public.flashes
      ADD CONSTRAINT flashes_response_limit_range_check
      CHECK (response_limit IS NULL OR response_limit BETWEEN 1 AND 12);
  END IF;
END;
$$;

COMMENT ON COLUMN public.flashes.kind IS
  'Flash intent kind (need/offer); nullable for legacy records.';
COMMENT ON COLUMN public.flashes.category IS
  'Flash category; nullable for legacy records.';
COMMENT ON COLUMN public.flashes.time_slot IS
  'Flash time slot; nullable for legacy records.';
COMMENT ON COLUMN public.flashes.area_label IS
  'Coarse public area label; never a precise address.';
COMMENT ON COLUMN public.flashes.response_limit IS
  'Optional response limit, constrained to the shared contract range 1..12.';

-- Private precise locations must not be columns on public.flashes because
-- the sync transport serializes every flashes column with SELECT *.
CREATE TABLE IF NOT EXISTS public.flash_private_locations (
  flash_id UUID PRIMARY KEY
    REFERENCES public.flashes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL
    CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL
    CHECK (longitude BETWEEN -180 AND 180),
  accuracy_meters DOUBLE PRECISION NOT NULL
    CHECK (accuracy_meters BETWEEN 0 AND 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flash_private_locations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.flash_private_locations FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.flash_private_locations TO authenticated;
GRANT ALL ON TABLE public.flash_private_locations TO service_role;

DROP POLICY IF EXISTS "flash private locations readable by owner"
  ON public.flash_private_locations;
CREATE POLICY "flash private locations readable by owner"
  ON public.flash_private_locations
  FOR SELECT TO authenticated
  USING (author_id = auth.uid());

COMMENT ON TABLE public.flash_private_locations IS
  'Private precise Flash coordinates. Never included in sync records or public Flash/Scan projections.';
