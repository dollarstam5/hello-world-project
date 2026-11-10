# Réel — architecture de session invitée éphémère

**Statut :** session invitée serveur implémentée et raccordée au gestionnaire central ; opérations métier invitées encore bloquées.
**Portée :** établir une identité temporaire côté serveur sans compte Auth, sans profil Vitalis et sans historique durable.

## 1. Décision d'architecture

Le mode invité ne doit pas utiliser l'identifiant aléatoire React comme preuve d'identité serveur. Cet identifiant local reste utile uniquement pour l'état d'interface. Pour toute opération multi-requête, le serveur doit délivrer et vérifier une session opaque.

Le dépôt utilise TanStack Start et ses Server Functions pour la logique serveur. Cette voie est préférée aux Edge Functions Supabase dans l'architecture backend actuelle. Le client avec clé de service reste strictement côté serveur et ne doit jamais être importé dans le bundle navigateur.

## 2. Cycle de vie prévu et état d'implémentation

1. **Démarrage** — une Server Function dédiée crée une session invitée après vérification des limites de création et des protections anti-abus.
2. **Identité** — le serveur génère un secret aléatoire cryptographiquement sûr d'au moins 256 bits. Seul son condensat SHA-256 est stocké côté serveur ; le secret brut n'est jamais écrit en base.
3. **Transport** — le secret est remis au navigateur dans un cookie HttpOnly, Secure en production, SameSite=Lax, limité au chemin nécessaire et sans accès JavaScript. Ne pas utiliser localStorage, sessionStorage ou un paramètre d'URL.
4. **Vérification** — chaque requête invitée protégée vérifie le cookie côté serveur, calcule son condensat, retrouve une session non révoquée et non expirée, puis vérifie le droit précis demandé.
5. **Renouvellement** — renouvellement contrôlé, avec rotation du secret et invalidation de l'ancien. Aucun renouvellement ne doit prolonger indéfiniment une session.
6. **Fin** — fermeture explicite, expiration, déconnexion membre ou signal de fin de visite révoque la session et efface le cookie.
7. **Nettoyage** — purge périodique des sessions expirées/révoquées et suppression des données temporaires qui leur sont rattachées.

Le cookie est posé et effacé par les API serveur TanStack Start (`setCookie`, `getCookie`, `deleteCookie`) utilisées dans `reel-guest-session.server.ts`. Les Server Functions ne sont pas protégées par un middleware Auth membre ; elles appliquent elles-mêmes le contrôle d'origine, la validation du cookie et l'usage de la clé de service côté serveur.

## 3. Données serveur minimales

Table technique envisagée : public.reel_guest_sessions.

| Champ        | Rôle                                                        |
| ------------ | ----------------------------------------------------------- |
| id           | Identifiant interne aléatoire de la session                 |
| token_hash   | Empreinte unique du secret, jamais le secret brut           |
| created_at   | Date de création                                            |
| last_seen_at | Dernière activité, mise à jour avec limitation de fréquence |
| expires_at   | Échéance absolue                                            |
| revoked_at   | Révocation explicite, si présente                           |
| purpose      | Usage limité à Réel invité, pas une autorisation générale   |

Aucun auth.users, profiles, email, téléphone, nom civil, coordonnées GPS exactes ou historique de navigation ne doit être créé pour cette session. Ne pas ajouter d'adresse IP ou d'empreinte d'appareil persistante par défaut. Les journaux de sécurité doivent être minimisés et soumis à une durée distincte documentée.

La table est inaccessible directement à anon et authenticated. Les lectures/écritures passent par des fonctions serveur contrôlées. La clé de service ne remplace jamais la validation du jeton et du droit demandé.

## 4. Séparer session invitée et présence Réel

La table membre actuelle reel_presences référence auth.users. Il ne faut ni supprimer cette contrainte ni fabriquer un faux owner_id pour y faire entrer un invité.

Si les invités doivent publier une présence, créer un stockage invité séparé et éphémère, rattaché à reel_guest_sessions.id, avec ses propres règles de visibilité, de durée, de consentement, de quotas et de purge. Une projection serveur commune pourra présenter les profils membre et invité sans exposer leurs identifiants internes.

**La session invitée seule n'autorise pas encore** la découverte de personnes, la publication d'une présence, l'envoi d'un bip ou une mise en relation. Ces droits doivent être définis action par action et vérifiés côté serveur.

## 5. Protections obligatoires

- Vérifier l'origine des requêtes mutantes et conserver une protection CSRF adaptée au cookie.
- Limiter la création, le renouvellement et les opérations par session et par fenêtre temporelle.
- Refuser les sessions absentes, mal formées, expirées, révoquées ou inconnues.
- Comparer les empreintes sans exposer le secret dans les logs ou les messages d'erreur.
- Ne jamais accepter un sessionId fourni par le navigateur comme preuve d'identité.
- Ne jamais accepter un mode guest transmis par le client comme autorisation.
- Refuser par défaut toute action non explicitement inscrite dans la matrice des droits invités.
- À la connexion membre, terminer la session invitée ; aucun rattachement automatique des données.
- Prévoir les scénarios de fermeture du navigateur, perte réseau, rotation de cookie et rejeu d'une ancienne valeur.

## 6. Durées et conservation — décisions encore nécessaires

