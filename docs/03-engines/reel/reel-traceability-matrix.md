# Réel — matrice de traçabilité V1

**Statut du document :** consolidation des décisions fonctionnelles connues.  
**Règle de preuve :** une décision validée n'est pas une preuve d'implémentation. Les statuts techniques et les tests doivent être vérifiés séparément.

## 1. Statuts utilisés

| Statut      | Signification                                         |
| ----------- | ----------------------------------------------------- |
| VALIDÉE     | Décision fonctionnelle approuvée                      |
| À SPÉCIFIER | Détail technique ou règle secondaire non confirmé     |
| À TESTER    | Test attendu identifié, exécution ou preuve à fournir |
| NON VÉRIFIÉ | Aucun élément du dépôt ne prouve le comportement      |
| OUVERT      | Décision ou raccordement encore incomplet             |

## 2. Décisions A et B

| Décision | Contenu retenu                                                                                                                                                                                                                                                                                                               | Statut      | Traçabilité                                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| A        | Option de parcours antérieure non retenue au profit du parcours B. Le libellé et le détail complets de cette variante doivent rester rattachés à leur compte rendu source ; ils ne sont pas reconstitués ici.                                                                                                                | NON RETENUE | Aucun comportement ne doit être implémenté à partir d'une supposition sur A.                                                     |
| B        | Parcours de contact rapide par bip depuis une petite carte de profil. Le destinataire peut accepter directement ou consulter le profil avant de répondre. Les bips reçus sont accessibles depuis un compteur et une feuille de liste avec avatar et courte description. Ce choix évite un long parcours de mise en relation. | VALIDÉE     | Le bip ne contient pas de message libre. L'acceptation crée une mise en relation unique. Implémentation et tests : NON VÉRIFIÉS. |

## 3. Décisions C — expérience et interactions

### C-01 — aperçu d'une personne

| Point                   | Décision fonctionnelle                                                                                                                                                                                                                                                                                    | Statut   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| C-01                    | Afficher les informations utiles à la décision : nom, photo ou avatar, intention actuelle et distance approximative. L'âge, une courte présentation et les centres d'intérêt sont facultatifs. Le téléphone et la position exacte restent privés. Le contact direct n'est pas possible avant acceptation. | VALIDÉE  |
| C-01 — libellé d'action | Le libellé ancien « Ça m'intéresse » ne doit pas être repris comme action principale ; le parcours B utilise un bip.                                                                                                                                                                                      | REMPLACÉ |

### C-02 — bip et mise en relation

| Point                  | Décision fonctionnelle                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Statut  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| C-02                   | Un bip est une demande courte, sans texte libre. Le destinataire peut accepter ou refuser. Une seule demande en attente est conservée par paire et son retrait est possible. Les bips en attente, envoyés ou reçus, sont conservés pendant 24 h après la fermeture de la présence. Les bips reçus restent accessibles uniquement dans Réel, jamais dans Notifications. Ils expirent ensuite, sans historique permanent des bips non acceptés. Le point de départ exact des 24 h reste à spécifier. | VALIDÉE |
| C-02 — acceptation     | L'acceptation crée une mise en relation unique et durable. Le bip accepté quitte les bips reçus ; l'acceptation est signalée à son auteur. Les compteurs ne doivent pas compter deux fois le même événement.                                                                                                                                                                                                                                                                                       | VALIDÉE |
| C-02 — fin de relation | La fermeture par l'une des deux personnes ferme la relation pour les deux, désactive la communication associée, demande confirmation et informe l'autre personne.                                                                                                                                                                                                                                                                                                                                  | VALIDÉE |
| C-02 — trace           | Seule une trace technique minimale de l'événement (date, état, événement) est conservée pour cette fermeture ; aucun historique de conversation n'est créé par cette action.                                                                                                                                                                                                                                                                                                                       | VALIDÉE |

### C-03 — conversation liée à une mise en relation

