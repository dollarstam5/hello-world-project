# Aperçus publics de profil dans les résultats — V1

**Objectif :** permettre de comprendre rapidement qui a publié un besoin ou une proposition, sans transformer les résultats en fiches surchargées ni exposer des informations privées.

## 1. Présentation compacte

Ordre de lecture d'une carte :

1. Avatar de 36 à 40 px et nom d'affichage.
2. Zone large partagée volontairement et catégorie courte.
3. Besoin ou proposition, qui reste l'information principale.
4. Une action discrète « Consulter ce profil » ouvre une fiche courte.

Ne pas afficher plusieurs lignes de biographie, d'indicateurs ou de statistiques dans la carte. La description personnelle est réservée à la fiche de consultation.

## 2. Contrat public minimal

`PublicProfilePreview` ne contient que :

- `publicProfileId` : identifiant opaque public, jamais l'identifiant interne du compte ;
- `displayName` : nom d'affichage choisi par la personne ;
- `avatarUrl` : photo uniquement si elle provient d'un stockage public approuvé et si la personne l'a autorisée ; sinon `null` et initiales ;
- `areaLabel` : ville ou zone large choisie, jamais une adresse ni des coordonnées ;
- `summary` : courte présentation personnelle rédigée par la personne ;
- `category` : catégorie pertinente déjà reconnue par Vitalis.

L'aperçu n'inclut pas de contact, d'adresse précise, de distance, de présence, de disponibilité, d'âge, de statut de confiance, de note ou de nombre d'interactions.

## 3. Consentement et confidentialité

- Le serveur ne renvoie `authorPreview` que si la personne a activé la visibilité publique de son profil et autorisé ces champs.
- Une publication peut rester publique sans rendre son auteur consultable.
- Si l'aperçu est absent, l'interface affiche la publication sans nom ni avatar. Aucun nom de remplacement ne doit être inventé.
- Le nom et la présentation sont du contenu utilisateur : afficher sobrement, limiter la longueur dans la carte et prévoir le repli sur plusieurs lignes dans la fiche.
- L'avatar doit être une ressource première partie, modifiable et révocable. Tant que le stockage et les règles de consentement ne sont pas définis, utiliser les initiales.
- Les données de profil ne doivent jamais être extraites de coordonnées, d'identifiants SQL ou d'informations privées.

## 4. Fiche de consultation

L'appui sur l'avatar ou le nom ouvre une feuille de consultation mobile :

- avatar ou initiales ;
- nom d'affichage ;
- zone large ;
- catégorie ;
- présentation courte ;
- marqueur « Exemple » pour les profils fictifs.

Aucun moyen de contact n'est proposé depuis cette fiche de base. Une mise en relation ou un échange devra suivre le parcours dédié au moteur et ses règles d'autorisation. La fiche ne doit pas suggérer qu'une identité a été vérifiée.

## 5. Adaptation par moteur

| Moteur                   | Affichage autorisé                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accueil                  | Trois aperçus pédagogiques Flash ; avatar à initiales, nom fictif, zone, catégorie et besoin.                                                          |
| Flash                    | Aperçu public de l'auteur si consentement ; fiche courte au toucher. Sinon, carte sans identité.                                                       |
| Scan                     | Même aperçu facultatif pour les résultats publics Flash ; la distance reste distincte du lieu du profil et ne remplace jamais `areaLabel`.             |
| Réel                     | Aucun profil fictif dans les personnes présentes. Une carte réelle ne montre un profil que si sa présence et sa visibilité sont actives et autorisées. |
| Radar                    | Profil facultatif lié à une opportunité publique ; aucun faux match, statut ou dernière activité.                                                      |
| 2×2 / Talents            | Catégorie et présentation publique uniquement si la personne les a rendues visibles dans ce contexte.                                                  |
| Notifications / Messages | Ne jamais injecter des profils fictifs dans les communications réelles.                                                                                |

## 6. État de l'intégration

La structure partagée, les profils d'exemple Flash, le composant compact et la fiche de consultation sont ajoutés à la branche de travail. Flash et Accueil peuvent présenter les identités fictives explicitement marquées ; Scan affiche l'aperçu seulement si le RPC lui fournit un auteur public autorisé.

**Limite technique à traiter avant d'afficher les profils réels :** les RPC `list_public_flashes` et `scan_public_flashes` ne renvoient actuellement pas de projection d'auteur dans le contrat observé. Le code accepte désormais un champ facultatif `author_preview`, mais aucune identité réelle n'est inventée ni récupérée depuis une table privée. Une migration SQL et une revue RLS/consentement dédiées seront nécessaires pour alimenter ce champ en production.
