# Règles backend

Le backend est **séparé** de l'application. Il ne connaît pas les écrans.

## Répartition

| Élément | Responsabilité |
|---|---|
| Tables | données brutes, rien d'autre |
| RLS | qui voit quoi, qui écrit quoi |
| Server functions | logique lourde, opérations privilégiées |
| Storage | photos et fichiers (buckets privés) |

## Toute nouvelle table publique

Dans la **même migration**, dans cet ordre :

1. `CREATE TABLE public.<nom> (...)`
2. `GRANT` pour les rôles concernés (`authenticated`, `service_role`, `anon` seulement si une politique l'autorise)
3. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
4. `CREATE POLICY ...`

Une table sans `GRANT` est inaccessible : ce n'est pas une option.

## Rôles

Les rôles vivent dans `public.user_roles` (jamais sur le profil). Les politiques les lisent via la fonction `security definer` `public.has_role(_user_id, _role)` pour éviter toute récursion RLS.

## Accès privilégié

Le client à privilèges (service role) contourne les RLS. Il n'est chargé qu'**à l'intérieur d'un handler**, et seulement après avoir vérifié le rôle de l'appelant avec le client authentifié. Jamais pour une lecture ordinaire, jamais pour décider si quelqu'un est administrateur.

## Sync

Les seuls points d'entrée applicatifs de synchronisation sont `/api/sync/pull` et `/api/sync/push`, tous deux authentifiés. Aucun autre chemin n'écrit dans les tables synchronisées depuis le client.

## Révisions

Le trigger `assign_sync_revision` attribue une `revision` monotone globale à chaque écriture. Le client ne la fabrique jamais.