| Point  | Décision fonctionnelle                                                                                                        | Statut  |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- | ------- |
| C-03.1 | La conversation est créée automatiquement après acceptation de la mise en relation.                                           | VALIDÉE |
| C-03.2 | Les deux personnes peuvent écrire immédiatement après l'ouverture de la conversation.                                         | VALIDÉE |
| C-03.3 | Texte uniquement : pas de média ni d'appel en V1.                                                                             | VALIDÉE |
| C-03.4 | Le partage de zone est volontaire et ponctuel ; il ne révèle jamais le GPS exact et ne crée aucun suivi continu.              | VALIDÉE |
| C-03.5 | Notifications internes et notifications push si elles sont autorisées.                                                        | VALIDÉE |
| C-03.6 | Les états envoyé, reçu et lu sont distingués.                                                                                 | VALIDÉE |
| C-03.7 | Un message n'est pas modifiable. Son auteur peut le retirer de son propre affichage ; la copie du destinataire reste visible. | VALIDÉE |
| C-03.8 | Limite de 1 000 caractères par message.                                                                                       | VALIDÉE |
| C-03.9 | Le signalement est accessible depuis la conversation.                                                                         | VALIDÉE |

### C-04 — fin et accès à la conversation

| Point         | Décision fonctionnelle                                                                                                                                                                                                                                                                      | Statut      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| C-04.1        | Après la fin de la relation, la conversation reste accessible en lecture seule aux deux personnes. Les anciens messages sont conservés, l'envoi est désactivé et un message informatif explique la situation. Aucun nouveau contact ne peut être initié depuis cette ancienne conversation. | VALIDÉE     |
| C-04.2        | La fin de relation exige une confirmation explicite et est définitive ; la relation ne peut pas être réactivée depuis cette conversation.                                                                                                                                                   | VALIDÉE     |
| C-04.3        | Une formulation de message de confirmation a été proposée, mais son libellé exact n'est pas attesté comme validé.                                                                                                                                                                           | À SPÉCIFIER |
| C-04.4–C-04.5 | Le détail des décisions n'est pas reproduit dans les éléments récupérés. Ne pas compléter par déduction.                                                                                                                                                                                    | OUVERT      |

## 4. Décisions P — confidentialité et conservation

| Décision | Règle                                                                                                                                                                                        | Statut  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| P-01     | Une conversation fermée affiche exactement : « Cette conversation n'est plus disponible pour l'envoi de messages. »                                                                          | VALIDÉE |
| P-02     | La personne peut partager volontairement et ponctuellement une zone approximative, jamais son GPS exact ni un suivi de déplacement.                                                          | VALIDÉE |
| P-03     | Masquer un message le retire uniquement de l'affichage de son auteur ; la copie du destinataire est conservée.                                                                               | VALIDÉE |
| P-04     | À expiration, la présence disparaît de Réel et du profil, sans historique utilisateur des anciennes présences. Une conservation technique séparée peut subsister selon une durée documentée. | VALIDÉE |

**Distinctions importantes :** les bips non acceptés expirent après 24 h et ne disposent pas d'historique permanent. Les mises en relation acceptées sont durables. Le mode invité ne conserve pas les données personnelles de session après la fin de celle-ci ; l'historique d'un compte Vitalis suit des règles de conservation distinctes. La décision d'archivage DEC-046 prévoit six mois de conservation après archivage, puis une suppression définitive, avec suppression de l'historique possible à la demande et sans export. La portée exacte de cet archivage (conversations, relations ou autres éléments) doit être reliée au document source avant implémentation ; elle ne doit pas être appliquée aux bips non acceptés.

## 5. Règles d'accès — membre et invité

| Exigence | Règle fonctionnelle                                                                                                                                                                                                            | Statut                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| ACC-01   | Une personne peut accéder au mode Réel invité sans posséder de compte Vitalis.                                                                                                                                                 | VALIDÉE                                      |
| ACC-02   | Vitalis attribue à l'invité une identité provisoire propre à sa session ; elle ne constitue pas un profil membre et ne doit pas être enregistrée dans les tables durables de profils.                                          | VALIDÉE                                      |
| ACC-03   | L'accès invité est limité aux services et actions autorisés pour ce mode. Le moteur adapte le parcours selon le mode d'accès, sans inventer de droits ni demander systématiquement les mêmes informations qu'à un membre.      | VALIDÉE                                      |
| ACC-04   | À la fin de la visite ou à l'expiration de la session, l'identité provisoire et les données temporaires associées sont réinitialisées. Aucun historique invité durable n'est conservé.                                         | VALIDÉE                                      |
| ACC-05   | Les informations temporaires indispensables au fonctionnement temps réel doivent être éphémères, minimisées, protégées et supprimées à la fin de la session ou à leur échéance. Elles ne sont pas un profil Vitalis.           | VALIDÉE — architecture technique À SPÉCIFIER |
| ACC-06   | Vitalis peut proposer à l'invité de créer un compte ou de compléter un profil afin de retrouver des informations et d'accéder à davantage de possibilités. Cette démarche reste facultative et nécessite une action explicite. | VALIDÉE                                      |
| ACC-07   | Un invité ne devient jamais membre par conversion automatique. Aucun transfert ou rattachement de données temporaires à un compte ne se fait sans consentement explicite.                                                      | VALIDÉE                                      |
| ACC-08   | Un membre n'expose que les informations de son profil nécessaires à l'expérience et autorisées ; les données du profil ne sont pas recopiées intégralement dans chaque présence ou interaction.                                | VALIDÉE                                      |

