# Réel — état d'implémentation V1

**État :** découverte et publication de présence approximative raccordées pour les membres actifs ; temps réel multi-appareils, bips UI et mode invité métier encore ouverts.  
**Migration :** `supabase/migrations/20261110010000_reel_presence_and_bips.sql`  
**Tests :** `supabase/tests/database/130_reel_presence_security.test.sql`

## État de l'interface

- La route `/reel` monte `ReelProximityScreen`. Les profils réels ne sont chargés qu'après accord de découverte et réponse du service SQL ; aucun profil de démonstration n'est injecté.
- Les panneaux de préférences et d'activité sont interactifs. Le rayon et la durée sont transmis lors de la publication de présence ; les autres préférences d'affichage restent locales et ne sont pas encore appliquées au service SQL.
- Les onglets Alertes, Bips reçus et Rencontres affichent des états vides honnêtes ; aucun compteur ou événement n'est simulé.
- La page permet à un membre actif de démarrer et d'arrêter sa présence après un consentement distinct, un accès ponctuel à la position et un jeton de zone à usage unique. L'exécution sur une base déployée reste à valider.

## Règle produit confirmée — accès membre et invité

Réel doit accueillir une personne sans lui imposer la création d'un compte Vitalis. Le moteur adapte les possibilités et la conservation au mode d'accès, sans confondre identité provisoire et profil enregistré.

### Membre avec profil enregistré

- Réutiliser uniquement les informations du profil qui sont nécessaires à l'expérience demandée et autorisées par la personne.
- Ne pas recopier automatiquement toutes les données du profil dans chaque présence ou interaction.
- Conserver l'historique uniquement selon les règles validées propres aux comptes et aux éléments concernés.

### Visiteur en mode invité

- Autoriser l'accès aux services Réel prévus pour les invités sans exiger un compte permanent.
- Attribuer une identité provisoire limitée à la session, distincte d'un identifiant de membre et d'un profil Vitalis.
- Ne pas créer ni enregistrer de profil invité dans les tables durables de profils Vitalis.
- Limiter les données à ce qui est indispensable à la session et aux services utilisés. Les éléments temporaires nécessaires au fonctionnement temps réel devront avoir une durée de vie courte, ne pas devenir un historique et être supprimés à la fin de la visite ou à l'expiration de la session.
- À la fin de la visite, réinitialiser l'identité provisoire et les données temporaires associées. Aucun rattachement rétroactif à un compte ne doit être fait sans action et consentement explicites.
- Proposer, sans pression et au bon moment, de créer un compte ou d'enrichir un profil pour retrouver des informations et accéder aux possibilités réservées aux membres.

### Conséquence technique

Le modèle actuel, qui exige un utilisateur Supabase authentifié et un profil actif pour démarrer une présence, **ne satisfait pas encore cette règle**. Il ne faut pas le contourner en créant un faux profil membre. Il faut concevoir un parcours invité séparé, avec identité temporaire, autorisations limitées et mécanisme d'expiration/nettoyage. La présence en direct peut nécessiter un état technique éphémère pour être visible aux autres appareils ; cet état ne doit pas être confondu avec un enregistrement durable dans la base des profils Vitalis. Le choix du transport temporaire et sa politique de suppression restent à spécifier et tester.


## Gestion centrale des modes d'accès — fondation ajoutée

Le domaine partagé `src/domains/access-mode/` est maintenant monté à la racine de l'application via `AccessModeProvider`. Les moteurs peuvent lire `useAccessMode()` pour distinguer visiteur, invité et membre, sans dupliquer la détection de session.

- Le mode membre repose sur la session Supabase Auth et lit uniquement `status` et `deleted_at` du profil pour distinguer actif, invité/incomplet, suspendu, fermé ou invérifiable.
- Le mode invité crée uniquement un identifiant aléatoire conservé en mémoire côté application. Il n'est pas écrit dans Supabase Auth, `profiles`, `localStorage` ou `sessionStorage`.
- L'identité temporaire est effacée à la fin de la session de page, à la connexion d'un membre ou par fermeture explicite.
- Cette fondation ne fournit pas encore de session invitée multi-appareils, de jeton serveur, de transport temps réel ou de droits Réel. Les opérations invitées restent désactivées jusqu'à livraison et test de ces protections.

