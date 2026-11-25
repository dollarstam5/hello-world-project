# Radar — guide complet du moteur

**Objet :** transformer une intention en mission de recherche persistante, privée et configurable.  
**Action centrale :** enregistrer, qualifier puis valider une mission Radar.  
**État :** le stockage et le cycle de vie de la veille sont documentés ; la recherche automatique n'est pas déclarée active.

## 1. Mission et périmètre

Radar conserve un objectif de recherche et ses critères afin de le suivre dans le temps. L'utilisateur peut surveiller une ou plusieurs zones, même éloignées de sa position actuelle. Radar est responsable de la définition, de la qualification, de l'activation, du suivi et des résultats de sa propre mission. Une correspondance n'est pas un engagement contractuel et ne crée pas automatiquement une Mission.

## 2. Parcours utilisateur complet

### 2.1 Créer une intention
1. L'utilisateur exprime ce qu'il recherche.
2. Radar conserve une intention exploitable comme brouillon privé, même si certains critères sont inconnus.
3. Le moteur distingue les données nécessaires à la sauvegarde de celles indispensables à l'activation.
4. Les champs manquants sont présentés comme inconnus ; aucune zone ou contrainte n'est inventée.

### 2.2 Configurer
Avant activation, l'utilisateur examine et confirme :
- objectif et catégorie ;
- critères stricts et préférences ;
- une ou plusieurs zones choisies (indépendantes de sa position courante) ;
- rayon par zone lorsque pris en charge ;
- durée de mission ;
- stratégie et sources autorisées.

Le contrat technique documenté autorise les rayons 1, 3, 5, 10, 25 et 50 km et une durée de 3 à 90 jours. Ces valeurs sont propres à Radar. Les paramètres par défaut sont distincts de ceux de chaque mission.

### 2.3 Valider et suivre
L'utilisateur relit l'objectif, la stratégie, les zones et la durée, puis confirme explicitement le lancement. Le moteur peut ensuite produire des correspondances et évolutions uniquement lorsque les sources, le traitement planifié et les contrôles sont réellement opérationnels. Toute modification importante de stratégie, de rayon, de durée ou de critères requiert une validation de l'utilisateur.

Une absence de résultats doit être distinguée d'une panne ou d'une source non consultée. Chaque correspondance doit indiquer sa source, sa date, les critères satisfaits/non satisfaits, la zone, la période et les limites.

### 2.4 Gérer la mission
Le propriétaire peut consulter, modifier les critères en brouillon, activer si les prérequis sont remplis, suspendre, reprendre, revalider ou annuler selon les transitions autorisées. Les critères d'une mission restent privés au propriétaire. La durée de mission et la fréquence de revue sont des notions distinctes.

## 3. Cycle de vie technique documenté

États : `draft`, `active`, `watching`, `matched`, `paused`, `expired`, `cancelled`.

- `draft` : critères privés modifiables ; veille inactive.
- `active` : veille activée et prochaine revue programmée.
- `watching` : traitement de correspondances en cours, si le moteur correspondant existe.
- `matched` : au moins une correspondance disponible.
- `paused` : suspendue par le propriétaire.
- `expired` : échéance atteinte, état terminal.
- `cancelled` : arrêt volontaire, état terminal.

Activation et reprise programment une revue dans un délai maximal de sept jours, sans dépasser l'expiration. Une valeur de statut enregistrée ne prouve pas qu'un job de recherche s'exécute.

## 4. Données, sécurité et confidentialité

Les critères et zones sont des données privées du propriétaire. Les règles RLS limitent lecture et création au propriétaire ; les critères sont modifiables directement seulement en brouillon ; statut, échéances, propriétaire et dates système sont protégés. Les transitions passent par la commande serveur/PostgreSQL `command_radar`, qui verrouille la ligne et applique les règles métier.

Le modèle documenté stocke une zone textuelle approximative et ne conserve pas de latitude/longitude précises. Cela ne prouve ni géolocalisation précise ni surveillance géographique automatique.

## 5. Architecture et responsabilités

Contrat : `packages/core-contracts/src/radar.ts`. Logique de cycle de vie : `packages/core-logic/src/radar.ts`. Stockage local : table IndexedDB `radars`; dépôt offline-first et outbox de synchronisation ; transitions via `command_radar`. UI et route : `src/modules/radar/`, `src/routes/radar.tsx`. Sécurité SQL : migration `20260912010000_secure_radar_lifecycle.sql`.

## 6. État d'implémentation connu

L'interface V1 permet d'enregistrer, modifier et annuler une veille privée en brouillon, de consulter les veilles du compte et de synchroniser les données. En revanche, le moteur de correspondances, le traitement planifié, les résultats automatiques et les alertes ne sont pas déclarés raccordés. Le formulaire exige historiquement un texte et un libellé de zone ; la conformité au principe de sauvegarde partielle doit être vérifiée et corrigée si cette exigence n'est pas strictement nécessaire.

## 7. Critères de validation

Tester isolation propriétaire, création partielle en brouillon, transitions autorisées/interdites, échéances, pause/reprise, revalidation, synchronisation offline, idempotence, absence de coordonnées précises, absence de faux résultats et preuve de fonctionnement du job planifié avant d'afficher « surveillance active ».

## 8. Sources conservées

La charte Radar, le module technique, le statut V1 et le contrat API historique restent des références détaillées. Le présent guide décrit à lui seul le parcours et les règles du moteur.