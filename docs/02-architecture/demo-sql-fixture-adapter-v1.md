# Adaptation du jeu SQL de démonstration aux domaines Vitalis — V1

**Source :** fichier utilisateur `donnees_sql.sql` (schéma `utilisateurs`, schéma `annonces`, données fictives).
**Statut :** spécification de conversion et garde-fous ; aucune importation en base ni activation runtime n'est déclarée par ce document.

## 1. Décision

Le SQL fourni est une source de contenu fictif pour préparer les interfaces. Il ne constitue ni une migration de production ni un schéma canonique Vitalis.

Les données doivent être converties en fixtures locales typées, détenues par les domaines. Elles doivent suivre les mêmes contrats et fonctions de domaine que les données réelles pour les opérations de lecture et de présentation : validation, normalisation, mapping, filtres, tri, sélection, pagination et calcul des états d'affichage.

La frontière reste stricte : les fixtures ne sont jamais créées via les commandes d'écriture métier, Dexie, l'outbox ou Supabase. Elles sont en lecture seule et leur provenance `demo` est conservée jusqu'à l'interface.

## 2. Ce que contient la source

Le fichier définit :
- `utilisateurs` : identifiant UUID, pseudo, e-mail, téléphone, ville, quartier, avatar, rôle, dates de compte, état actif et tags préférés ;
- `annonces` : identifiant, type, sous-catégorie, titre, description, lieu, heure, date, auteur, contact, urgence, gain, type d'aide, statut, tags et compteurs de vues/réponses ;
- cinq familles d'annonces : `besoin`, `opportunite`, `rencontre`, `evenement`, `service`.

Ces champs décrivent le modèle du fichier SQL, pas les contrats publics actuels de chaque moteur Vitalis. Les compteurs, rôles, contacts et états SQL ne doivent pas être recopiés automatiquement dans les modèles de présentation.

## 3. Conversion par domaine

| Source SQL | Destination Vitalis | Règle |
| --- | --- | --- |
| Annonce `besoin` / `opportunite` | Flash, si le contenu correspond à un Flash autorisé | Mapper vers les enums et champs de `FlashRecord` puis la projection publique `PublicFlash` ; ne jamais exposer auteur, téléphone ou description privée dans la projection publique |
| Annonce de type `service` | Flash ou catalogue 2×2 selon le contrat réellement disponible | Ne pas inventer un type métier ; si aucun contrat ne correspond, garder un aperçu pédagogique séparé |
| Annonce `rencontre` / `evenement` | Aperçu éditorial ou domaine événementiel seulement si son contrat est vérifié | Ne pas créer de présence Réel, rendez-vous confirmé ou événement actif |
| Lieu, quartier, ville | `areaLabel` / libellé de zone lorsque le contrat le permet | Ne pas fabriquer de latitude, longitude ou distance |
| `urgence`, `gain`, `type_aide`, `tags` | Champs de présentation ou filtres uniquement si le domaine les prend en charge | Normaliser et rejeter les valeurs inconnues ; ne pas étendre les enums par supposition |
| Utilisateur SQL | Profil de démonstration isolé | Jamais un compte Vitalis, une identité authentifiée ou un auteur réel |
| `contact`, téléphone, e-mail | Données internes de fixture uniquement si nécessaires au scénario | Ne jamais afficher ni rendre cliquable par défaut ; utiliser des valeurs synthétiques neutralisées dans l'interface |
| `nombre_vues`, `nombre_reponses` | Aucun compteur réel | Les omettre ; ne pas simuler une popularité ou une activité |

Le mapping doit être explicite et testé. Une ligne non convertible est ignorée de la liste métier et peut être conservée dans un rapport de validation des fixtures, sans correction silencieuse.

## 4. Même chemin de lecture que les données réelles

Flux attendu :

```text
SQL source (outil de préparation uniquement)
  -> convertisseur déterministe
  -> validation des contrats Vitalis
  -> fixtures typées par domaine (origin = demo)
  -> sélecteur / cas d'usage de lecture du domaine
  -> règles communes de filtre, tri, pagination et présentation
  -> interface avec mention « Exemple »
```

Pour les données réelles, le même sélecteur reçoit la source réelle autorisée (Dexie / repository du domaine) et applique les mêmes règles de présentation.

Le sélecteur combine les deux sources selon le seuil propre à l'écran, après que le chargement réel est terminé. Il place toujours les données réelles en priorité et conserve la provenance de chaque élément. Les fixtures ne traversent jamais les méthodes de création, mise à jour, suppression métier ou synchronisation.

## 5. Règles de sécurité et de fraîcheur

