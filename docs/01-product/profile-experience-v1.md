# Parcours du profil — V1

## Principe

Le profil s'ouvre en deux temps afin de donner accès aux informations utiles sans interrompre la navigation.

1. **Aperçu rapide** : un appui sur l'avatar du header ouvre une feuille légère avec les initiales, le nom affiché et, lorsqu'il existe, l'identifiant public. Un accès explicite mène au profil complet.
2. **Profil complet** : « Voir le profil complet » ouvre la page personnelle, organisée en sections courtes et indépendantes.

Le profil est une partie de l'espace personnel, mais il ne doit pas absorber « Mes informations » ni les paramètres généraux de l'application. Voir [Espaces personnels et gestion indépendante des moteurs — V1](./personal-and-engine-management-v1.md).

## Sections du profil

- **Identité publique** : nom affiché obligatoire et identifiant public facultatif.
- **Présentation** : avatar, description et autres éléments facultatifs uniquement lorsque leur stockage, leur consentement et leur visibilité sont sécurisés.
- **Aperçu du profil** : rendu fidèle des seules informations qu'une autre personne est autorisée à voir.
- **Paramètres du profil** : champs de présentation et préférences de visibilité réellement disponibles.

Les informations de compte et de connexion sont gérées dans « Mes informations ». La langue, le thème, l'accessibilité et les préférences globales relèvent des « Paramètres de l'application », pas des paramètres du profil.

## Règles d'interface

- Sections aérées, titres simples, cartes sobres et actions visibles sans surcharge.
- Pas de long formulaire : chaque modification se fait directement dans la section concernée.
- Enregistrer les changements avec un retour clair ; distinguer l'enregistrement confirmé de l'erreur.
- Les valeurs absentes restent réellement absentes : ne jamais afficher de faux nom, avatar, statut, score ou activité.
- L'aperçu rapide ne montre que des informations utiles et non sensibles.
- Les données publiques ne sont montrées que selon les consentements et règles de visibilité du profil.
- L'aperçu public ne doit jamais reprendre automatiquement les informations privées du compte.

## État technique V1

Le header ouvre l'aperçu rapide et le lien « Voir le profil complet » mène à la page personnelle. La page lit et met à jour les champs autorisés de `profiles` : `display_name`, `handle` et `locale`. L'identifiant public peut être ajouté, modifié ou supprimé avec confirmation ; le nom affiché est modifiable mais reste obligatoire.

**Écart de présentation à résorber :** la langue est actuellement affichée dans la section Préférences du profil, alors qu'elle appartient conceptuellement aux Paramètres de l'application. Le stockage existant de `locale` dans `profiles` peut être conservé ; l'interface doit simplement présenter ce réglage dans le bon espace lors de la prochaine étape de mise en place.

Le profil rapide affiche le nom et l'identifiant public lorsqu'il est renseigné. En l'absence de photo exploitable, les initiales sont utilisées ; aucune image publique ou URL de stockage privée n'est inventée.

La photo, la biographie, les domaines d'intérêt, les réglages avancés de visibilité et la suppression du compte ne sont pas proposés comme des actions disponibles : leur stockage, leur consentement ou leur parcours sécurisé doivent d'abord être validés. Les niveaux d'identité, la confiance, le statut et les autres champs système restent pilotés par Vitalis.