La durée absolue implémentée est de 60 minutes. Il n'y a pas encore de renouvellement ni de prolongation par activité ; `last_seen_at` n'est volontairement pas actualisé à chaque requête. La limitation anti-abus de création reste à ajouter et à tester. Cette durée technique est provisoire et ne remplace pas une décision produit définitive.

## 7. Tests d'acceptation obligatoires

- Une session invitée peut être créée sans créer de ligne dans auth.users ou profiles.
- Le secret brut n'est jamais stocké en base ni écrit dans les journaux.
- Un cookie absent, invalide, expiré ou révoqué est refusé.
- Une ancienne valeur de cookie est refusée après rotation.
- Un visiteur ne peut pas appeler une opération invitée protégée sans session.
- Un invité ne peut pas utiliser les opérations réservées aux membres.
- Une session ne peut pas accéder aux données d'une autre session.
- Les limites anti-abus et la protection CSRF sont vérifiées.
- La fermeture et la purge suppriment les données temporaires associées.
- La connexion membre révoque la session invitée sans transfert automatique.
- Deux navigateurs/appareils n'obtiennent pas la même identité sans transfert explicite.
- Les droits de découverte, présence, bip et relation sont testés séparément.

## 8. État de livraison et points de blocage

Le dépôt contient maintenant la migration `20261110020000_reel_guest_sessions.sql`, le service serveur `reel-guest-session.server.ts`, les fonctions Start `reel-guest-session.functions.ts` et le test pgTAP 131. Le service crée un secret aléatoire de 256 bits, stocke uniquement son SHA-256, le transmet par cookie `__Host-` HttpOnly/Secure/SameSite=Lax, vérifie expiration/révocation et permet la fermeture explicite. La présence d'un en-tête d'authentification membre empêche le démarrage invité et révoque une éventuelle session invitée lors de sa lecture.

Cela ne signifie pas que le parcours invité Réel complet est activé : aucune opération de découverte, présence, bip ou relation n'accepte encore cette session. Les points restant à prouver avant activation sont :

1. Exécuter la migration sur une base Supabase de test issue de la chaîne standard et exécuter les tests pgTAP 130 et 131.
2. Exécuter lint, tests et build pour confirmer les imports et types du runtime TanStack Start installé.
3. Configurer et vérifier la limitation anti-abus à la couche d'hébergement avant exposition publique.
4. Vérifier que `pg_cron` est présent ou fournir un mécanisme de purge garanti.
5. Valider la durée d'une heure et les droits invités précis pour chaque action Réel.
6. Ajouter des tests serveur de cookies, origine, révocation et transitions membre/invité.

## 9. Règle de livraison

Cette spécification ne rend pas le mode invité opérationnel. L'interface doit continuer à présenter les limites honnêtement et les opérations invitées restent désactivées jusqu'à la livraison du serveur, des migrations et des tests.


## 10. Raccordement au gestionnaire central — 10 novembre 2026

Le fournisseur `AccessModeProvider` appelle maintenant les Server Functions de session invitée :

- au démarrage, il demande la création serveur et ne passe en mode invité qu'après confirmation ;
- au retour dans l'application, il vérifie le cookie et restaure le mode invité uniquement si la session est active et non expirée ;
- à la connexion membre, il efface l'identité locale et demande la révocation de la session invitée ;
- à la fin explicite du mode invité, il efface immédiatement l'identité locale et demande la révocation serveur.

L'identifiant React reste un repère d'interface uniquement. Le cookie opaque HttpOnly est la seule preuve de session invitée côté serveur. Une erreur de création laisse l'application en mode visiteur.

**Limites encore ouvertes :** la session n'autorise aucune opération métier Réel. La découverte, la publication de présence, les bips et les relations restent refusés aux invités. La limitation anti-abus de création, les tests serveur du cookie/origine/révocation, l'exécution des migrations/pgTAP et la vérification du runtime restent nécessaires. La session a une durée absolue de 60 minutes, sans renouvellement.



## 11. Présence temporaire invitée — première tranche serveur

La migration `20261110100000_reel_guest_presence_sessions.sql` ajoute `reel_guest_presences`, table séparée de `reel_presences` et sans référence à `auth.users` ou `profiles`. Elle conserve une position PostGIS exacte uniquement côté service_role. Les rôles navigateur n'ont aucun droit de lecture.

Le serveur retrouve d'abord la session depuis le cookie HttpOnly, puis appelle `create_reel_guest_presence` avec l'identifiant interne de cette session. La fonction SQL vérifie que la session existe, n'est pas révoquée et n'a pas expiré. La présence :
- accepte un consentement explicite, un rayon autorisé et une durée prédéfinie ;
- expire au plus tard à la fin de la session invitée (60 minutes actuellement) ;
- remplace la précédente présence temporaire de cette session ;
- est effacée avec sa position exacte à l'arrêt ou à la révocation ;
- est purgée après expiration par pg_cron si disponible.

Les Server Functions validées par Zod sont `startReelGuestPresence` et `endReelGuestPresence`. Elles n'exposent jamais l'identifiant de session ni les coordonnées stockées en base. Le point est envoyé au serveur uniquement après consentement utilisateur.

**Limite volontaire de cette tranche :** les présences invitées ne sont pas encore incluses dans la découverte des membres ou des invités. Aucun bip, relation, notification ou historique n'est ouvert aux invités. La prochaine tranche doit construire la découverte filtrée PostGIS en tenant compte des deux types de présence, puis les actions de bip invitées sans créer de compte membre. Le test pgTAP 135 est ajouté mais non exécuté.
