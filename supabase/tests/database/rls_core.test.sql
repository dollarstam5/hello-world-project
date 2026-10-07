begin;

select plan(10);

select has_table('public', 'user_roles', 'user_roles exists');
select has_table('public', 'profiles', 'profiles exists');
select has_table('public', 'udi', 'udi exists');
select has_table('public', 'media', 'media exists');
select has_table('public', 'flashes', 'flashes exists');
select has_table('public', 'missions', 'missions exists');
select has_table('public', 'posts', 'posts exists');
select has_table('public', 'notifications', 'notifications exists');
select has_table('public', 'audit', 'audit exists');

select ok(
  (
    select count(*) = 8
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'user_roles', 'profiles', 'udi', 'media',
        'flashes', 'missions', 'posts', 'notifications', 'audit'
      )
      and c.relrowsecurity
  ),
  'all sync tables have RLS enabled'
);

select * from finish();
rollback;
