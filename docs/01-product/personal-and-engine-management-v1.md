# Espaces personnels et gestion indépendante des moteurs — V1

**Statut :** spécification produit à appliquer progressivement dans la PR #40.  
**Principe :** chaque espace possède ses propres sections et ses propres actions de gestion. Les données personnelles, les réglages du profil et les réglages généraux de l'application restent séparés des espaces métier.

## 1. Organisation générale

Vitalis distingue trois familles d'espaces :

1. **Les moteurs** : Flash, Scan, Réel et Radar. Chacun a une page d'accueil, des sections métier et un accès à la gestion de ses propres éléments.
2. **Mon espace personnel** : regroupe les informations du compte, le profil visible, les paramètres du profil et les préférences de l'application.
3. **Les services transversaux** : Notifications, Assistant, Messages et le contrôle Réel depuis la cloche. Ils ne deviennent pas des moteurs supplémentaires.

Le menu 2×2 sert de point d'accès aux espaces complémentaires. Il ne doit pas mélanger les réglages personnels avec les commandes propres à un moteur.

## 2. Espace personnel

La page « Espace » devient un tableau de bord personnel organisé en entrées indépendantes. Chaque entrée ouvre sa propre page ou section de gestion.

### 2.1 Mes informations

Informations liées au compte et à son fonctionnement, distinctes de ce que les autres personnes peuvent voir :

- identité du compte et informations de connexion ;
- coordonnées, uniquement si elles sont réellement enregistrées et si leur affichage est autorisé ;
- informations nécessaires à la sécurité et à la récupération du compte ;
- données protégées et informations gérées par Vitalis, affichées en lecture seule lorsque nécessaire.

Les informations privées ne sont jamais reprises automatiquement dans l'aperçu public du profil. Les actions sensibles exigent un parcours de confirmation adapté.

### 2.2 Mon profil

Gère la représentation personnelle dans Vitalis :

- nom affiché ;
- identifiant public facultatif ;
- photo ou avatar, lorsque le stockage et les règles d'accès sécurisés sont disponibles ;
- description et informations de présentation, lorsqu'un contrat de données et un consentement explicite existent ;
- paramètres de visibilité, uniquement pour les champs dont la publication est techniquement et juridiquement encadrée.

La page de gestion du profil ne doit pas devenir un écran fourre-tout pour les paramètres généraux de l'application.

### 2.3 Aperçu de mon profil

L'aperçu est une représentation fidèle de ce qu'une autre personne serait autorisée à consulter. Il est distinct de la page d'édition.

La gestion de l'aperçu doit permettre, lorsque les règles de visibilité sont disponibles :

- de voir le rendu public avant validation ;
- de choisir les champs facultatifs qui peuvent être montrés ;
- de comprendre clairement ce qui reste privé ;
- de prévisualiser les changements sans les publier automatiquement.

**Garde-fou V1 :** tant que les contrats serveur, le consentement, le stockage des médias et les règles de visibilité ne sont pas prêts, ne pas afficher de faux réglages actifs ni prétendre qu'un champ est publiquement visible. Les options non disponibles sont indiquées comme non encore proposées, sans simuler leur sauvegarde.

### 2.4 Paramètres du profil

Réglages attachés à l'identité et à la présentation du profil : identifiant public, champs de présentation et visibilité des informations publiques. Ils ne doivent pas contenir les préférences générales de l'application.

### 2.5 Paramètres de l'application

Préférences qui s'appliquent à l'ensemble de Vitalis :

- langue ;
- apparence : thème sombre/clair/système, lorsque le réglage est raccordé ;
- accessibilité : réduction des animations et préférences d'affichage prises en charge ;
- notifications : préférences globales, dans la limite des capacités réellement disponibles ;
- permissions de l'appareil : explications et accès aux réglages système, sans contourner le consentement ;
- fonctionnement hors ligne et gestion locale, avec explication claire des données conservées.

