BEGIN;

-- Public Flash projection: expose only the fields required by the feed.
-- Author details, response limits and precise coordinates stay private.
CREATE OR REPLACE FUNCTION public.list_public_flashes(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  category TEXT,
  title TEXT,
  time_slot TEXT,
  area_label TEXT,
  expires_at BIGINT,
  created_at BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT
    f.id,
    f.kind,
    f.category,
    f.title,
    f.time_slot,
    f.area_label,
    f.expires_at,
    f.created_at
  FROM public.flashes AS f
  WHERE f.status = 'live'
    AND f.deleted_at IS NULL
    AND f.expires_at > (extract(epoch FROM now()) * 1000)::bigint
    AND f.kind IN ('need', 'offer')
    AND f.category IN (
      'personal', 'professional', 'commercial', 'home', 'transport',
      'food', 'education', 'health', 'events', 'other'
    )
    AND f.time_slot IN ('now', 'today', 'tomorrow', 'this_week')
    AND nullif(btrim(f.area_label), '') IS NOT NULL
  ORDER BY f.created_at DESC, f.id
  LIMIT least(greatest(coalesce(p_limit, 50), 1), 50)
$$;

REVOKE ALL ON FUNCTION public.list_public_flashes(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_flashes(INTEGER) TO anon, authenticated;

COMMENT ON FUNCTION public.list_public_flashes(INTEGER) IS
  'Public Flash feed projection. Omits author identity, body, response limit and precise location.';

-- Scan reads private coordinates only inside this SECURITY DEFINER function.
-- The result contains a coarse rounded distance, never coordinates.
CREATE OR REPLACE FUNCTION public.scan_public_flashes(
  p_text TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_latitude DOUBLE PRECISION DEFAULT NULL,
  p_longitude DOUBLE PRECISION DEFAULT NULL,
  p_radius_km DOUBLE PRECISION DEFAULT 5,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  category TEXT,
  title TEXT,
  time_slot TEXT,
  area_label TEXT,
  distance_km DOUBLE PRECISION,
  created_at BIGINT,
  expires_at BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF p_latitude IS NULL OR p_longitude IS NULL
     OR NOT (p_latitude BETWEEN -90 AND 90)
     OR NOT (p_longitude BETWEEN -180 AND 180) THEN
    RAISE EXCEPTION 'invalid_scan_coordinates' USING ERRCODE = '22023';
  END IF;

  IF p_radius_km IS NULL OR NOT (p_radius_km > 0 AND p_radius_km <= 50) THEN
    RAISE EXCEPTION 'invalid_scan_radius' USING ERRCODE = '22023';
  END IF;

  IF p_category IS NOT NULL AND p_category NOT IN (
    'personal', 'professional', 'commercial', 'home', 'transport',
    'food', 'education', 'health', 'events', 'other'
  ) THEN
    RAISE EXCEPTION 'invalid_scan_category' USING ERRCODE = '22023';
  END IF;

  IF length(coalesce(p_text, '')) > 120 THEN
    RAISE EXCEPTION 'scan_text_too_long' USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  WITH distances AS (
    SELECT
      f.id,
      f.kind,
      f.category,
      f.title,
      f.time_slot,
      f.area_label,
      f.created_at,
      f.expires_at,
      round((
        6371.0 * 2.0 * asin(sqrt(least(1.0, greatest(0.0,
          power(sin(radians(loc.latitude - p_latitude) / 2.0), 2)
          + cos(radians(p_latitude)) * cos(radians(loc.latitude))
          * power(sin(radians(loc.longitude - p_longitude) / 2.0), 2)
        ))))
      )::numeric, 1)::double precision AS rounded_distance_km
    FROM public.flashes AS f
    JOIN public.flash_private_locations AS loc
      ON loc.flash_id = f.id
     AND loc.author_id = f.author_id
    WHERE f.status = 'live'
      AND f.deleted_at IS NULL
      AND f.expires_at > (extract(epoch FROM now()) * 1000)::bigint
      AND f.kind IN ('need', 'offer')
      AND f.category IN (
        'personal', 'professional', 'commercial', 'home', 'transport',
        'food', 'education', 'health', 'events', 'other'
      )
      AND f.time_slot IN ('now', 'today', 'tomorrow', 'this_week')
      AND nullif(btrim(f.area_label), '') IS NOT NULL
      AND (p_category IS NULL OR f.category = p_category)
      AND (
        nullif(btrim(p_text), '') IS NULL
        OR f.title ILIKE '%' || btrim(p_text) || '%'
        OR f.body ILIKE '%' || btrim(p_text) || '%'
      )
  )
  SELECT
    d.id,
    d.kind,
    d.category,
    d.title,
    d.time_slot,
    d.area_label,
    d.rounded_distance_km,
    d.created_at,
    d.expires_at
  FROM distances AS d
  WHERE d.rounded_distance_km <= p_radius_km
  ORDER BY d.rounded_distance_km ASC, d.created_at DESC, d.id
  LIMIT least(greatest(coalesce(p_limit, 50), 1), 50);
END
$$;

REVOKE ALL ON FUNCTION public.scan_public_flashes(TEXT, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.scan_public_flashes(TEXT, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) TO anon, authenticated;

COMMENT ON FUNCTION public.scan_public_flashes(TEXT, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) IS
  'Public proximity search. Reads precise positions internally and returns only distance rounded to 0.1 km. Radius is capped at 50 km.';

-- A Flash author may update only their own status.
CREATE OR REPLACE FUNCTION public.transition_flash(p_flash_id UUID, p_status TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  IF p_status IS NULL OR p_status NOT IN ('live', 'archived') THEN
    RAISE EXCEPTION 'invalid_status' USING ERRCODE = '22023';
  END IF;

  UPDATE public.flashes
     SET status = p_status,
         updated_at = (extract(epoch FROM now()) * 1000)::bigint,
         server_updated_at = now()
   WHERE id = p_flash_id
     AND author_id = auth.uid()
     AND deleted_at IS NULL;

  RETURN FOUND;
END
$$;

REVOKE ALL ON FUNCTION public.transition_flash(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.transition_flash(UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION public.transition_flash(UUID, TEXT) IS
  'Author-only Flash status transition (live/archived).';

-- Exact coordinates are upserted into the owner-protected private table,
-- never into public.flashes (which is read by the sync transport).
CREATE OR REPLACE FUNCTION public.set_flash_location(
  p_flash_id UUID,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_accuracy_meters DOUBLE PRECISION
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  IF p_flash_id IS NULL
     OR p_latitude IS NULL
     OR p_longitude IS NULL
     OR p_accuracy_meters IS NULL
     OR NOT (p_latitude BETWEEN -90 AND 90)
     OR NOT (p_longitude BETWEEN -180 AND 180)
     OR NOT (p_accuracy_meters BETWEEN 0 AND 5000) THEN
    RAISE EXCEPTION 'invalid_location' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.flash_private_locations (
    flash_id, author_id, latitude, longitude, accuracy_meters
  )
  SELECT f.id, f.author_id, p_latitude, p_longitude, p_accuracy_meters
  FROM public.flashes AS f
  WHERE f.id = p_flash_id
    AND f.author_id = auth.uid()
    AND f.deleted_at IS NULL
  ON CONFLICT (flash_id) DO UPDATE
    SET latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        accuracy_meters = EXCLUDED.accuracy_meters,
        updated_at = now()
    WHERE public.flash_private_locations.author_id = EXCLUDED.author_id;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'flash_not_found_or_not_owner' USING ERRCODE = '42501';
  END IF;

  RETURN TRUE;
END
$$;

REVOKE ALL ON FUNCTION public.set_flash_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_flash_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;

COMMENT ON FUNCTION public.set_flash_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) IS
  'Author-only precise Flash location upsert into flash_private_locations; coordinates are not written to public.flashes.';

COMMIT;
