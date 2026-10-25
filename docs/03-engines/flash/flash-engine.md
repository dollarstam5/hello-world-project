# Flash Engine — référence canonique

**Statut :** référence active consolidée
**Périmètre :** intention, cycle de vie, diffusion et expérience du moteur Flash.
**Source primaire vérifiée :** [11-VITALA-UJ-08-FLASH-ENGINE.md](./11-VITALA-UJ-08-FLASH-ENGINE.md) (VITALA-ENGINE-01, v1.0, VALIDÉ)
**Contrat API cible :** [6. Flash API.md](./6.%20Flash%20API.md) — comportement cible, pas preuve de routes livrées (voir [statut des contrats](../../03-api/contract-runtime-status.md)).

## Mission

Flash est le moteur de diffusion principal de Vitala : permettre à une personne de diffuser rapidement une information, un besoin, une opportunité ou une disponibilité vers les personnes les plus pertinentes de l'écosystème.

Flash n'est **pas** un réseau social. Il ne maximise ni vues, ni likes, ni commentaires, ni viralité. Il maximise la pertinence, la rapidité, l'utilité, la mise en relation et le résultat réel.

## Définition

Un Flash est une information diffusée avec un objectif précis. Chaque Flash possède :

- une intention ;
- une durée de vie ;
- une zone d'application ;
- une catégorie ;
- un niveau de visibilité.

## Types de Flash

| Type | Exemples |
| --- | --- |
| Opportunité | Mission, besoin, recherche, collaboration, partenariat, projet |
| Disponibilité | Personne, service ou ressource disponible, salle disponible |
| Information utile | Information locale, alerte, changement important, signalement |
| Événement | Réunion, rencontre, formation, activité |
| Offre | Produit, service, ressource, location |

## Modes de création

- **Texte** : rédaction directe.
- **Voix** : la personne parle naturellement ; Vita extrait intention, catégorie, lieu, date, contraintes et durée.
- **Modes futurs** : image, document, pièce jointe, import externe.

Vita accompagne la création : elle comprend l'intention exprimée en langage naturel et ne demande que les informations manquantes.

## Structure d'un Flash

Identifiant · auteur · intention · type · catégorie · description · localisation · date de création · date d'expiration · visibilité · niveau de confiance requis · statut.

## Cycle de vie

```text
Brouillon → Analyse → Validation → Diffusé → En cours → Expiré → Archivé
                                                              ↘ Supprimé
```

### Validation automatique avant diffusion

Contrôles internes : spam, doublon, fraude potentielle, contenu interdit, cohérence minimale. Résultat : `Accepté`, `Refusé` ou `À compléter`.

### Durée de vie

Durées types : 1 h, 6 h, 24 h, 3 jours, 7 jours, 30 jours. À expiration : `Expiré` puis `Archivé`.

## Diffusion intelligente

Flash ne diffuse **jamais** à toute la plateforme. Critères de ciblage :

- proximité ;
- catégorie ;
- pertinence ;
- disponibilité ;
- historique ;
- niveau de confiance ;
- préférences de la personne.

### Portée de localisation

Local (quartier, commune, ville) · régional (département, région) · national (pays) · flexible (au choix de l'auteur).

## Réponses

Les personnes peuvent montrer leur intérêt, répondre, se proposer ou demander des précisions. Les réponses sont encadrées par les règles Vitala.

## Limites par niveau de confiance

| Niveau | Diffusion |
| --- | --- |
| Consultant | Très limitée |
| Membre | Limitée |
| Identifié | Normale |
| Confirmé | Étendue |
| Pro | Avancée |

## Expérience

- Publier en quelques secondes ; parler naturellement ; réduire les formulaires ; privilégier l'intention ; diffuser de manière pertinente ; favoriser les résultats réels.
- **Effet Flash** à la publication : animation dédiée (⚡ analyse → compréhension → classification → vérification → diffusion), courte, spectaculaire, compréhensible et utile. Personnalité du moteur : rapide, énergique, immédiat (voir [Experience System](../../01-product/experience-system.md)).

## Place dans le cycle des moteurs

```text
FLASH  → diffuser
SCAN   → trouver maintenant
RADAR  → surveiller jusqu'à trouver
VEILLE → rester informé
```

Flash constitue l'entrée principale de l'information dans l'écosystème.

## Critère de réussite

```text
Intention → compréhension Vita → structuration automatique → validation
→ diffusion ciblée → réponses pertinentes → action réelle
```

avec un minimum d'effort pour la personne.

## Implémentation actuelle

- Contrats : `packages/core-contracts/src/flash.ts`
- Logique pure : `packages/core-logic/src/flash.ts`
- Schéma local : `packages/core-db` (table Flash, offline-first)
- Écran : `src/routes/flash.tsx` et domaine `src/domains/flash/`
- Tests : `src/tests/flash/`

Toute évolution du moteur doit rester conforme à cette référence et mettre à jour ce document dans la même contribution.
