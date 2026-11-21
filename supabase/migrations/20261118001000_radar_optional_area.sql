BEGIN;

-- A geographic label is helpful for a Radar search, but it is not required
-- to preserve the user's intent. Keep radiusKm as the selected search radius;
-- a missing areaLabel means the zone is not yet specified.
ALTER TABLE public.radars
  ALTER COLUMN area_label DROP NOT NULL;

ALTER TABLE public.radars
  DROP CONSTRAINT IF EXISTS radars_area_length;

ALTER TABLE public.radars
  ADD CONSTRAINT radars_area_length
  CHECK (
    area_label IS NULL
    OR char_length(btrim(area_label)) BETWEEN 2 AND 80
  );

COMMENT ON COLUMN public.radars.area_label IS
  'Optional human-readable geographic hint. NULL means the user has not specified a zone yet.';

COMMIT;
