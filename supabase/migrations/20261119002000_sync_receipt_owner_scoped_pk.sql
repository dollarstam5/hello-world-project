BEGIN;

-- Mutation IDs are owner-scoped protocol keys. A global primary key can cause
-- unrelated owners to collide and makes receipt recovery ambiguous.
ALTER TABLE public.sync_mutation_receipts
  DROP CONSTRAINT IF EXISTS sync_mutation_receipts_pkey;

ALTER TABLE public.sync_mutation_receipts
  ADD CONSTRAINT sync_mutation_receipts_pkey
  PRIMARY KEY (owner_id, mutation_id);

COMMIT;