- Les pseudos, e-mails, téléphones et contacts de la source sont fictifs, mais ressemblent à des coordonnées utilisables : ne pas les exposer tels quels dans les écrans.
- Le champ SQL `mot_de_passe_hash` ne doit jamais être utilisé pour créer des comptes ou alimenter un formulaire. Les inserts utilisateurs omettent ce champ alors que la colonne est déclarée `NOT NULL` sans valeur par défaut : le script, tel qu'écrit, n'est pas un seed exécutable fiable.
- Plusieurs scénarios parlent de santé, de mineurs, d'hébergement, de détresse et de collecte d'argent. Les transformer en exemples génériques et non identifiants ; ne pas afficher de détails sensibles ni encourager une mise en relation réelle à partir de ces scènes.
- Les dates d'annonces observées dans le fichier sont au 8 juillet 2026. Au 10 novembre 2026, elles sont anciennes : ne pas les afficher comme des annonces actuelles, urgentes, ouvertes ou disponibles. Pour une fixture d'interface, utiliser un scénario intemporel ou une date synthétique contrôlée par les tests, sans prétendre qu'elle est réelle.
- Les statuts `ouvert`, `en_cours`, `clos` ne sont pas les statuts des contrats Flash/Radar ; ne pas les transposer directement.
- Ne jamais utiliser les UUID SQL dans les espaces d'identifiants réels. Préfixer les identifiants de fixture par un espace réservé au domaine de démonstration.
- Aucun contenu de ce fichier ne doit générer une notification, un bip, une relation, une conversation, une présence Réel, une disponibilité, une correspondance Radar ou une action utilisateur.

## 6. Tests de conformité du convertisseur

Le convertisseur et les sélecteurs doivent tester :
1. mapping de chaque famille SQL prise en charge vers un contrat réellement existant ;
2. rejet explicite des types, statuts et catégories inconnus ;
3. absence de coordonnées géographiques ou de distances inventées ;
4. neutralisation des contacts et suppression des champs d'authentification ;
5. gestion des dates périmées sans faux contenu actif ;
6. validation du contrat cible avant publication de fixture ;
7. tri, filtres, pagination et détails identiques au chemin de lecture réel ;
8. priorité aux données réelles et retrait progressif des exemples au seuil du domaine ;
9. conservation de `origin: "demo"` dans chaque transformation ;
10. impossibilité d'écrire une fixture dans Dexie, l'outbox ou Supabase ;
11. absence d'effets de bord (compteurs, messages, notifications, présences, relations).

## 7. Ordre d'implémentation

1. Valider les contrats cibles par domaine et le mapping SQL.
2. Créer le convertisseur déterministe hors runtime.
3. Produire des fixtures synthétiques minimisées et typées par domaine.
4. Brancher les fixtures au sélecteur de lecture de chaque domaine, sans modifier les commandes d'écriture.
5. Définir et tester le seuil de suffisance propre à chaque interface.
6. Vérifier le rendu FR/EN, le marqueur « Exemple » et les actions désactivées.
7. Activer progressivement les surfaces qui passent les tests.

**Limite actuelle :** cette spécification ne prouve pas que les fixtures ou le convertisseur sont déjà implémentés. Elle prépare leur réalisation sans importer le SQL brut dans Vitalis.


## 8. Première tranche réalisée — Flash

**État :** code ajouté à la branche `docs/language-audit-v1`, en attente des contrôles CI.

Le premier raccordement porte uniquement sur Flash :

- Fixture locale typée `PublicFlash` dans `src/domains/flash/model/demo-flashes.ts`.
- Trois scénarios éditoriaux synthétiques : garde d’enfants le week-end, aide au déménagement dans deux heures et aide à la vaisselle après une réunion du dimanche vers 15 h à Dakar. Ils remplacent les anciens exemples génériques ; aucune identité, coordonnée ni annonce SQL n'est réutilisée.
- Les auteurs, contacts, e-mails, téléphones, descriptions privées, compteurs SQL et dates anciennes sont écartés.
- Les identifiants sont isolés sous le préfixe `demo:flash:` ; les lieux génériques ou explicitement indiqués comme exemples ne représentent pas une position réelle.
- Les dates d'affichage sont recalculées à partir d'une horloge fournie au générateur : aucune annonce de juillet 2026 n'est présentée comme actuelle.
- Le sélecteur reçoit les mêmes champs publics `PublicFlash` que le flux distant, trie par `createdAt`, donne priorité aux publications réelles et complète jusqu'à trois cartes seulement après résolution des sources réelles.
- La provenance `origin: "real" | "demo"` accompagne chaque élément jusqu'à `FlashCard`. La carte remplace « En direct » par « Exemple » pour les éléments fictifs, avec traductions FR/EN.
- Aucun appel à `createFlash`, aucun ajout Dexie/outbox et aucune écriture Supabase ne sont effectués.

Tests ajoutés dans `tests/flash-demo-feed.test.ts` : priorité au réel, remplissage limité, absence d'exemples avant résolution et exclusion des champs privés.

Cette première tranche ne valide pas encore le fonctionnement des autres moteurs. Scan, Réel, Radar, profils et communications restent inchangés et ne reçoivent aucune fixture dans leurs flux réels.
