# Parcours du profil — V1

## Principe

Le profil s'ouvre en deux temps afin de donner accès aux informations utiles sans interrompre la navigation.

1. **Aperçu rapide** : un appui sur l'avatar du header ouvre une feuille légère avec les initiales, le nom affiché et, lorsqu'il existe, l'identifiant public. Un accès explicite mène au profil complet.
2. **Profil complet** : « Voir le profil complet » ouvre la page Mon profil depuis l'espace personnel.

Le profil est une partie de l'espace personnel, mais il ne doit pas absorber « Mes informations » ni les paramètres généraux de l'application. Voir [Espaces personnels et gestion indépendante des moteurs — V1](./personal-and-engine-management-v1.md).

## Accès et sections

Le tableau de bord personnel `/espace` donne accès à des pages distinctes :

- **Mon profil** (`/espace/profil`) : nom affiché et identifiant public facultatif.
- **Mes informations** (`/espace/informations`) : informations de compte actuellement disponibles, dont l'adresse de connexion ; elles ne sont pas publiques.
- **Paramètres du profil** (`/espace/parametres/profil`) : page de statut qui explique que les réglages de visibilité ne sont pas encore disponibles et que le profil reste privé par défaut.
- **Aperçu du profil** (`/espace/apercu`) : page de statut honnête ; aucun aperçu public fictif n'est généré.
- **Paramètres de l'application** (`/espace/parametres/application`) : langue et apparence (sombre, clair ou automatique), persistées sur l'appareil.

## Identité du profil

- Nom affiché obligatoire.
- Identifiant public facultatif, ajoutable, modifiable et supprimable après confirmation.
- Les niveaux d'identité, de confiance et les champs système restent pilotés par Vitalis.
- La photo, la biographie et les informations de présentation ne sont pas proposées tant que leur stockage, leur consentement et leur visibilité ne sont pas sécurisés.

## Règles d'interface

- Sections aérées, titres simples, cartes sobres et actions visibles sans surcharge.
- Pas de long formulaire : chaque modification se fait directement dans la section concernée.
- Enregistrer les changements avec un retour clair ; distinguer l'enregistrement confirmé de l'erreur.
- Les valeurs absentes restent réellement absentes : ne jamais afficher de faux nom, avatar, statut, score ou activité.
- L'aperçu rapide ne montre que des informations utiles et non sensibles.
- Les données publiques ne sont montrées que selon les consentements et règles de visibilité du profil.
- L'aperçu public ne doit jamais reprendre automatiquement les informations privées du compte.

## État technique V1

Le header ouvre l'aperçu rapide et le lien « Voir le profil complet » mène à `/espace/profil`. La page lit et met à jour les champs autorisés de `profiles` : `display_name` et `handle`. L'identifiant public peut être ajouté, modifié ou supprimé avec confirmation ; le nom affiché est modifiable mais reste obligatoire.

La langue a été déplacée dans les Paramètres de l'application. Le choix de langue est persisté dans les préférences locales de Vitalis ; le thème utilise le magasin de préférences existant et persiste également sur l'appareil.

Les informations du compte sont lues depuis la session authentifiée. La page de visibilité du profil n'offre pas de bascule fictive : tant que les contrats serveur, le consentement et les règles de projection publique ne sont pas prêts, elle explique clairement que le profil reste privé par défaut.

Les photos d'avatar ne sont pas encore servies publiquement : le stockage actuel exige une authentification. L'aperçu personnel utilise donc les initiales jusqu'à validation d'un accès consenti et sécurisé.