Document d'architecture : [Gestionnaire central des modes d'accès](../../02-architecture/access-mode-manager.md).
- Le moteur commun `evaluateEngineAccess()` distingue présentation, entrée dans un moteur et opération métier. Un invité peut ouvrir le parcours d'entrée Réel, mais toute opération Réel reste soumise à une vérification serveur. Les autres entrées invitées restent refusées par défaut.
- Les décisions sont couvertes par `tests/access-mode/engine-access.test.ts` ; ces tests sont ajoutés au dépôt mais ne sont pas encore exécutés dans cet environnement.

## Ce qui est ajouté

- Présences éphémères liées à un compte authentifié actif.
- Consentement explicite obligatoire pour démarrer une présence.
- Durées autorisées : 30 min, 1 h, 2 h, 3 h, 6 h, 12 h ou 24 h.
- Rayons enregistrables : 10 m, 25 m, 50 m, 100 m ou 1 km.
- Un seul état de présence active par compte.
- Aucune colonne de latitude, longitude ou coordonnées GPS dans le modèle Réel.
- Lecture des présences limitée au propriétaire actif et aux membres actifs disposant d'une session de découverte serveur valide ou d'une présence active dans la zone concernée.
- Projection de découverte limitée au nom affiché, à l'identifiant d'avatar, à la description, à l'intitulé de zone et aux horaires utiles. Aucun téléphone, GPS exact ou distance précise n'est retourné.
- Bips privés aux deux participants, sans message libre, avec identifiant de requête client pour rendre les renvois réseau idempotents.
- Un seul bip en attente par paire de personnes, quel que soit le sens.
- Acceptation réservée au destinataire ; elle crée une mise en relation unique. Refus et retrait sont également contrôlés côté serveur.
- Les bips en attente expirent 24 h après la première fin ou échéance des deux présences associées. Un bip accepté est retiré de la liste et sa trace technique temporaire expire au plus tard 24 h après l'acceptation ; la relation créée reste durable. Aucun bip n'est ajouté à la table Notifications.
- Nettoyage des bips expirés et des anciennes présences via fonction serveur, avec planification pg_cron si l'extension est disponible et nettoyage différé lors des appels Réel sinon.
- Publication Postgres Changes activée pour les trois tables si la publication Supabase `supabase_realtime` existe ; les événements restent soumis aux règles RLS.

## Limites à ne pas masquer

1. **La zone est une clé HMAC opaque calculée côté serveur à partir d'une grille d'environ 200 m, pas un GPS.** Le secret serveur doit être configuré et la précision doit être validée sur appareil.
2. **Le rayon est enregistré mais le calcul spatial n'est pas encore appliqué.** La découverte couvre la cellule et ses huit voisines ; elle ne doit afficher ni distance ni prétendre respecter exactement le rayon métrique choisi.
3. **La publication serveur ne suffit pas à rendre l'interface temps réel.** `src/lib/platform/realtime.ts` reste un bus local en mémoire. Le client Supabase Realtime, les abonnements privés, la reprise après reconnexion et le nettoyage des abonnements restent à raccorder.
4. **L'outbox locale n'est pas encore branchée aux commandes Réel.** Les RPC de bip sont idempotentes si le client réessaie avec le même `client_request_id`, mais l'enregistrement local et la reprise automatique après coupure restent à intégrer.
5. **La mise en relation est créée à l'acceptation, mais la conversation Réel n'est pas encore créée.** Les messages, les états envoyé/reçu/lu, le partage de zone ponctuel, la fermeture de relation et la conversation en lecture seule après fermeture restent à livrer.
6. **Le parcours invité n'est pas encore validé de bout en bout.** Les commandes actuelles exigent un utilisateur Supabase authentifié avec un profil actif ; il faut confirmer le comportement du mode invité sur une session anonyme réelle.

## Contrat de sécurité

- Les clients ne peuvent pas insérer, modifier ou supprimer directement les présences, bips ou relations.
- Les écritures passent par des fonctions SQL contrôlant l'identité, le consentement, l'état des présences et le rôle de chaque participant.
- Les présences ne sont lisibles que tant qu'elles sont actives et dans la même clé de zone.
- Les bips ne sont lisibles que par leurs deux participants, tant qu'ils sont en attente et non expirés.
- Les relations ne sont lisibles que par leurs deux participants.
- Les fonctions exposées refusent les visiteurs anonymes.
- Les bips acceptés disparaissent de la liste des bips en attente ; la relation correspondante est conservée séparément.

