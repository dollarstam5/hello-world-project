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

Le header dispose désormais d'un aperçu rapide et d'un accès vers l'espace personnel. La page complète et les opérations d'ajout, modification et suppression doivent être raccordées au modèle de profil persistant et à ses règles RLS avant d'être présentées comme fonctionnelles. Le niveau d'identité et les attributs de confiance restent pilotés par Vitalis.