Un réglage global ne doit pas écraser silencieusement une préférence propre à un moteur. Lorsqu'une préférence de moteur existe, sa portée doit être indiquée.

## 3. Espaces indépendants des moteurs

Chaque moteur doit avoir une page principale cohérente, puis des sections dédiées à la consultation et à la gestion. Les sections ci-dessous définissent la cible fonctionnelle ; elles ne signifient pas que toutes les fonctions sont déjà disponibles dans le runtime.

### 3.1 Flash — mes publications et mes besoins

Sections à prévoir :

- **Découvrir** : flux des Flash actifs accessibles à la personne ;
- **Mes Flash** : publications créées par la personne ;
- **Brouillons** : contenus non publiés, si leur sauvegarde est disponible ;
- **Terminés / archivés** : publications fermées ou arrivées à échéance, selon les règles de conservation ;
- **Créer un Flash** : proposition ou recherche, avec un dialogue court et contextuel ;
- **Préférences Flash** : catégories ou filtres utiles à ce moteur.

Gestion : consulter, modifier, fermer ou supprimer uniquement les éléments dont la personne est propriétaire et selon leur état métier. Une publication expirée ne doit pas être présentée comme active.

### 3.2 Scan — recherches et filtres

Sections à prévoir :

- **Rechercher** : recherche ciblée dans les Flash actifs ;
- **Filtres** : zone, catégorie et critères réellement pris en charge ;
- **Recherche en cours** : critères de la recherche actuelle ;
- **Recherches récentes** : uniquement si un historique local ou serveur est défini et contrôlable ;
- **Préférences Scan** : réglages propres à l'expérience de recherche.

Scan consulte les publications Flash ; il ne crée pas un second système de publication. Les recherches suivies dans la durée relèvent de Radar, pas de Scan.

### 3.3 Réel — ma présence et mes mises en relation

Sections à prévoir :

- **Ma présence** : démarrer, consulter, modifier ou terminer sa présence active ;
- **Bips reçus** : signaux reçus pendant le cycle de présence, selon les règles de validité ;
- **Mes mises en relation** : relations acceptées et communication associée ;
- **Historique** : éléments conservés selon les règles de rétention du compte ;
- **Préférences Réel** : rayon, durée proposée, permissions et réglages propres à la présence.

La présence, les bips et les relations sont des données métier sensibles. Ne jamais les fabriquer pour remplir l'écran. Les actions de fermeture d'une mise en relation doivent suivre les confirmations et effets communs déjà définis.

### 3.4 Radar — recherches suivies

Sections à prévoir :

- **Mes suivis** : recherches que la personne a choisi de suivre ;
- **Alertes** : préférences de réception et état des alertes réellement configurées ;
- **Résultats** : correspondances réellement calculées et autorisées ;
- **En pause / archivés** : suivis suspendus ou terminés ;
- **Préférences Radar** : fréquence, critères et zones, selon les capacités V1 effectivement validées.

Radar suit une intention dans la durée. Il ne doit pas dupliquer la recherche ponctuelle de Scan ni afficher de correspondance sans résultat métier confirmé.

## 4. Modèle commun d'une page moteur

Chaque page moteur suit une structure commune, tout en conservant son identité :

1. **En-tête** : nom du moteur, phrase courte qui explique son utilité et action principale.
2. **Aperçu** : état actuel ou exemple pédagogique explicitement marqué « Exemple » lorsqu'aucune donnée réelle n'est disponible.
3. **Sections du moteur** : accès directs aux contenus et activités qui lui appartiennent.
4. **Gérer** : entrée claire vers les actions de gestion propres à ce moteur.
5. **Préférences du moteur** : réglages locaux à ce moteur, sans répéter les paramètres généraux.

Les pages restent simples sur mobile : cartes lisibles, actions prioritaires visibles, sections courtes, pas de longues listes ou formulaires sans nécessité.

## 5. Règles de séparation et de cohérence

