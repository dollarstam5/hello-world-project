BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(2);

SELECT lives_ok(
  $$SELECT count(*) FROM public.scan_public_flashes(repeat('x', 160), NULL, 0, 0, 1, 1)$$,
  'Scan accepts the full 160-character input contract'
);

SELECT throws_ok(
  $$SELECT count(*) FROM public.scan_public_flashes(repeat('x', 161), NULL, 0, 0, 1, 1)$$,
  '22023',
  'scan_text_too_long',
  'Scan rejects text beyond the 160-character contract'
);

SELECT * FROM finish();
ROLLBACK;
