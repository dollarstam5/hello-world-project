-- Bounded retention for operational receipts and assistant usage metadata.
-- The ledger stores no raw prompts or generated responses.

CREATE OR REPLACE FUNCTION public.purge_operational_retention(
  p_sync_receipt_days INTEGER,
  p_ai_request_days INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_sync_receipts INTEGER := 0;
  v_ai_requests INTEGER := 0;
  v_ai_cache_hits INTEGER := 0;
  v_ai_cache_candidates INTEGER := 0;
BEGIN
  IF p_sync_receipt_days IS NULL OR p_sync_receipt_days NOT BETWEEN 7 AND 365
     OR p_ai_request_days IS NULL OR p_ai_request_days NOT BETWEEN 7 AND 365 THEN
    RAISE EXCEPTION 'invalid_retention_window' USING ERRCODE = '22023';
  END IF;

  DELETE FROM public.sync_mutation_receipts
  WHERE accepted_at < now() - make_interval(days => p_sync_receipt_days);
  GET DIAGNOSTICS v_sync_receipts = ROW_COUNT;

  DELETE FROM public.ai_requests
  WHERE created_at < now() - make_interval(days => p_ai_request_days);
  GET DIAGNOSTICS v_ai_requests = ROW_COUNT;

  DELETE FROM public.ai_cache_hits
  WHERE created_at < now() - make_interval(days => p_ai_request_days);
  GET DIAGNOSTICS v_ai_cache_hits = ROW_COUNT;

  DELETE FROM public.ai_cache
  WHERE status <> 'promoted'
    AND created_at < now() - make_interval(days => p_ai_request_days);
  GET DIAGNOSTICS v_ai_cache_candidates = ROW_COUNT;

  RETURN jsonb_build_object(
    'sync_receipts', v_sync_receipts,
    'ai_requests', v_ai_requests,
    'ai_cache_hits', v_ai_cache_hits,
    'ai_cache_candidates', v_ai_cache_candidates
  );
END;
$$;

REVOKE ALL ON FUNCTION public.purge_operational_retention(INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_operational_retention(INTEGER, INTEGER)
  TO service_role;

COMMENT ON FUNCTION public.purge_operational_retention(INTEGER, INTEGER) IS
  'Deletes expired idempotency receipts and assistant usage metadata; preserves promoted shared knowledge.';
