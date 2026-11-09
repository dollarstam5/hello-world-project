# Réel — continuité produit V1, V2 et V3

**Statut :** cadre de versionnement documentaire.  
**Règle :** V1 décrit le périmètre actuellement arbitré ; V2 et V3 sont des espaces de planification, pas des engagements fonctionnels déjà approuvés.

## Principes de continuité

1. V1 reste la base stable ; une évolution V2/V3 ne réécrit pas silencieusement les règles validées.
2. Toute évolution identifie la règle V1 concernée, la raison du changement, les impacts UX, données, API, sécurité, coûts et tests.
3. Les comportements non arbitrés restent marqués « à décider ».
4. Une idée ou une proposition ne devient une règle validée qu'après décision explicite.
5. Une règle produit ne devient une capacité livrée qu'après vérification du code, des contrats, des politiques, des tests et du déploiement.
6. Les migrations de données et changements d'API ne sont jamais déduits d'une évolution d'écran.
7. L'authentification existante reste hors périmètre des évolutions Réel, sauf décision distincte explicite.

## V1 — Périmètre de référence

### Navigation et accès

- Home est le point d'entrée général de Vitalis et occupe la route racine `/` ; son contenu dépend de l'état onboarding/identification.
- Le parcours de première utilisation est : onboarding → Home explicative → demande d'identification via le parcours existant → Home interactive après réussite.
- L'icône de l'application ramène à Home, jamais directement à Réel.
- La Home interactive donne accès aux moteurs Réel, Flash, Scan et Radar ainsi qu'aux catégories secondaires.
- La navigation métier conserve les entrées Réel, Flash, Scan, Radar et 2x2 ; Réel est distinct de Home et sa route dédiée doit être confirmée dans l'inventaire runtime avant implémentation.
- Flash conserve `/flash`, Radar conserve `/radar`, Scan cible `/scan` sous réserve de vérification du routage existant.
- Le 2x2 ouvre le menu secondaire, dont les destinations actuellement documentées sont Espace et Talents.
- Direction UI/UX : hybride, premium, simple et vivant.

### Fonctionnel Réel

Le détail normatif se trouve dans [Réel — spécification fonctionnelle](./reel-engine.md) ; les liens entre décisions, exigences et tests attendus figurent dans la [matrice de traçabilité Réel V1](./reel-traceability-matrix.md). Les décisions déjà prises couvrent notamment :
- présence activée/désactivée manuellement, indépendante du statut ;
- un seul statut actif, avec durées fixes 30 min, 1 h, 2 h, 3 h, 6 h, 12 h ou 24 h ;
- remplacement confirmé et atomique du statut ; une modification ne renouvelle pas son expiration ;
- rayons de 10 m, 25 m, 50 m, 100 m, 250 m, 500 m et 1 km ; défaut initial 50 m, dernier choix mémorisé, aucun élargissement automatique ;
- profil intermédiaire et visibilité indépendante des champs facultatifs ;
- téléphone et GPS exact privés ; distance affichée par plages pour éviter la triangulation ;
- position GPS exacte traitée temporairement, sans historique durable ; tolérance de perte de signal de 2 minutes, puis profil masqué ;
- demande de connexion simple « Ça m'intéresse », sans message libre ;
- destinataire voit le profil visible, le statut et la distance approximative avant décision ;
- notification in-app et push si autorisée ; aucun rappel automatique ;
- bip non accepté conservé 24 h à partir de son enregistrement serveur, sans délai artificiel d'envoi ; synchronisation automatique après interruption réseau ;
- mises en relation acceptées accessibles dans deux emplacements seulement : Réel et Notifications ; communication attachée à la mise en relation ;
- clôture confirmée par un participant, commune et immédiate pour les deux : retrait des deux emplacements, désactivation de la communication, information de l'autre participant et conservation éventuelle d'une trace technique minimale, sans historique de conversation consultable ;
- détails normatifs : [Cycle de vie immédiat Réel V1](./reel-lifecycle-v1.md).

### Décisions fonctionnelles validées dans le Groupe C

- C-01 : consultation d'un profil intermédiaire, limité aux champs visibles et à la distance approximative.
- C-02.1 à C-02.4 : demande « Ça m'intéresse » sans message libre, informations visibles avant décision, notifications selon autorisation et absence de notification explicite de refus.
- C-03.1 à C-03.9 : conversation créée après acceptation, texte uniquement, premier message libre pour chacun, partage volontaire et ponctuel d'une zone approximative après confirmation, notifications, états envoyé/reçu/lu, retrait d'affichage côté auteur sans effacement global, limite de 1 000 caractères et signalement.
- C-04.1 à C-04.5 : clôture confirmée et définitive, commune aux deux participants, retrait immédiat des deux emplacements, désactivation de la communication, information du second participant et absence d'historique de conversation après clôture ; déblocage sans restauration de l'ancienne mise en relation.

Les décisions fonctionnelles C-03 et C-04 sont validées. Restent ouverts ou non vérifiés : seuils anti-spam, rétention technique des messages et signalements, contrats API, modèle de données, politiques RLS, comportement offline, tests mobiles et preuves d'implémentation.

### Contraintes V1

- Préserver Flash, Radar, Scan et 2x2.
- Ne pas modifier l'authentification.
- Minimiser les coûts récurrents, les volumes de données et les appels serveur.
- Ne pas présenter comme implémenté ce qui n'est qu'une règle fonctionnelle.

## V2 — Espace d'évolution, non engagé

Aucune fonctionnalité V2 n'est approuvée par ce document. Les demandes d'évolution devront être inscrites ici avant arbitrage, avec :
- besoin utilisateur observé en V1 ;
- proposition fonctionnelle et alternatives ;
- impact sur la navigation et la page Réel ;
- impact sur confidentialité, sécurité, modération et abus ;
- impact sur données, API, synchronisation et coûts ;
- critères d'acceptation et tests ;
- décision explicite : accepté, refusé ou reporté.

Ne pas ajouter automatiquement des fonctions sociales, médias, recommandations ou automatisations sans étude et arbitrage dédiés.

## V3 — Espace d'évolution, non engagé

V3 est réservé aux évolutions structurelles ou plus ambitieuses qui nécessitent une justification issue de l'usage V1/V2. Aucune capacité V3 n'est présumée.

Toute proposition V3 doit inclure :
- problème durable à résoudre et preuves d'usage ;
- comparaison avec une solution plus simple ;
- compatibilité avec les règles de confidentialité et le principe de minimisation ;
- coût total et dépendances techniques ;
- stratégie de migration et de compatibilité ;
- plan de tests, de déploiement progressif et de retour arrière ;
- décision explicite avant intégration à la roadmap approuvée.

## Registre de changements

| ID | Version cible | Proposition | Décision | Référence/PR | Tests et preuves |
| --- | --- | --- | --- | --- | --- |
| REEL-V1-BASE | V1 | Périmètre arbitré dans la spécification Réel | Validé au niveau fonctionnel ; runtime non vérifié ici | PR documentaire en cours | À établir lors du lot runtime |
| REEL-V2-001 | V2 | À renseigner après retours V1 | Non décidé | — | — |
| REEL-V3-001 | V3 | À renseigner après retours V1/V2 | Non décidé | — | — |

## Procédure de mise à jour

Pour chaque changement :
1. ajouter une entrée au registre ;
2. indiquer les fichiers canoniques concernés ;
3. faire arbitrer les règles produit ;
4. mettre à jour la spécification et les index ;
5. produire une matrice de dépendances runtime/API/données/tests ;
6. ouvrir une PR distincte et contrôlable ;
7. ne fusionner qu'après validation et contrôles requis.