- Un moteur est propriétaire de ses règles, sections, données, permissions et actions.
- Les composants partagés peuvent mutualiser la présentation, mais ne doivent pas mélanger les règles métier.
- Une action de gestion ne doit modifier que les données appartenant à l'espace concerné.
- Les réglages globaux restent dans Paramètres de l'application ; les réglages métier restent dans le moteur concerné.
- Les informations privées du compte ne sont jamais assimilées aux informations du profil public.
- L'aperçu rapide du profil reste une consultation courte ; la gestion complète se fait dans les pages dédiées.
- Un état vide explique simplement ce qui apparaîtra ici et ne crée ni compteur, ni activité, ni résultat fictif.
- Les exemples pédagogiques sont identifiés « Exemple » et ne sont jamais enregistrés comme des données métier.
- Les sections sans backend, contrat, autorisation ou parcours sécurisé restent clairement indiquées comme à venir ; elles ne sont pas présentées comme opérationnelles.

## 6. Parcours d'accès

- Avatar du header → aperçu rapide du profil → page Mon profil.
- Espace depuis 2×2 → tableau de bord personnel → Mes informations, Mon profil, Aperçu du profil, Paramètres du profil ou Paramètres de l'application.
- Flash / Scan / Réel / Radar depuis la navigation → page du moteur → section dédiée → gestion propre au moteur.
- Cloche → Notifications, Assistant, Messages et Réel ; elle reste un centre transversal et non un sous-menu de gestion des moteurs.

## 7. État de réalisation et ordre de mise en place

| Domaine | Mise en place actuelle | Limite ou étape suivante |
| --- | --- | --- |
| Tableau de bord personnel | Cartes d'accès vers profil, informations, paramètres du profil, aperçu et paramètres de l'application | Enrichir seulement lorsque de nouvelles données réelles sont disponibles |
| Mes informations | Adresse de connexion et date de création lues depuis la session authentifiée | Ajouter d'autres champs uniquement s'ils existent et sont autorisés |
| Mon profil | Nom affiché et identifiant public modifiables ; identifiant supprimable avec confirmation | Ajouter avatar/description après validation du stockage et du consentement |
| Paramètres du profil | Page dédiée expliquant que la visibilité n'est pas encore configurable et que le profil reste privé par défaut | Définir les permissions et la projection serveur avant d'activer les réglages |
| Aperçu du profil | Page dédiée qui explique pourquoi aucun aperçu public n'est encore présenté | Raccorder une projection publique fidèle et sécurisée |
| Paramètres de l'application | Langue et thème sombre/clair/automatique persistés sur l'appareil | Ajouter uniquement les préférences réellement prises en charge |
| Flash | Flux public, création et section « Mes Flash » basée sur les enregistrements locaux du compte ; archivage et suppression disponibles | Étendre aux brouillons/archives distants après validation de leur source et de leur synchronisation |
| Scan | Recherche de proximité existante et explication claire de l'absence d'historique enregistré | Ne proposer un historique que lorsqu'une persistance réelle et contrôlable existe |
| Réel | Sections Présence, Bips, Mises en relation et Historique présentées en cartes « Bientôt » | Raccorder les services métier avant d'activer les actions |
| Radar | Sections Suivis, Alertes et Résultats présentées en cartes « Bientôt » | Raccorder les suivis et résultats confirmés avant d'activer les actions |

La réalisation doit suivre les contrats, services et politiques d'accès existants. Aucun changement de schéma, RPC, migration ou politique RLS n'est autorisé par cette seule spécification.

## 8. Validation attendue

Avant de considérer une section comme livrée, vérifier :

- que son propriétaire métier est identifié ;
- que ses données et actions proviennent d'une source réelle autorisée ;
- que les états vide, chargement, erreur et hors ligne sont traités ;
- que l'édition et la suppression respectent les droits et confirmations ;
- que la page reste utilisable au clavier, au lecteur d'écran et sur petit écran ;
- que les textes sont disponibles en français et en anglais ;
- que l'aperçu ne révèle aucune donnée privée ;
- que les tests prouvent le comportement annoncé.