## Vérifications requises avant activation utilisateur

- Exécuter la migration sur une base Supabase de test issue de la chaîne standard.
- Faire passer le test pgTAP 130 et les tests RLS existants.
- Vérifier la publication et les abonnements Postgres Changes sur deux appareils.
- Tester les coupures réseau et les reprises avec un même identifiant de requête.
- Valider la précision de la zone opaque et les règles de voisinage avant d'afficher une proximité.
- Raccorder les conversations uniquement après validation de leur autorisation et de leur cycle de vie.

**Le socle SQL n'est pas une preuve que le parcours Réel est déjà disponible dans l'application.**


## Session invitée serveur — conception préparée

Le document [Architecture de session invitée éphémère](./reel-guest-session-architecture.md) fixe les garde-fous du prochain lot : secret généré côté serveur, empreinte seule en base, cookie HttpOnly, contrôle serveur par opération, rotation, révocation et purge. Il sépare strictement la session invitée de la table des présences membre qui référence auth.users.

**Aucune session invitée serveur n'est encore implémentée.** La fondation front-end reste une identité en mémoire et n'autorise aucune opération métier. Le parcours invité réel reste désactivé jusqu'à validation des durées et droits, confirmation de l'API cookie TanStack Start, livraison des migrations et réussite des tests.


## Session invitée serveur — première tranche technique ajoutée

- Migration `20261110020000_reel_guest_sessions.sql` : table isolée, RLS activée, aucun accès direct `anon`/`authenticated`, accès réservé au rôle serveur.
- Service `src/domains/presence/api/reel-guest-session.server.ts` : secret aléatoire 256 bits, empreinte SHA-256 seule en base, cookie `__Host-vitalis_reel_guest` HttpOnly/Secure/SameSite=Lax, vérification de session, expiration, révocation et fermeture explicite.
- Fonctions `startReelGuestSession`, `getReelGuestSession`, `endReelGuestSession` dans `reel-guest-session.functions.ts`.
- Migration : purge des sessions expirées et révoquées planifiée via pg_cron si disponible.
- Test pgTAP 131 : privilèges, RLS, absence de données membre/GPS et droit de purge.

**Limites actuelles :** les opérations métier Réel n'acceptent pas encore cette session ; aucune interface ne la démarre automatiquement. La durée d'une heure est un paramètre technique provisoire, sans renouvellement. Les limites anti-abus de la couche d'hébergement et la présence effective de pg_cron doivent être vérifiées. Migration, tests et build n'ont pas été exécutés ici.


## Politique d’accès Réel — première tranche

- Ajout de `src/domains/presence/policy/reel-access-policy.ts` : règles explicites par opération (entrée, présence, découverte, bips et fermeture de relation).
- Les visiteurs sont refusés pour les opérations métier.
- Les invités peuvent entrer dans le parcours, mais restent bloqués pour toute opération métier tant que les RPC ne savent pas vérifier leur session invitée.
- Le démarrage d’une présence exige le consentement précis `reel_presence`.
- Les rôles émetteur/destinataire sont distingués pour retrait, acceptation et refus d’un bip.
- Les opérations Réel ne sont pas mises en file hors connexion dans cette tranche.
- Conversation, messages, partage de zone et signalement restent explicitement indisponibles.
- Tests Vitest ajoutés dans `tests/access-mode/reel-access-policy.test.ts`.

**État de preuve :** code et tests ajoutés à la branche ; exécution Vitest, lint, build, migration Supabase et tests pgTAP non effectués. Cette politique ne rend pas le moteur activable en production à elle seule.


## Service client Réel — première connexion aux RPC

- Ajout de `src/domains/presence/api/reel-presence.client.ts`.
- Le service appelle les RPC SQL existantes pour démarrer/terminer une présence, découvrir les présences d'une zone, envoyer un bip, accepter/refuser/retirer un bip et consulter les bips en attente.
- Les paramètres de présence sont validés côté client avant appel ; le serveur reste responsable de la validation finale.
- Les identifiants de requête de bip sont uniques par défaut pour permettre les tentatives idempotentes.
- Les types des réponses sont déclarés localement car le snapshot généré `src/integrations/supabase/types.ts` ne contient pas encore les fonctions Réel. Le cast RPC est isolé dans un seul adaptateur et devra être supprimé après régénération des types depuis le schéma appliqué.

