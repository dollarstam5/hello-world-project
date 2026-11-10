# Parcours du profil — V1

## Principe

Le profil s'ouvre en deux temps afin de donner accès aux informations utiles sans interrompre la navigation.

1. **Aperçu rapide** : un appui sur l'avatar du header ouvre une feuille légère avec l'avatar ou les initiales, le nom affiché, le niveau d'identité connu et un accès explicite à la page complète.
2. **Profil complet** : « Voir le profil complet » ouvre l'espace personnel, organisé en sections courtes et indépendantes.

## Sections de la page complète

- **Identité** : nom affiché, identifiant public et présentation.
- **Votre activité** : informations et préférences utiles au fonctionnement des espaces, sans inventer de statistiques.
- **Préférences** : langue et mode d'accompagnement.
- **Confidentialité** : visibilité du profil et choix des informations partagées.
- **Compte et sécurité** : informations de compte et actions sensibles.

Chaque section doit proposer ses propres actions contextuelles : ajouter une information absente, modifier une information existante ou supprimer une information facultative. Les actions destructives demandent confirmation. Les champs système (niveau d'identité, confiance, vérification) sont en lecture seule et ne peuvent pas être supprimés ou modifiés par l'utilisateur.

## Règles d'interface

- Sections aérées, titres simples, cartes sobres et actions visibles sans surcharge.
- Pas de long formulaire initial : ouvrir un petit dialogue ciblé au moment où la personne choisit une action.
- Enregistrer les changements avec retour clair ; distinguer brouillon local, enregistrement confirmé et erreur.
- Les valeurs absentes restent réellement absentes : ne jamais afficher de faux nom, avatar, statut, score ou activité.
- L'aperçu rapide ne montre que des informations utiles et non sensibles.
- Les données publiques ne sont montrées que selon les consentements et règles de visibilité du profil.

## État technique

Le header ouvre un aperçu rapide et le lien « Voir le profil complet » mène à la page personnelle. Cette page lit et met à jour les champs autorisés de `profiles` : nom affiché, identifiant public et langue. L’identifiant public peut être ajouté, modifié ou supprimé avec confirmation ; le nom affiché reste obligatoire. Les changements passent par la session Supabase et les droits de colonnes/RLS existants. Les niveaux d’identité, la confiance, le statut et les autres champs système restent pilotés par Vitalis.

La photo de profil, la biographie et les réglages de visibilité avancés ne sont pas encore raccordés à un stockage et à un modèle de consentement validés ; l’interface ne les simule donc pas.
