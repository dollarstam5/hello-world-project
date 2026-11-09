# Onboarding Vitalis — V1

## Objectif

Présenter Vitalis avant la première utilisation sans imposer de compte, de formulaire ni de parcours complexe. L'onboarding doit donner une compréhension globale de l'application, puis faire découvrir les quatre moteurs principaux par paires.

## Parcours

| Étape | Contenu | Intention |
|---|---|---|
| 1. Vitalis | Présentation de l'application et de sa promesse ; 2x2 est présenté comme accès aux espaces complémentaires | Comprendre l'ensemble avant les fonctionnalités |
| 2. Flash + Scan | Présentation courte de chaque moteur | Découvrir et explorer |
| 3. Réel + Radar | Présentation courte de chaque moteur | Présence locale et repérage des possibilités |
| 4. Entrer dans Vitalis | Invitation humaine et bouton « C'est parti ! » | Rejoindre directement l'accueil |

2x2 est un espace de navigation vers les fonctionnalités complémentaires, pas un cinquième moteur.

## Comportement

- Affichage une seule fois, au premier lancement tant que le parcours n'est pas terminé.
- Progression visible sur quatre étapes.
- Navigation Retour/Suivant.
- Possibilité de passer ou de fermer l'onboarding.
- La validation, le passage ou la fermeture mémorisent la complétion.
- La dernière action et le passage conduisent à la route d'accueil `/`.
- Le nouvel onboarding utilise une clé de persistance versionnée distincte de l'ancien écran minimal.
- Langues V1 : français et anglais.
- Compatible avec le mode invité : aucun compte n'est requis pour découvrir l'application ou utiliser Réel en mode invité.

## Ton et contenu

Le ton est humain, accueillant, direct et sans jargon. Chaque moteur est présenté avec une phrase courte, sans promettre une capacité qui n'est pas encore implémentée.

## Hors périmètre V1

- Inscription obligatoire ou identification imposée pendant l'onboarding.
- Formulaires longs.
- Assistant conversationnel adaptatif, vocal ou « calling » (V2/V3).
- Collecte de données personnelles pendant la présentation.

## Critères d'acceptation

- [ ] Présentation générale de Vitalis en première étape.
- [ ] Flash et Scan présentés ensemble.
- [ ] Réel et Radar présentés ensemble.
- [ ] 2x2 expliqué comme espace complémentaire.
- [ ] Dernière étape avec invitation humaine et entrée directe vers l'accueil.
- [ ] Passage possible sans perte de contrôle ni répétition à chaque lancement.
- [ ] Parcours utilisable en français et en anglais.
- [ ] Navigation, progression et persistance testées.
- [ ] Aucun écran ne force la création d'un compte.