**Non raccordé à l'écran :** aucun résolveur de zone opaque fiable n'a encore été identifié dans l'application. Le service exige donc une `zoneKey` fournie par ce résolveur et ne fabrique pas de clé à partir du GPS ou du nom de quartier. L'écran Réel continue de ne présenter aucune présence simulée.

**Vérifications :** les appels RPC, la migration, les tests pgTAP, le lint et le build n'ont pas été exécutés dans cette tranche.

## Service client Réel — durcissement des entrées

- Vérification à l'exécution des rayons et durées autorisés, même si un appel contourne les types TypeScript.
- Validation du format UUID pour les identifiants de présence, de bip et de requête idempotente.
- Création de l'identifiant de requête protégée lorsque l'API cryptographique du navigateur n'est pas disponible ; l'action échoue clairement au lieu de générer un identifiant fragile.
- Refus des limites non numériques et contrôle que les RPC de listes renvoient bien un tableau.
- Les erreurs de réponse vide sont remontées explicitement.

**Point de sécurité à traiter avant activation :** la migration vérifie le profil actif au démarrage d'une présence et lors de la découverte des autres présences, mais les RPC de bip et de consultation/commande des bips doivent aussi être auditées pour garantir qu'un compte suspendu ou fermé ne puisse pas continuer à agir via une présence déjà ouverte. La fermeture de sa propre présence doit, elle, rester possible pour permettre de quitter le service.

**Vérifications :** ces validations sont ajoutées au client, mais aucun test automatisé, lint, build, appel RPC réel ou test sur appareil n'a encore été exécuté.

## Contrôles de profil actif — durcissement SQL

- Migration `20261110030000_reel_active_profile_guards.sql` : ajout d'un contrôle central qui exige un profil membre actif et non supprimé pour consulter une zone, lister les bips et exécuter une commande sur un bip.
- Les commandes d'acceptation, de refus et de retrait revérifient le profil au moment de l'action. Une présence ouverte avant une suspension ne suffit donc plus à autoriser ces actions.
- Migration `20261110040000_reel_bip_active_participants.sql` : contrôle des deux profils au moment de l'insertion d'un nouveau bip.
- La fin de sa propre présence reste volontairement autorisée même si le profil n'est plus actif, afin que la personne puisse arrêter immédiatement le partage de sa présence.

**Limite à vérifier :** une répétition idempotente d'un ancien identifiant de requête peut encore retrouver le bip déjà créé avant la suspension ; elle ne crée pas de nouvelle action métier. Ce comportement devra être confirmé par un test SQL dédié et éventuellement resserré selon la politique produit.

**Vérifications :** les deux migrations et les tests SQL correspondants sont ajoutés à la branche, mais n'ont pas été appliqués sur une base de test. pgTAP, lint, build et tests sur appareils restent à exécuter.


## Audit SQL complémentaire — suspension et idempotence

L'audit des fonctions existantes a révélé deux points à corriger avant de poursuivre le raccordement :

- send_reel_bip recherchait un identifiant de requête déjà traité avant de revérifier l'état actif du compte. Une répétition idempotente pouvait donc retourner un ancien bip après suspension. La migration 20261110050000_reel_bip_replay_and_listing_guards.sql place le contrôle du profil avant cette recherche.
- list_reel_bips() déclenchait le nettoyage des éléments expirés tout en étant déclarée STABLE. Or ce nettoyage modifie des données. La fonction est maintenant volatile (comportement par défaut de PostgreSQL), ce qui permet le nettoyage pendant la consultation.

Le test pgTAP 130 ajoute des vérifications pour le refus de consultation et de commande après suspension, tout en conservant le droit d'arrêter sa propre présence. Le plan de test est ajusté en conséquence.

**À confirmer sur une base de test :** migration, pgTAP, lint et build n'ont pas été exécutés dans cet environnement.

## Correction SQL — volatilité de la liste des bips

La migration `20261110060000_reel_bip_listing_volatile.sql` fixe explicitement `list_reel_bips()` en `VOLATILE`. PostgreSQL conserve la propriété de volatilité d'une fonction lors d'un `CREATE OR REPLACE FUNCTION` si elle n'est pas redéclarée ; le commentaire de la migration précédente ne suffisait donc pas à modifier la propriété héritée `STABLE`. Cette correction explicite est nécessaire puisque la fonction déclenche le nettoyage des éléments expirés, qui effectue des écritures.

