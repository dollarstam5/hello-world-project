# Onboarding Vitalis — V1

## Objectif

Présenter Vitalis avant la première utilisation sans imposer de compte, de formulaire ni de parcours complexe. L'onboarding présente d'abord l'application dans son ensemble, puis fait découvrir les moteurs par paires et les espaces complémentaires.

## Parcours validé — cinq écrans

| Étape                  | Contenu                                                                   | Intention                                     |
| ---------------------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| 1. Vitalis             | Vision, promesse et utilité globale de l'application                      | Comprendre Vitalis avant ses fonctionnalités  |
| 2. Flash + Scan        | Présentation courte des deux moteurs                                      | Découvrir et explorer                         |
| 3. En direct + Radar        | Présentation courte des deux moteurs ; En direct est utilisable en mode invité | Comprendre la présence locale et le repérage  |
| 4. 2×2                 | Présentation du menu et des espaces/fonctionnalités complémentaires       | Comprendre où trouver les espaces secondaires |
| 5. Entrer dans Vitalis | Invitation humaine et bouton « C'est parti ! »                            | Rejoindre directement Home                    |

2×2 est un accès aux espaces complémentaires, pas un cinquième moteur. La navigation principale conserve cinq icônes : Flash, Scan, En direct, Radar et 2×2 ; le dernier contrôle ouvre le menu secondaire.

## Comportement

- Affichage au premier lancement, puis une seule fois après complétion.
- Progression visible sur cinq étapes.
- Les cartes Flash/Scan et En direct/Radar restent empilées sur mobile et passent en deux colonnes sur écran moyen ou large.
- Navigation Retour/Suivant.
- Possibilité de passer ou de fermer l'onboarding.
- La validation, le passage ou la fermeture mémorisent la complétion sur l'appareil.
- La dernière action et le passage conduisent à la route Home `/`.
- Le nouvel onboarding utilise une clé de persistance versionnée distincte de l'ancien écran minimal.
- Langues V1 : français et anglais.
- Compatible avec le mode invité : aucun compte n'est requis pour découvrir l'application ou utiliser En direct en mode invité.
- L'onboarding n'est pas une page d'inscription et ne collecte pas de données personnelles.

## Parcours après la découverte : invité, inscription et membre

L'onboarding explique Vitalis ; il ne remplace pas le guide contextuel de la page d'accueil ni le parcours d'inscription. Les trois étapes doivent rester cohérentes sans transformer la découverte en tunnel obligatoire.

### 1. Première arrivée — visiteur / invité

- La personne découvre la promesse de Vitalis et les quatre moteurs sans créer de compte.
- La page d'accueil reconnaît le visiteur comme **Invité** tant qu'aucune session authentifiée n'est disponible.
- Un repère court propose deux chemins réellement accessibles : découvrir En direct en mode invité ou créer un compte.
- Aucun compte, profil, historique membre ou droit membre n'est attribué au mode invité.
- Les cartes d'exemple restent explicitement marquées « Exemple » et ne sont jamais présentées comme de l'activité réelle.

### 2. Moment de l'inscription

La création de compte est proposée lorsqu'elle apporte une valeur concrète, notamment pour enregistrer et retrouver ses Flashs ou gérer son profil. Elle ne doit pas bloquer la découverte initiale ni l'accès invité à En direct.

Le formulaire d'inscription V1 reste court :
- nom affiché ;
- adresse e-mail ;
- mot de passe.

Le nom affiché est transmis comme métadonnée Auth `display_name`, puis repris par le déclencheur existant de création de profil. Il ne constitue ni une preuve d'identité ni un niveau de confiance. Si la confirmation d'adresse e-mail est requise et qu'aucune session n'est créée, Vitalis explique simplement qu'il faut consulter la boîte mail ; il ne présente pas la personne comme déjà connectée.

### 3. Retour après inscription — membre reconnu

- La session Auth réelle est la source de vérité pour distinguer **Membre** et **Invité**.
- La page d'accueil adapte son repère et propose l'accès au profil.
- Le membre peut compléter ou modifier son nom affiché et son identifiant public depuis son profil.
- Les niveaux Identifié, Vérifié et De confiance ne sont affichés que lorsqu'une source UDI fiable les fournit ; ils ne sont jamais déduits de la simple création du compte.
- La création du compte ne transforme pas rétroactivement une session invitée en historique membre et ne réattribue pas ses identifiants temporaires.

### 4. Premiers usages et accompagnement progressif

| Moment réel | Accompagnement utile | Garde-fou |
| --- | --- | --- |
| Première visite | Expliquer les moteurs et les chemins accessibles | Une aide à la fois, aucune activité simulée |
| Découverte En direct | Expliquer séparément découverte de proximité et activation de présence | Demander les permissions au moment utile ; ne pas activer la présence automatiquement |
| Première tentative d'enregistrement Flash | Expliquer pourquoi un compte est nécessaire et proposer l'inscription | Ne confirmer qu'après retour réussi du domaine |
| Première recherche Scan | Expliquer la demande de position et le caractère volontaire de la recherche | Ne pas demander la position depuis l'accueil |
| Première veille Radar | Expliquer l'enregistrement privé et ses limites actuelles | Ne pas promettre de matching ou d'alerte automatique |
| Retour d'un membre | Retrouver son espace, son profil et les actions réellement disponibles | Pas de répétition de l'onboarding ni de prénom à chaque visite |

L'accompagnement peut devenir plus discret à mesure que la personne connaît les moteurs. En V1, aucune progression individuelle fictive, aucun compteur de premières actions et aucune personnalisation fondée sur un usage non mesuré ne sont autorisés. Les suggestions futures devront s'appuyer sur des événements métier confirmés ou des préférences réellement enregistrées.

## Ton et contenu

Le ton est humain, accueillant, direct et sans jargon. Chaque moteur et chaque espace sont présentés brièvement, sans promettre une capacité qui n'est pas encore implémentée.

## Hors périmètre V1

- Inscription obligatoire ou identification imposée pendant l'onboarding.
- Formulaires longs.
- Assistant conversationnel adaptatif, vocal ou « calling » (V2/V3).
- Collecte de données personnelles pendant la présentation.

## Critères d'acceptation

- [ ] Présentation générale de Vitalis en première étape.
- [ ] Flash et Scan présentés ensemble.
- [ ] En direct et Radar présentés ensemble.
- [ ] En direct accessible en mode invité sans compte obligatoire.
- [ ] 2×2 présenté sur une étape dédiée comme menu des espaces complémentaires.
- [ ] Dernière étape avec invitation humaine et entrée directe vers Home.
- [ ] Progression sur cinq étapes avec Retour/Suivant.
- [ ] Passage possible sans répétition à chaque lancement.
- [ ] Parcours utilisable en français et en anglais.
- [ ] Navigation, progression et persistance testées.
- [ ] Aucun écran ne force la création d'un compte.
- [ ] La dernière étape adapte son explication à une session invitée ou membre réellement reconnue.
- [ ] La page d'accueil distingue l'invité du membre à partir de la session Auth.
- [ ] L'invité voit le chemin En direct sans compte et une proposition facultative de création de compte.
- [ ] Le membre voit un accès à son profil sans recevoir de relance d'inscription.
- [ ] L'inscription demande un nom affiché, un e-mail et un mot de passe ; le nom est transmis au profil par les métadonnées Auth.
- [ ] Une inscription en attente de confirmation e-mail n'est jamais présentée comme une session membre active.
- [ ] Les textes d'accueil et de découverte décrivent uniquement les capacités V1 réellement disponibles.
