BEGIN;

-- Flash private geography is derived from canonical coordinates.
-- PostGIS is already installed by the Reel migration.

ALTER TABLE public.flash_private_locations
  ADD COLUMN location extensions.geography(Point, 4326);

CREATE OR REPLACE FUNCTION public.sync_flash_private_location_geography()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  IF NEW.latitude IS NULL
     OR NEW.longitude IS NULL
     OR NEW.latitude NOT BETWEEN -90 AND 90
     OR NEW.longitude NOT BETWEEN -180 AND 180 THEN
    RAISE EXCEPTION 'invalid_flash_private_location'
      USING ERRCODE = '22023';
  END IF;

  NEW.location :=
    extensions.ST_SetSRID(
      extensions.ST_MakePoint(
        NEW.longitude,
        NEW.latitude
      ),
      4326
    )::extensions.geography;

  RETURN NEW;
END;
$$;

REVOKE ALL
ON FUNCTION public.sync_flash_private_location_geography()
FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS flash_private_location_geography_sync
  ON public.flash_private_locations;

CREATE TRIGGER flash_private_location_geography_sync
BEFORE INSERT OR UPDATE OF latitude, longitude, location
ON public.flash_private_locations
FOR EACH ROW
EXECUTE FUNCTION public.sync_flash_private_location_geography();

-- Recompute all existing geography from the canonical coordinate pair.
UPDATE public.flash_private_locations
SET location = location;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.flash_private_locations
    WHERE location IS NULL
  ) THEN
    RAISE EXCEPTION 'flash_private_location_geography_backfill_failed';
  END IF;
END;
$$;

ALTER TABLE public.flash_private_locations
  ALTER COLUMN location SET NOT NULL;

CREATE INDEX flash_private_locations_geography_gist
ON public.flash_private_locations
USING GIST (location);

COMMENT ON COLUMN public.flash_private_locations.location IS
  'Private PostGIS geography derived exclusively from canonical latitude/longitude. Never exposed publicly.';

COMMENT ON FUNCTION public.sync_flash_private_location_geography() IS
  'Trigger function: validates coordinates and overwrites geography with the canonical point.';

COMMIT;