## Audit des tests SQL — points à corriger avant exécution

La lecture du test pgTAP 130 a également révélé des blocs dollar-quoted mal formés (délimiteurs `$SELECT ... $`) et un ordre de scénarios incohérent : certains profils sont suspendus avant les opérations ultérieures que le test attend pourtant comme réussies. Le test ne doit donc pas être considéré comme exécutable ou probant dans son état actuel. Il faut réorganiser les scénarios pour créer et accepter le bip avec deux profils actifs, puis tester séparément les refus après suspension, sans empêcher les scénarios nominaux. Aucun résultat de test n'est revendiqué.

## Tests pgTAP — scénario de sécurité réorganisé

Le test `130_reel_presence_security.test.sql` a été réorganisé pour exécuter d'abord le parcours nominal avec trois profils actifs : démarrage avec consentement, découverte dans une zone partagée, visibilité RLS, envoi et répétition idempotente d'un bip, fin de présence, acceptation et création de la relation. Les suspensions sont maintenant testées à la fin, sans invalider les scénarios nominaux.

- Correction des délimiteurs dollar-quoted qui étaient syntaxiquement incorrects.
- Vérification qu'un profil suspendu ne peut plus consulter les bips ni rejouer une commande d'acceptation.
- Vérification qu'un profil suspendu peut toujours arrêter sa propre présence.
- Vérification qu'un expéditeur suspendu ne peut pas rejouer un ancien identifiant de requête.
- Assertion pgTAP ajoutée pour vérifier que `list_reel_bips()` est bien `VOLATILE`, en cohérence avec le nettoyage qu'elle déclenche.

Le plan pgTAP est maintenant de 24 assertions. **Le fichier a été corrigé, mais le test n'a pas été exécuté sur une base Supabase ; la syntaxe et les comportements doivent encore être confirmés par exécution.**

## Audit statique croisé — migrations et pgTAP 130/131

Une relecture croisée des migrations Réel 100 à 600, des deux tests pgTAP et du schéma de profils a été effectuée sur cette branche.

- Les colonnes utilisées par le test pour les présences (owner_id, status, expires_at), les bips (client_request_id, expires_at) et les relations (participant_low, participant_high, status) correspondent aux définitions SQL consultées.
- Les signatures appelées par le test correspondent aux fonctions déclarées : démarrage avec six paramètres, envoi de bip avec deux UUID, commande avec UUID et action, liste des bips sans paramètre.
- L'insertion des utilisateurs de test déclenche le mécanisme existant de création du profil ; le statut par défaut est actif et la suppression est nulle. Les mises à jour de suspension sont volontairement exécutées après retour au rôle propriétaire du test.
- Les droits attendus par les tests invités correspondent à la migration 200 : accès direct refusé aux rôles navigateur, accès de service réservé au serveur.
- La migration 600 corrige explicitement la volatilité de list_reel_bips() après le remplacement de fonction de la migration 500.

**Résultat de cet audit :** aucune divergence de nom de colonne ou de signature n'a été relevée dans les éléments relus. Cela ne valide ni la syntaxe par exécution, ni les politiques sur une base réelle, ni les migrations appliquées. Les tests 130 et 131 restent à lancer avec bun run test:db sur une pile Supabase locale/jetable (CLI et Docker requis), jamais sur la production. Aucun résultat CI vert n'est actuellement confirmé pour le SHA de la PR.

## Chaîne CI — contrôle de déclenchement

Le workflow `.github/workflows/quality.yml` contient bien une étape `Database RLS tests` qui démarre Supabase, vérifie la présence des fichiers pgTAP puis exécute `bun run test:db`, avant d'arrêter la pile locale. Le workflow est configuré pour les pull requests ciblant `main`.

Lors du contrôle du commit courant de la PR, GitHub ne retourne toutefois aucun workflow associé et aucun statut de vérification. La présence de cette étape dans le fichier YAML ne prouve donc pas qu'elle a été exécutée. Il faut vérifier que GitHub Actions est activé pour le dépôt et que le workflow `Quality` est autorisé, puis obtenir un run associé au SHA exact de la PR. Si aucun run ne démarre après un nouveau commit, le déclenchement ou les permissions Actions doivent être corrigés avant de considérer les tests comme validés.


