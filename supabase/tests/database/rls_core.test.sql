begin;

select plan(19);

select has_table('public', 'user_roles', 'user_roles exists');
select has_table('public', 'profiles', 'profiles exists');
select has_table('public', 'udi', 'udi exists');
select has_table('public', 'media', 'media exists');
select has_table('public', 'flashes', 'flashes exists');
select has_table('public', 'missions', 'missions exists');
select has_table('public', 'posts', 'posts exists');
select has_table('public', 'notifications', 'notifications exists');
select has_table('public', 'audit', 'audit exists');

select policies_are(
  'public', 'user_roles',
  array['own roles are readable', 'owners manage roles']
);
select policies_are(
  'public', 'profiles',
  array['profiles readable by members', 'own profile insert', 'own profile update']
);
select policies_are(
  'public', 'udi',
  array['own identity readable', 'own identity insert', 'own identity update']
);
select policies_are(
  'public', 'media',
  array['media readable by members', 'own media write']
);
select policies_are(
  'public', 'flashes',
  array['flashes readable by members', 'own flashes write', 'moderators moderate flashes']
);
select policies_are(
  'public', 'missions',
  array['missions readable by members', 'own missions write', 'assignee advances mission']
);
select policies_are(
  'public', 'posts',
  array['posts readable by members', 'own posts write']
);
select policies_are(
  'public', 'notifications',
  array['own notifications readable', 'own notifications update']
);
select policies_are(
  'public', 'audit',
  array['audit readable by admins']
);

select ok(
  (
    select count(*) = 9
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
