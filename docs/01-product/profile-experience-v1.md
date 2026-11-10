# Parcours du profil — V1

## Principe

Le profil s'ouvre en deux temps afin de donner accès aux informations utiles sans interrompre la navigation.

1. **Aperçu rapide** : un appui sur l'avatar du header ouvre une feuille légère avec les initiales, le nom affiché et, lorsqu'il existe, l'identifiant public. Un accès explicite mène au profil complet.
2. **Profil complet** : « Voir le profil complet » ouvre la page personnelle, organisée en sections courtes et indépendantes.

## Sections de la page complète

- **Identité** : nom affiché obligatoire et identifiant public facultatif.
- **Préférences** : langue de l'application.
- **Informations protégées** : rappel des champs système gérés par Vitalis et non modifiables depuis cette page.

Les actions sont contextuelles : ajouter ou modifier un identifiant public, modifier le nom affiché et choisir la langue. L'identifiant public facultatif peut être supprimé après confirmation. Le nom affiché reste obligatoire et ne peut pas être supprimé. Les champs système (identité, confiance, statut et vérification) restent en lecture seule.

## Règles d'interface

- Sections aérées, titres simples, cartes sobres et actions visibles sans surcharge.
- Pas de long formulaire : chaque modification se fait directement dans la section concernée.
- Enregistrer les changements avec un retour clair ; distinguer l'enregistrement confirmé de l'erreur.
- Les valeurs absentes restent réellement absentes : ne jamais afficher de faux nom, avatar, statut, score ou activité.
- L'aperçu rapide ne montre que des informations utiles et non sensibles.
- Les données publiques ne sont montrées que selon les consentements et règles de visibilité du profil.

## État technique V1

Le header ouvre l'aperçu rapide et le lien « Voir le profil complet » mène à la page personnelle. La page lit et met à jour les champs autorisés de `profiles` : `display_name`, `handle` et `locale`. L'identifiant public peut être ajouté, modifié ou supprimé avec confirmation ; le nom affiché est modifiable mais reste obligatoire. La langue est enregistrée dans le profil et appliquée immédiatement.

Le profil rapide affiche le nom et l'identifiant public lorsqu'il est renseigné. En l'absence de photo exploitable, les initiales sont utilisées ; aucune image publique ou URL de stockage privée n'est inventée.

La photo, la biographie, les domaines d'intérêt, les réglages avancés de visibilité et la suppression du compte ne sont pas proposés comme des actions disponibles : leur stockage, leur consentement ou leur parcours sécurisé doivent d'abord être validés. Les niveaux d'identité, la confiance, le statut et les autres champs système restent pilotés par Vitalis.
