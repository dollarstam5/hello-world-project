-- Keep the sync receipt allow-list aligned with the logical sync tables.
-- Radar mutations are supported by the sync transport and must be receiptable.

ALTER TABLE public.sync_mutation_receipts
  DROP CONSTRAINT IF EXISTS sync_mutation_receipts_logical_table_check;

ALTER TABLE public.sync_mutation_receipts
  ADD CONSTRAINT sync_mutation_receipts_logical_table_check
  CHECK (
    logical_table IN (
      'users',
      'udi',
      'flashes',
      'missions',
      'radars',
      'posts',
      'media',
      'notifications',
      'audit'
    )
  );