## Consentement de position propre à Réel — tranche interface

- À chaque nouvelle entrée dans la page Réel, le moteur présente son propre choix d'utilisation de la position, même si un autre moteur Vitalis a déjà obtenu une autorisation.
- Aucune demande de position ne part au chargement : le navigateur ou le téléphone n'est sollicité qu'après le bouton explicite « Activer ma position ».
- L'autorisation système et l'accord d'utilisation dans Réel sont deux contrôles distincts. Une autorisation déjà accordée au niveau du téléphone ne vaut pas accord Réel.
- « Pas maintenant » laisse la page accessible en mode calme. La découverte locale, les réactions, les bips et les alertes locales sont suspendus ; les réglages et les relations déjà établies restent consultables.
- Une demande refusée ou indisponible laisse également Réel en mode calme, avec une explication et une possibilité de réessayer.
- La demande technique est une lecture ponctuelle (getCurrentPosition), sans suivi continu, sans arrière-plan et sans sauvegarde locale des coordonnées dans cette tranche.
- L'accord de localisation ne démarre pas automatiquement la présence publique. Le partage de sa propre présence exige toujours le consentement métier distinct reel_presence.

**Limite d'intégration à conserver visible :** après l'accord de localisation, la découverte réelle n'est pas encore activée. Aucun résolveur de zone opaque fiable n'a été identifié et le client de présence ne doit pas fabriquer une clé de zone à partir du GPS. Le raccordement de la zone, le filtrage spatial et les abonnements temps réel restent à livrer et à tester. Les propositions globales et la reprise de la dernière activité ne disposent pas encore de sources métier connectées ; aucun contenu fictif ne doit être affiché.


## Mise à jour — découverte indépendante et présence approximative (10 novembre 2026)

Cette section remplace les descriptions antérieures qui liaient la découverte à la publication d'une présence.

### Deux autorisations distinctes

1. **Découverte** — autorise Réel à observer les activités dans le secteur approximatif de l'utilisateur. Elle ne rend pas son propre profil visible.
2. **Ma présence** — autorise séparément la publication d'une présence approximative, avec une description, un rayon enregistré et une durée. Elle ne donne pas automatiquement accès à la découverte.

L'autorisation du système d'exploitation est demandée uniquement après l'action volontaire correspondante dans Réel. Une permission accordée à Flash, Scan ou Radar n'est jamais réutilisée comme consentement Réel. La présence publique exige aussi le consentement métier distinct `reel_presence`.

### Résolveur de zone ajouté

- `src/domains/presence/api/reel-zone.functions.ts` expose une fonction serveur protégée par `requireSupabaseAuth`.
- `src/domains/presence/api/reel-zone.server.ts` réduit la position reçue à une cellule de grille d'environ 200 m, puis produit un jeton opaque HMAC côté serveur.
- Les coordonnées GPS brutes ne sont ni enregistrées ni renvoyées au navigateur par le résolveur.
- Pour la découverte, le serveur ouvre une session de découverte de 15 minutes sur la cellule et ses huit cellules voisines.
- Pour publier sa présence, le serveur émet une autorisation à usage unique de 5 minutes. La fonction SQL consomme cette autorisation et choisit elle-même la zone ; le navigateur ne peut plus fournir librement une clé de zone.
- Le secret `REEL_ZONE_HMAC_SECRET` (32 caractères aléatoires minimum) doit être configuré dans l'environnement serveur avant l'activation du résolveur.

### Découverte connectée

- La page demande son propre accord de découverte à chaque nouvelle entrée.
- Après accord, elle obtient une position ponctuelle, demande au serveur la zone approximative et charge les présences réelles via `list_reel_discovery_presence`.
- La fonction SQL permet de découvrir sans publier sa propre présence.
- Seuls les profils actifs et les présences actives renvoyés par le serveur sont affichés. Aucun résultat de démonstration, distance exacte ou avatar public non autorisé n'est inventé.
- La session de découverte expire après 15 minutes ; elle est réouverte après un nouveau consentement.

### Activation de sa propre présence

- Le panneau de gestion présente un accord séparé, une courte description, un choix de rayon et une durée.
- Une nouvelle lecture ponctuelle de position est demandée après l'action « Activer ma présence ».
- La publication utilise un jeton serveur à usage unique et le consentement `reel_presence`.
- L'utilisateur peut retrouver sa présence active à l'ouverture de la page et l'arrêter. L'arrêt reste distinct du consentement à publier.

