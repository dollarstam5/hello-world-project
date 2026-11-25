# Mission — guide complet du domaine métier

**Objet :** transformer une intention ou une opportunité en engagement structuré avec un propriétaire, des participants, un résultat et un cycle de vie traçable.  
**État :** contrat métier/API historique consolidé ; l'implémentation runtime complète n'est pas établie par les sources disponibles.

## 1. Mission et périmètre

Une Mission représente une activité concrète nécessitant la participation d'une ou plusieurs personnes pour atteindre un résultat défini. Elle est distincte d'un Flash : le Flash exprime et diffuse une intention courte ; la Mission formalise un engagement, ses responsabilités, ses participants, son avancement et sa clôture.

Le domaine Mission est propriétaire de ses données et de ses transitions. Les autres domaines peuvent consommer des événements Mission, mais ne peuvent pas modifier directement l'état, les participants ou le résultat d'une mission.

## 2. Parcours utilisateur complet

### 2.1 Créer et préparer
1. Un utilisateur authentifié initie une mission et devient son propriétaire.
2. Il définit l'objectif, la description, les informations nécessaires, les dates, la visibilité et les critères de réussite.
3. Il peut enregistrer un brouillon sans le rendre public.
4. Le domaine vérifie la cohérence et les champs réellement obligatoires avant toute publication.
5. Le propriétaire peut consulter et modifier les éléments autorisés tant que l'état le permet.

Une mission peut être initiée à partir d'un Flash, mais elle devient un objet métier autonome. La création depuis un Flash ne transfère pas automatiquement les permissions ni ne fusionne les cycles de vie.

### 2.2 Publier et recevoir des participations
1. Le propriétaire vérifie le contenu et la visibilité.
2. La publication est acceptée uniquement si les champs obligatoires et les droits sont valides.
3. Les personnes autorisées peuvent consulter la mission et demander à participer ou la rejoindre selon les règles métier.
4. Le domaine enregistre les participations et leurs changements.
5. Le propriétaire et les participants voient uniquement les informations permises par leur rôle.

Les règles détaillées d'éligibilité, de capacité, de sélection, de retrait et de validation doivent être définies dans le contrat métier avant activation ; le contrat API historique ne suffit pas à les inférer.

### 2.3 Réaliser, terminer et archiver
Le propriétaire et les participants suivent l'avancement selon les rôles accordés. La fin de mission doit être explicitement enregistrée et validée selon les critères de réussite définis. Une mission terminée ne peut pas être modifiée librement ; toute correction doit suivre une règle métier auditée. L'archivage conserve la trace utile et retire la mission des vues actives selon les permissions. La suppression suit une politique distincte et ne doit pas effacer les obligations de traçabilité applicables.

## 3. Cycle de vie métier documenté

Le contrat historique propose : `Draft → Published → In Progress → Completed → Archived → Deleted`.

- **Draft :** préparation privée, modifiable par le propriétaire.
- **Published :** mission publiée et visible selon sa politique.
- **In Progress :** mission engagée, avec participants ou activité en cours.
- **Completed :** résultat déclaré terminé selon les critères.
- **Archived :** mission conservée hors des vues actives.
- **Deleted :** suppression selon les règles de conservation.

Les transitions exactes, les rôles habilités, les annulations et les états intermédiaires doivent être explicités dans un contrat versionné avant de traiter cette proposition historique comme une machine d'état implémentée.

## 4. Règles métier et invariants

- Une mission possède un propriétaire unique.
- La publication exige les informations indispensables et une autorisation valide.
- Les changements d'état sont historisés.
- Chaque participation est tracée.
- Une mission terminée est protégée contre les modifications ordinaires.
- Les niveaux de confiance ne sont jamais calculés par Mission ; le domaine Trust décide de l'effet éventuel des preuves confirmées.
- Une détection Radar ou une recommandation ne crée pas automatiquement une mission.
- Une mission reste la source de vérité pour ses participants, son avancement et son résultat.

## 5. Sécurité, rôles et confidentialité

Toutes les opérations sensibles sont authentifiées, autorisées et journalisées. Le propriétaire administre sa mission ; les participants agissent selon les droits associés à leur participation. Les visiteurs non autorisés ne peuvent pas consulter les missions privées ni effectuer de mutation. La visibilité publique, les pièces jointes et les informations de participants doivent respecter les règles du domaine et les autorisations individuelles.

Le contrat historique prévoit une dépendance à Auth pour l'accès, à l'UDI pour identifier le propriétaire et éventuellement à Media pour les pièces jointes. Ces dépendances ne donnent pas à ces domaines la propriété des données Mission.

## 6. API et événements métier

Le contrat historique propose les opérations suivantes : créer, lire, modifier et supprimer une mission ; consulter ses missions ; consulter les missions accessibles ; publier ; rejoindre ; quitter ; terminer ; archiver. Les chemins REST proposés sont `POST /missions`, `GET /missions/{id}`, `PATCH /missions/{id}`, `DELETE /missions/{id}`, `GET /missions/me`, `GET /missions` et les commandes dédiées `publish`, `join`, `leave`, `complete`, `archive`.

Événements proposés : `MissionCreated`, `MissionUpdated`, `MissionPublished`, `MissionJoined`, `MissionLeft`, `MissionCompleted`, `MissionArchived`, `MissionDeleted`. Ces noms et routes sont des contrats historiques cibles, pas la preuve de endpoints actifs.

## 7. Architecture et état d'implémentation

Le contrat situe le domaine entre l'interface, Mission API, Mission Domain et la base de données. Les recherches de code de la branche documentaire ne montrent pas de module applicatif Mission autonome comparable à Flash, Scan ou Radar ; les migrations de sécurité des transitions Mission existent dans le dépôt. Cette présence SQL ne suffit pas à prouver le parcours complet, les API, les écrans ou les tests fonctionnels.

Avant de déclarer Mission opérationnel, inventorier et valider les routes, contrats TypeScript, dépôts, politiques RLS, commandes SQL, migrations, UI, tests et flux de synchronisation sur le commit courant.

## 8. Critères de validation

Tester propriété unique, isolation inter-comptes, publication conditionnelle, visibilité, participation, retrait, rôles, transitions invalides, concurrence, audit, terminaison, archivage, suppression et événements. Vérifier qu'aucun consommateur externe ne peut modifier directement les données ou l'état Mission.

## 9. Sources conservées

Le contrat historique `7. Mission API.md` reste conservé comme source de propositions d'endpoints et d'événements. Ce guide rassemble le modèle, les parcours, les responsabilités et les limites sans exiger de consulter un autre moteur.