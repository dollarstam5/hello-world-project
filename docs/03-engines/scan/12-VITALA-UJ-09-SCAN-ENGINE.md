# VITALA-SCAN-ENGINE

**Document ID :** VITALA-ENGINE-02 **Titre :** Scan Engine — Moteur de découverte instantanée **Version :** 1.0 **Statut :** VALIDÉ

# DÉPENDANCES

- VITALA-VISION-V1
- VITALA-PERSONAS-V1
- VITALA-TRUST-LEVELS-V1
- VITALA-UJ-01 à UJ-07
- VITALA-FLASH-ENGINE
# 1. Objectif

Scan est le moteur de découverte instantanée de Vitala. Sa mission est d'explorer les informations actives de l'écosystème afin de répondre immédiatement à une intention utilisateur. Scan privilégie les résultats disponibles **maintenant**, proches dans le temps et pertinents.

# 2. Philosophie

Scan ne réalise pas une recherche classique. Scan explore l'écosystème Vitala pour identifier ce qui est actuellement disponible. Il fournit une photographie du présent.

# 3. Définition

Un Scan est une exploration intelligente des informations actives répondant à une intention exprimée par l'utilisateur.

Il ne recherche que des informations encore valides.

# 4. Fenêtre temporelle

Scan travaille uniquement sur les informations récentes. Par défaut :

- Maintenant
- Aujourd'hui
- Demain
- Jusqu'à 48 heures
Au-delà, les recherches sont prises en charge par Radar.

# 5. Sources analysées

Scan interroge les Flash encore actifs. Il peut retrouver :

- Opportunités
- Besoins
- Offres
- Services
- Produits
- Disponibilités
- Événements
- Informations utiles
- Alertes
- Partenariats
- Ressources
# 6. Déclenchement

Le moteur peut être lancé :

- Depuis la page Scan
- Après un Flash publié
- Depuis la recherche globale
- Par commande vocale
- Par l'assistant Vita

# 7. Compréhension naturelle

L'utilisateur peut simplement dire : « Je cherche un photographe disponible aujourd'hui. » ou « Y a-t-il une salle libre près de moi ? » Vita identifie automatiquement :

- l'intention;
- la catégorie;
- la localisation;
- la période;
- les critères importants.
# 8. Critères de recherche

Scan prend en compte :

- Proximité
- Catégorie
- Disponibilité
- Période
- Niveau de confiance
- Compatibilité avec la demande
- Préférences utilisateur
# 9. Animation Scan

Lors du lancement : Le moteur affiche son analyse. Exemple : 📍 Localisation… 📂 Analyse des catégories… ⚡ Recherche des informations actives… 🤝 Recherche des correspondances…

🛡 Vérification des preuves de confiance… ✨ Résultats prêts. L'animation doit être fluide, courte et compréhensible.

# 10. Résultats

Les résultats sont classés par pertinence. Chaque résultat présente :

- Titre
- Distance
- Temps restant avant expiration
- Localisation
- Statuts de confiance
- Pourquoi ce résultat est proposé
- Actions disponibles
# 11. Aucun résultat exact

Scan ne répond jamais simplement : « Aucun résultat. » Il accompagne l'utilisateur.

# 12. Suggestions intelligentes

Lorsque la recherche exacte échoue, Scan propose :

- Résultats similaires
- Catégories proches
- Zone voisine
- Dates alternatives
- Disponibilités compatibles
# 13. Explication

Chaque suggestion peut être justifiée.

Exemple : « Cette salle est proposée car elle correspond à votre capacité demandée et se situe à seulement 3 km. »

# 14. Transition vers Radar

Si aucun résultat satisfaisant n'est trouvé, Scan propose naturellement : Approfondir cette recherche avec Radar. L'utilisateur n'a pas besoin de recommencer sa recherche. Les critères sont transmis automatiquement.

# 15. Relation avec Flash

Après chaque publication Flash, Scan vérifie immédiatement si une solution existe déjà. Cela permet d'éviter des recherches inutiles et d'accélérer les mises en relation.

# 16. Relation avec Radar

Scan recherche le présent. Radar recherche dans le futur. Les deux moteurs sont complémentaires.

# 17. Relation avec Veille

Si la demande concerne un domaine général plutôt qu'un besoin précis, Scan peut suggérer la création d'une Veille.

# 18. Performance

Scan doit répondre rapidement. Objectif :

Quelques secondes maximum entre la demande et l'affichage des résultats.

# 19. Principes UX

## Principe 1

L'utilisateur formule une intention.

## Principe 2

Vita comprend naturellement cette intention.

## Principe 3

Scan privilégie les résultats utiles plutôt que les résultats nombreux.

## Principe 4

Les résultats sont expliqués.

## Principe 5

Il n'existe jamais d'impasse. Si Scan ne trouve pas de réponse, il propose toujours une suite logique.

## Principe 6

Le passage vers Radar est naturel et sans ressaisie.

# 20. Architecture recommandée

```
packages/
└── engines/
└── scan-engine/
├── parser/
├── matcher/
```

```
├── ranking/
├── suggestions/
├── explanation/
├── transition/
└── scan.types.ts
```
# 21. Critère de réussite

Le moteur Scan est réussi lorsque : Intention utilisateur ↓ Compréhension Vita ↓ Analyse instantanée ↓ Résultats pertinents ↓ Suggestions intelligentes si nécessaire ↓ Transition vers Radar si besoin sans jamais laisser l'utilisateur sans solution.

# Fin du document

Document ID : VITALA-ENGINE-02 Version : 1.0 Statut : VALIDÉ