### Limites toujours ouvertes

- La grille d'environ 200 m est une approximation de zone, pas une distance réelle. La recherche couvre la cellule et ses huit voisines ; le rayon choisi (10 m à 1 km) est enregistré mais n'est pas encore appliqué à un calcul de distance fiable. Aucun libellé de distance exacte ne doit être affiché.
- Le temps réel multi-appareils, les abonnements Realtime, les bips dans l'interface et les notifications ne sont pas encore raccordés.
- Le mode invité peut entrer dans Réel, mais ses opérations métier restent bloquées : la session invitée serveur n'est pas reliée au résolveur ni aux RPC de découverte/présence. Le visiteur reste limité aux présentations publiques.
- Les propositions globales et l'historique affichés en mode calme restent des emplacements honnêtes tant que leurs sources ne sont pas connectées.

### Matrice réelle des modes d'accès

| Mode | Entrée Réel | Découverte | Publication de présence | Bips |
| --- | --- | --- | --- | --- |
| Visiteur | Présentation publique seulement | Non | Non | Non |
| Invité | Parcours Réel accessible | Non, pas encore raccordée | Non, pas encore raccordée | Non |
| Membre avec profil actif | Oui | Oui, après accord propre à Réel | Oui, après accord séparé `reel_presence` | RPC serveur disponibles, interface à raccorder |
| Profil membre invité/incomplet, suspendu, fermé, manquant ou en erreur | Accès métier refusé | Non | Non | Non |

Les statuts ci-dessus décrivent le code présent dans la branche, pas une validation sur une base déployée. Les migrations et tests doivent encore être exécutés.


**Mise à jour de référence :** la section « Mise à jour — découverte indépendante et présence approximative » ci-dessous décrit l'état le plus récent et prévaut sur les descriptions historiques antérieures.


## Mise à jour — rayon métrique réel avec PostGIS

La branche ajoute une nouvelle migration `20261110080000_reel_postgis_metric_radius.sql`.

- Les points de découverte et de présence sont calculés côté serveur et stockés temporairement dans des tables PostGIS privées, accessibles uniquement au rôle `service_role`.
- Le navigateur ne reçoit jamais les coordonnées précises ni la distance calculée.
- La découverte utilise `ST_DWithin(geography, geography, radius_m)` : le rayon de visibilité choisi lors de la publication est appliqué en mètres, avec le calcul géographique PostGIS.
- Les points de présence sont supprimés lorsque la présence est arrêtée ou passe à un état non actif. Les points de découverte expirent après 15 minutes ; les autorisations de publication expirent après 5 minutes et sont à usage unique.
- La clé HMAC reste un identifiant opaque complémentaire ; elle ne sert plus à approximer le rayon métrique.
- Le résolveur serveur utilise maintenant les RPC de création de points privés, sans insertion directe de coordonnées via le client navigateur.
- Les tests pgTAP 130 et 132 ont été adaptés aux points PostGIS. Le nouveau test 133 vérifie un cas à environ 5 m, un cas à environ 22 m avec rayon de 10 m, puis le même écart avec rayon de 25 m, ainsi que l'absence d'accès direct des rôles navigateur aux tables de coordonnées.

**Limites et précautions :** le GPS d'un appareil comporte une marge d'erreur ; un rayon de 10 m ne signifie donc pas une précision physique garantie à 10 m. Le calcul PostGIS est métrique, mais la qualité du résultat dépend de la précision de la position fournie. Les migrations et tests ne sont pas encore exécutés dans une base locale ou distante. La disponibilité et le schéma d'installation de PostGIS dans le projet Supabase doivent être confirmés à l'application de la migration. Le secret serveur `REEL_ZONE_HMAC_SECRET` reste requis pour le jeton opaque de présence.

- Le contrôle des bips utilise également PostGIS : l'envoi est refusé si le point de l'expéditeur ne se trouve pas dans le rayon de visibilité de la présence destinataire. Deux personnes dans des cellules HMAC différentes peuvent donc interagir si le calcul métrique l'autorise.
- Le test pgTAP 134 couvre l'envoi d'un bip entre deux cellules HMAC distinctes lorsque la distance réelle est dans le rayon du destinataire.