### Tests attendus pour les accès

- ACC-01-T01 : ouvrir Réel sans compte et sans créer de profil membre.
- ACC-02-T01 : vérifier qu'une identité provisoire est distincte de tout identifiant de membre.
- ACC-03-T01 : vérifier les limites d'actions et de données propres au mode invité.
- ACC-04-T01 : terminer une visite et vérifier la réinitialisation ; ACC-04-T02 : vérifier le nettoyage après expiration/fermeture inattendue.
- ACC-05-T01 : vérifier que l'état temps réel temporaire n'est pas écrit dans les tables durables de profils ni conservé en historique.
- ACC-06-T01 : vérifier que la proposition de création de compte est facultative et n'interrompt pas l'usage invité.
- ACC-07-T01 : vérifier qu'aucun rattachement de données ne se produit sans consentement explicite.
- ACC-08-T01 : vérifier la minimisation des champs exposés pour un profil membre.

Ces tests sont des critères à implémenter, pas des tests déjà exécutés.

## 6. Exigences et tests associés

Les identifiants ci-dessous proviennent des repères de traçabilité déjà établis. Ils indiquent des tests attendus, pas des tests dont l'exécution est prouvée.

| Décision / exigence                                                                                                            | Tests associés                                                                  | État de preuve            |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------- |
| C-02 — bip non accepté visible 24 h dans Réel seulement, expiration ensuite et réconciliation sans doublon au retour du réseau | Identifiant de test à attribuer après spécification du point de départ des 24 h | À SPÉCIFIER / À TESTER    |
| C-03.4 — partage de zone volontaire et ponctuel                                                                                | C03-T04 à C03-T07                                                               | À TESTER                  |
| C-03.7 — retrait local d'un message                                                                                            | C03-T13 à C03-T15                                                               | À TESTER                  |
| C-04.1 — conversation en lecture seule après fermeture                                                                         | C04-T01 à C04-T03                                                               | À TESTER                  |
| C-04.3 — libellé de confirmation                                                                                               | C04-T06 à C04-T09                                                               | À SPÉCIFIER puis À TESTER |
| P-01 — blocage de l'envoi après fermeture                                                                                      | P01-T01 à P01-T02                                                               | À TESTER                  |
| P-02 — zone approximative, consentie et ponctuelle                                                                             | P02-T01 à P02-T03                                                               | À TESTER                  |
| P-03 — masquage local uniquement                                                                                               | P03-T01 à P03-T04                                                               | À TESTER                  |
| P-04 — expiration et séparation des historiques                                                                                | P04-T01 à P04-T04                                                               | À TESTER                  |

Le point de départ exact du délai de 24 h reste ouvert. Les événements en attente doivent être conservés puis réconciliés sans doublon au retour du réseau.

Les exigences techniques T-01 à T-09 restent des éléments de spécification ouverts. Aucun identifiant de test supplémentaire n'est créé ici pour A, B, C-01 ou C-02 : il doit être relié à une source existante avant d'être ajouté.

## 7. Confrontation au dépôt actuel

