# Onboarding Vitalis — V1

## Objectif

Présenter Vitalis avant la première utilisation sans imposer de compte, de formulaire ni de parcours complexe. L'onboarding présente d'abord l'application dans son ensemble, puis fait découvrir les moteurs par paires et les espaces complémentaires.

## Parcours validé — cinq écrans

| Étape                  | Contenu                                                                   | Intention                                     |
| ---------------------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| 1. Vitalis             | Vision, promesse et utilité globale de l'application                      | Comprendre Vitalis avant ses fonctionnalités  |
| 2. Flash + Scan        | Présentation courte des deux moteurs                                      | Découvrir et explorer                         |
| 3. Réel + Radar        | Présentation courte des deux moteurs ; Réel est utilisable en mode invité | Comprendre la présence locale et le repérage  |
| 4. 2×2                 | Présentation du menu et des espaces/fonctionnalités complémentaires       | Comprendre où trouver les espaces secondaires |
| 5. Entrer dans Vitalis | Invitation humaine et bouton « C'est parti ! »                            | Rejoindre directement Home                    |

2×2 est un accès aux espaces complémentaires, pas un cinquième moteur. La navigation principale conserve cinq icônes : Flash, Scan, Réel, Radar et 2×2 ; le dernier contrôle ouvre le menu secondaire.

## Comportement

- Affichage au premier lancement, puis une seule fois après complétion.
- Progression visible sur cinq étapes.
- Les cartes Flash/Scan et Réel/Radar restent empilées sur mobile et passent en deux colonnes sur écran moyen ou large.
- Navigation Retour/Suivant.
- Possibilité de passer ou de fermer l'onboarding.
- La validation, le passage ou la fermeture mémorisent la complétion sur l'appareil.
- La dernière action et le passage conduisent à la route Home `/`.
- Le nouvel onboarding utilise une clé de persistance versionnée distincte de l'ancien écran minimal.
- Langues V1 : français et anglais.
- Compatible avec le mode invité : aucun compte n'est requis pour découvrir l'application ou utiliser Réel en mode invité.
- L'onboarding n'est pas une page d'inscription et ne collecte pas de données personnelles.

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
- [ ] Réel et Radar présentés ensemble.
- [ ] Réel accessible en mode invité sans compte obligatoire.
- [ ] 2×2 présenté sur une étape dédiée comme menu des espaces complémentaires.
- [ ] Dernière étape avec invitation humaine et entrée directe vers Home.
- [ ] Progression sur cinq étapes avec Retour/Suivant.
- [ ] Passage possible sans répétition à chaque lancement.
- [ ] Parcours utilisable en français et en anglais.
- [ ] Navigation, progression et persistance testées.
- [ ] Aucun écran ne force la création d'un compte.
