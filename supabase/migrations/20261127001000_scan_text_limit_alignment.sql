BEGIN;

-- Keep the public Scan RPC aligned with the 160-character request contract
-- enforced by scanQuerySchema and the Scan input. The previous 120-character
-- SQL guard rejected otherwise valid requests before discovery could run.
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
DECLARE
  visitor_location extensions.geography;
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

  IF length(coalesce(p_text, '')) > 160 THEN
    RAISE EXCEPTION 'scan_text_too_long' USING ERRCODE = '22023';
  END IF;

  visitor_location :=
    extensions.ST_SetSRID(
      extensions.ST_MakePoint(p_longitude, p_latitude),
      4326
    )::extensions.geography;

  RETURN QUERY
  WITH candidates AS (
    SELECT
      f.id,
      f.kind,
      f.category,
      f.title,
      f.time_slot,
      coalesce(nullif(btrim(f.area_label), ''), 'Zone non précisée') AS area_label,
      f.created_at,
      f.expires_at,
      CASE f.scope
        WHEN 'current_area' THEN 500.0
        WHEN 'expanded_area' THEN 2000.0
        WHEN 'half_city' THEN 5000.0
        WHEN 'whole_city' THEN 15000.0
        ELSE NULL
      END AS author_radius_m,
      extensions.ST_Distance(loc.location, visitor_location) AS raw_distance_m
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
      AND f.scope IN ('current_area', 'expanded_area', 'half_city', 'whole_city')
      AND (p_category IS NULL OR f.category = p_category)
      AND (
        nullif(btrim(p_text), '') IS NULL
        OR f.title ILIKE '%' || btrim(p_text) || '%'
        OR f.body ILIKE '%' || btrim(p_text) || '%'
      )
      -- Indexable visitor-radius prefilter on the derived geography column.
      AND extensions.ST_DWithin(
        loc.location,
        visitor_location,
        p_radius_km * 1000.0
      )
  )
  SELECT
    c.id,
    c.kind,
    c.category,
    c.title,
    c.time_slot,
    c.area_label,
    round((c.raw_distance_m / 1000.0)::numeric, 1)::double precision,
    c.created_at,
    c.expires_at
  FROM candidates AS c
  WHERE c.author_radius_m IS NOT NULL
    AND c.raw_distance_m <= LEAST(p_radius_km * 1000.0, c.author_radius_m)
  ORDER BY c.raw_distance_m ASC, c.created_at DESC, c.id
  LIMIT least(greatest(coalesce(p_limit, 50), 1), 50);
END
$$;

REVOKE ALL ON FUNCTION public.scan_public_flashes(TEXT, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.scan_public_flashes(TEXT, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) TO anon, authenticated;

COMMENT ON FUNCTION public.scan_public_flashes(TEXT, TEXT, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) IS
  'Public proximity search. Accepts up to 160 query characters; GiST-indexable ST_DWithin prefilters visitor radius; ST_Distance enforces LEAST(visitor radius, author Flash scope) in raw meters before rounding. Never returns precise coordinates.';

COMMIT;