| Élément observé                                                           | Constat                                                                                                                                                                | Conclusion                                                                                                   |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/lib/experience/presence.ts`                                          | Le module publie et écoute toujours un événement dans un bus en mémoire sur le processus courant.                                                                      | Ce n'est pas encore le transport temps réel multi-appareils.                                                 |
| `src/routes/reel.tsx`                                                     | La page présente les sections Présence, Bips reçus, Mises en relation et Historique comme indisponibles.                                                               | L'interface n'affiche pas de présence ni de relation fictive.                                                |
| Migration `supabase/migrations/20261110010000_reel_presence_and_bips.sql` | Ajoute les tables de présence, bips et relations, des RPC contrôlées, des règles RLS et une publication Postgres Changes conditionnelle.                               | Socle SQL ajouté ; application sur une base de test et exécution des tests pgTAP encore à prouver.           |
| Conversations                                                             | Le centre de communication possède des états vides ; aucune conversation Réel réelle n'est produite par le module de présence actuel.                                  | C-03 et C-04 ne sont pas attestées par le runtime actuel.                                                    |
| Découverte géographique                                                   | La première version filtre sur une clé de zone opaque commune ; le rayon métrique est enregistré mais aucun calcul de distance n'est effectué.                         | Ne pas afficher de distance ni annoncer un filtrage exact par rayon avant l'algorithme spatial et ses tests. |
| Commandes de bip                                                          | Les RPC de création, acceptation, refus et retrait sont ajoutées ; l'acceptation crée une relation unique et le même identifiant client permet de rejouer une demande. | Le raccordement de l'outbox locale et les tests de reprise réseau restent à réaliser.                        |

## 8. Conditions avant activation du parcours Réel

1. Vérifier la migration dans la chaîne standard, l'appliquer sur une base de test et exécuter le test pgTAP 130 ainsi que les tests RLS existants.
2. Raccorder Supabase Realtime côté client, avec autorisations, reprise après reconnexion et nettoyage des abonnements.
3. Définir et tester la précision de la clé de zone et le calcul réel du rayon ; aucun GPS exact ne doit être stocké ou diffusé.
4. Raccorder les commandes de présence et de bip à l'interface, à l'outbox locale et à la réconciliation idempotente après coupure réseau.
5. Vérifier le parcours invité sur une session anonyme réelle.
6. Créer la conversation liée à l'acceptation, puis implémenter la fermeture de relation et la lecture seule après fermeture.
7. Relier chaque test attendu ci-dessus à un test automatisé ou à une preuve reproductible sur appareil.

Le socle SQL est ajouté, mais aucune de ces conditions d'activation utilisateur n'est déclarée satisfaite sans exécution et preuve.

## 9. Traçabilité de la session invitée serveur

| Exigence | Contrat technique                                                                                                                 | Tests attendus                                                                                                               | État                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ACC-09   | Le secret invité est généré côté serveur ; seule son empreinte est stockée ; le secret transite dans un cookie HttpOnly sécurisé. | ACC-09-T01 création sans ligne Auth/profil ; T02 absence du secret brut en base/logs ; T03 cookie absent/invalide refusé.    | IMPLÉMENTATION AJOUTÉE, TESTS NON EXÉCUTÉS                               |
| ACC-10   | Chaque opération invitée vérifie la session serveur, son expiration/révocation et le droit précis demandé.                        | ACC-10-T01 expiration ; T02 révocation ; T03 accès inter-session refusé ; T04 opérations membres refusées à l'invité.        | SESSION VÉRIFIÉE PAR LE SERVICE ; CONTRÔLE PAR ACTION À LIVRER           |
| ACC-11   | Rotation du secret, protection CSRF, limites anti-abus et nettoyage des données temporaires.                                      | ACC-11-T01 ancien jeton refusé après rotation ; T02 origine/CSRF ; T03 limites de création ; T04 purge ; T05 fin de session. | ORIGINE, FIN ET PURGE AJOUTÉES ; ROTATION/ANTI-ABUS/TESTS À LIVRER       |
| ACC-12   | La connexion membre termine la session invitée sans rattachement automatique des données.                                         | ACC-12-T01 révocation à la connexion ; T02 absence de transfert sans consentement explicite.                                 | RÉVOCATION LORS DE LA DÉTECTION DU MODE MEMBRE AJOUTÉE ; TEST À EXÉCUTER |

Les exigences ACC-09 à ACC-12 sont des exigences techniques de sécurité dérivées des décisions ACC-01 à ACC-08. Elles ne donnent pas de nouveaux droits métier aux invités. Les durées, quotas et opérations Réel accessibles restent à valider avant la migration.

Voir [Architecture de session invitée éphémère](./reel-guest-session-architecture.md).

### État de preuve du premier lot serveur

La migration `20261110020000_reel_guest_sessions.sql`, le service serveur et le test pgTAP 131 sont présents dans la branche. Ils ne sont pas encore exécutés sur une base de test. La purge planifiée dépend de la disponibilité de `pg_cron`. La limitation anti-abus à la couche d'hébergement reste un prérequis avant activation publique. Le cookie de session ne donne pas encore accès aux actions métier Réel.

## 10. Politique d’accès applicative Réel

La première politique applicative est décrite dans [Politique d’accès Réel](./reel-access-policy.md) et implémentée dans `src/domains/presence/policy/reel-access-policy.ts`.

| Opération                                            | Contrôle client attendu                                                         | Preuve                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------- |
| Entrée Réel                                          | Visiteur refusé ; invité limité à l’entrée ; membre actif autorisé à entrer     | Test Vitest ajouté, non exécuté |
| Démarrer une présence                                | Membre actif, consentement `reel_presence`, décision serveur                    | Test Vitest ajouté, non exécuté |
| Terminer sa présence                                 | Propriété de la présence puis décision serveur                                  | Test Vitest ajouté, non exécuté |
| Découvrir / consulter ses bips                       | Membre actif et vérification serveur                                            | Test Vitest ajouté, non exécuté |
| Envoyer un bip                                       | Membre actif et vérification serveur ; aucune mise en file hors ligne           | Test Vitest ajouté, non exécuté |
| Accepter / refuser / retirer                         | Rôle destinataire ou émetteur selon l’action, propriété et vérification serveur | Test Vitest ajouté, non exécuté |
| Fermer une relation                                  | Participant autorisé et vérification serveur                                    | Test Vitest ajouté, non exécuté |
| Conversation, messages, partage de zone, signalement | Refus tant que le service n’est pas livré                                       | Test Vitest ajouté, non exécuté |

Cette politique côté client est un garde-fou d’interface et ne remplace jamais les contrôles SQL. Le parcours invité ne reçoit aucun droit métier par la seule existence de son cookie de session.

## Décisions LOC — utilisation de la position dans Réel

| Décision | Règle                                                                                                                                 | Statut  | Traçabilité                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| LOC-01   | Réel demande son propre accord de localisation à chaque nouvelle entrée, sans hériter des autorisations accordées aux autres moteurs. | VALIDÉE | Dialogue à l'entrée ; test d'isolation entre moteurs.                         |
| LOC-02   | La demande système n'est déclenchée qu'après une action explicite ; aucune géolocalisation automatique au chargement.                 | VALIDÉE | Appel ponctuel à getCurrentPosition, jamais watchPosition.                    |
| LOC-03   | Ignorer ou refuser laisse la page utilisable en mode calme, sans découverte locale, réactions, bips ni alertes locales.               | VALIDÉE | Contrôle UI et politique d'accès locationConsent.                             |
| LOC-04   | Les réglages et la consultation des relations existantes restent accessibles sans localisation.                                       | VALIDÉE | La fermeture d'une relation existante n'est pas conditionnée par la position. |
| LOC-05   | L'accord de localisation n'active pas la présence publique ; le consentement reel_presence reste distinct.                            | VALIDÉE | Double contrôle avant start_presence.                                         |
| LOC-06   | Pas de suivi en arrière-plan ni de persistance des coordonnées dans la première tranche.                                              | VALIDÉE | Lecture ponctuelle ; coordonnées non persistées.                              |
| LOC-07   | Après accord, aucune découverte n'est simulée tant que le résolveur de zone et le transport temps réel ne sont pas validés.           | VALIDÉE | Aucun profil, distance, bip ou compteur fictif.                               |

### Tests LOC attendus

- LOC-T01 : entrée dans Réel avec une autorisation déjà accordée à un autre moteur ; Réel demande tout de même son propre accord.
- LOC-T02 : chargement de Réel sans clic ; aucune API de géolocalisation n'est appelée.
- LOC-T03 : « Pas maintenant » ; mode calme, aucune découverte/réaction/bip/alerte locale.
- LOC-T04 : refus système ou géolocalisation indisponible ; la page reste utilisable et propose une nouvelle tentative.
- LOC-T05 : accord de localisation sans consentement reel_presence ; aucune présence personnelle n'est publiée.
- LOC-T06 : fermeture d'une relation existante possible en mode calme.
- LOC-T07 : vérifier qu'aucune coordonnée n'est écrite dans localStorage, sessionStorage, les tables de présence ou les journaux applicatifs.

Ces exigences sont approuvées ; les tests ne sont pas réputés exécutés tant qu'un résultat CI sur le SHA courant n'est pas disponible.

## 9. Décisions LOC/DISC/PRES — permissions séparées et zone approximative

| ID      | Règle                                                                                                        | Statut                | Preuve attendue                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------ | --------------------- | -------------------------------------------------------------------------------------------------- |
| DISC-01 | La découverte locale possède un consentement Réel indépendant des autres moteurs.                            | VALIDÉE               | Demande affichée à chaque entrée ; test sans héritage de permission.                               |
| DISC-02 | La découverte permet d'observer sans publier sa propre présence.                                             | VALIDÉE               | Test SQL 132 : utilisateur découvre sans ligne de présence personnelle.                            |
| DISC-03 | Le refus de découverte maintient le mode calme et n'ouvre aucune session de découverte.                      | VALIDÉE               | Test interface et vérification de l'absence de session.                                            |
| PRES-01 | La publication de sa présence demande un accord distinct et le consentement `reel_presence`.                 | VALIDÉE               | Test de refus sans consentement.                                                                   |
| PRES-02 | La présence publiée est approximative ; aucune coordonnée GPS brute n'est stockée.                           | VALIDÉE               | Contrôle des colonnes et audit des données.                                                        |
| PRES-03 | Le navigateur ne choisit pas librement sa zone de publication ; il consomme un jeton serveur à usage unique. | VALIDÉE               | Test d'un jeton absent, expiré, réutilisé ou appartenant à un autre membre.                        |
| ZONE-01 | Les clés de zone sont des HMAC calculés côté serveur à partir d'une cellule d'environ 200 m.                 | IMPLÉMENTÉE, À TESTER | Tests unitaires de stabilité, de voisinage, de secret absent et de non-exposition des coordonnées. |
| ZONE-02 | Une session de découverte dure 15 minutes et couvre la cellule et les huit cellules voisines.                | IMPLÉMENTÉE, À TESTER | Test d'expiration, de purge et de périmètre.                                                       |
| ZONE-03 | Le rayon choisi n'est pas encore appliqué par un calcul métrique réel.                                       | OUVERT                | Ne pas afficher de distance exacte avant livraison du calcul spatial.                              |

### Modes d'accès constatés dans le code

- Visiteur : présentation publique ; pas d'action métier Réel.
- Invité : entrée dans le parcours et identité temporaire locale/serveur préparée, mais les opérations métier Réel ne sont pas encore ouvertes à cette session.
- Membre avec profil actif : découverte et publication de présence via les contrôles serveur séparés.
- Profil invité/incomplet, suspendu, fermé, manquant ou en erreur : opérations métier refusées.

### Tests ajoutés mais non exécutés

- `supabase/tests/database/132_reel_discovery_without_presence.test.sql` : vérifie qu'un membre peut découvrir sans publier sa présence et que la présence seule ne donne pas le droit de découverte.
- `supabase/tests/database/130_reel_presence_security.test.sql` : utilise désormais les jetons de zone à usage unique pour publier une présence.
- `tests/access-mode/reel-access-policy.test.ts` : vérifie l'indépendance des deux consentements.

La présence de ces tests dans la branche ne constitue pas une preuve de leur réussite. Migration Supabase, pgTAP, Vitest, lint, build et tests sur appareils restent à exécuter.

## Mise à jour ZONE-04 — filtrage géographique métrique

| ID      | Règle                                                                                                                                                                          | Statut                           | Preuve attendue                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ZONE-04 | Le rayon de visibilité choisi (10 m, 25 m, 50 m, 100 m ou 1 km) est appliqué par PostGIS avec `ST_DWithin` sur des points `geography`, côté serveur.                           | IMPLÉMENTATION AJOUTÉE, À TESTER | pgTAP 133 : présence à environ 5 m incluse à 10 m ; présence à environ 22 m exclue à 10 m et incluse à 25 m. |
| ZONE-05 | Les coordonnées précises sont stockées temporairement dans des tables privées `service_role`, jamais dans les projections client ; elles sont supprimées à l'arrêt/expiration. | IMPLÉMENTATION AJOUTÉE, À TESTER | pgTAP 133 : privilèges directs refusés ; tests de suppression à l'arrêt et à l'expiration à compléter.       |
| ZONE-06 | La grille HMAC ne détermine plus la proximité métrique ; elle reste un identifiant opaque complémentaire.                                                                      | IMPLÉMENTATION AJOUTÉE, À TESTER | Audit RPC et test de non-dépendance du filtrage spatial aux cellules HMAC.                                   |

### Architecture PostGIS retenue

- `reel_discovery_locations` : un point privé par session de découverte, expiration de 15 minutes.
- `reel_zone_grants.location` : point privé lié à l'autorisation de publication à usage unique, expiration de 5 minutes.
- `reel_presence_locations` : point privé associé à une présence publiée ; suppression déclenchée quand la présence cesse d'être active ou lors de la purge.
- `list_reel_discovery_presence` compare la position de découverte à celle des présences publiées avec le rayon `radius_m` de chaque présence. Aucun point ni distance n'est renvoyé au navigateur.

Les tests pgTAP 130, 132 et 133 sont des scénarios ajoutés/modifiés dans la branche. Ils ne sont pas déclarés exécutés ni réussis.

| ZONE-07 | L'envoi d'un bip vérifie à nouveau côté serveur la distance entre les deux points privés avec le rayon de visibilité du destinataire ; il ne dépend plus de l'égalité des cellules HMAC. | IMPLÉMENTATION AJOUTÉE, À TESTER | pgTAP 134 : bip autorisé entre deux cellules HMAC différentes lorsque la distance PostGIS est dans le rayon. |

## Mise à jour — raccordement de l’interface et des relations

| Domaine                  | Implémentation ajoutée                                                                                                          | Preuve attendue                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Bips reçus               | list_reel_bips() appelé depuis l’onglet Réel ; acceptation/refus via command_reel_bip() ; rafraîchissement Postgres Changes     | Tests Vitest du rendu/actions, pgTAP de confidentialité et essai multi-appareils  |
| Envoi d’un bip           | Bouton depuis une fiche réellement découverte, uniquement si le membre a une présence active ; validation finale par le serveur | pgTAP 134 et scénario complet sur deux comptes                                    |
| Historique des relations | Migration 20261110090000_reel_connection_history_and_close.sql, RPC list_reel_connections() limitée aux deux participants       | pgTAP de lecture croisée interdite et vérification de la projection du partenaire |
| Fermeture d’une relation | RPC close_reel_connection() ; l’un ou l’autre participant ferme la relation commune                                             | pgTAP : participant autorisé, tiers refusé, répétition idempotente                |
| Invités                  | Les sessions temporaires existent mais ne sont pas acceptées par les RPC métier Réel                                            | Tests d’isolation et de refus jusqu’à la livraison du parcours invité métier      |
| Propositions globales    | Pas de source métier raccordée ; état vide maintenu                                                                             | Définir et valider une source réelle avant tout affichage                         |

**Tous les éléments ci-dessus sont ajoutés mais restent À TESTER.** Aucun résultat de migration, de test ou de fonctionnement multi-appareils n’est revendiqué.

| Historique et fermeture | Test pgTAP 135 ajouté : accès du participant, nom public limité, fermeture commune, idempotence et refus d’un tiers | À exécuter dans Supabase local et à confirmer sur deux comptes |

| Rétention des relations | Les relations actives restent visibles ; les relations fermées sont affichées pendant six mois | Test pgTAP 135 : une relation fermée depuis sept mois est exclue |
| Événements de résolution des bips | RLS permet aux deux participants de recevoir les événements acceptation/refus pendant la rétention courte ; la liste RPC reste limitée aux bips en attente | Test multi-appareils à exécuter ; confirmer que l’événement Postgres Changes actualise l’expéditeur et le destinataire |

| Nettoyage de l’historique | purge_reel_connection_history() supprime les relations fermées de plus de six mois ; planification quotidienne à 03 h via pg_cron | Test pgTAP 135 ajouté ; vérifier l’exécution planifiée sur Supabase |
