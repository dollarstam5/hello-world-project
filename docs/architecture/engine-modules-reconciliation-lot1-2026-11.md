# Réconciliation des modules moteurs — lot 1

**Branche :** `chore/architecture-folder-cleanup-2026-11`  
**Périmètre :** Flash, Scan, Radar, entrées publiques des modules et composants transversaux utilisés par ces moteurs.  
**Référence normative :** [gouvernance architecturale](../../ARCHITECTURE.md), [référentiel des moteurs conversationnels](../foundation/conversational-engines-product-reference.md) et [principes fondamentaux Vitalis](../foundation/vitalis-core-principles.md).

## 1. Méthode

Chaque correction a été décidée après comparaison avec `main`, lecture du code de la branche, vérification des contrats et confrontation avec les documents produit. Les changements ne transforment pas les fonctions futures en capacités runtime.

## 2. Flash

### Constat

- Le parseur déterministe `parseFlashIntent` préremplit toujours un type, une catégorie et un créneau à partir de trois caractères.
- Les valeurs de repli (`offer`, `other`, `today`) n'étaient pas distinguées des éléments reconnus.
- L'écran de saisie pouvait présenter ces valeurs comme des suggestions sans préciser lesquelles provenaient réellement du texte.
- La saisie ne pouvait pas continuer avec un texte non vide de moins de trois caractères, alors que le hook et l'enregistrement de brouillon n'exigeaient qu'un texte non vide.

### Corrections

- `FlashIntent` expose maintenant `matched.kind`, `matched.category` et `matched.timeSlot`.
- Le parseur reconnaît explicitement les formulations d'offre pour distinguer un type réellement repéré du repli « offre ».
- La revue indique pour chaque champ s'il a été repéré dans le message ou proposé par défaut, en français et en anglais.
- Le bouton Continuer accepte tout texte non vide ; le parseur reste déterministe et aucune compréhension IA n'est ajoutée.
- La sauvegarde locale continue d'enregistrer un brouillon uniquement. La publication distante reste désactivée.
- Le guide Flash a été corrigé : portée et urgence sont facultatives pour un brouillon, conformément au code actuel.

## 3. Scan

### Constat

`ScanPanel` transmettait une mise à jour fonctionnelle de texte depuis la dictée vocale, alors que `useScanFlow` n'acceptait qu'une chaîne. Le contrat TypeScript du setter était donc incohérent avec son consommateur.

### Correction

- `updateNeedText` accepte désormais `SetStateAction<string>` et résout correctement les valeurs directes ou les fonctions de mise à jour.
- Les réinitialisations du parcours (retour à l'étape de saisie, retrait des résultats précédents) sont conservées.
- Un test de contrat vérifie cette compatibilité.

### Périmètre volontairement inchangé

Le parcours Scan conserve ses quatre étapes actuelles, son lancement explicite et sa demande de localisation au lancement. Le référentiel produit classe encore la simplification de ces étapes comme une évolution à clarifier ; cette tranche ne transforme pas cette cible en comportement livré. La source runtime vérifiée reste la découverte des Flash publics, pas l'ensemble des familles de lieux, activités et services visées à terme.

## 4. Radar

### Constat

Le code V1 crée, modifie et annule des brouillons d'intention de recherche. Il ne raccorde ni moteur de correspondances, ni traitement planifié, ni alertes. Pourtant, plusieurs messages annonçaient qu'une « veille » avait été enregistrée, ce qui pouvait laisser croire qu'une surveillance était active.

Le formulaire propose initialement 5 km et 7 jours. Le schéma exige un texte d'au moins trois caractères, un rayon, un début et une échéance ; le libellé de zone est nullable et n'est pas requis.

### Corrections

- Les libellés d'interface et les événements de communication parlent maintenant d'une intention ou d'un brouillon de recherche, jamais d'une veille active.
- La date affichée est présentée comme une échéance prévue.
- Une mention explicite précise que 5 km et 7 jours sont des propositions par défaut modifiables, pas des informations déduites du message.
- Les guides Radar ont été alignés sur le schéma et le formulaire réellement présents : la zone est facultative ; les valeurs initiales de rayon et de durée sont des paramètres proposés.
- Aucune activation automatique, recherche en arrière-plan ou notification n'a été ajoutée.

## 5. Frontières de modules et composants

- `FlashCard` et l'aperçu public du profil associé à un résultat Flash appartiennent maintenant à `src/modules/flash/`.
- `RadarCard`, composant générique de proximité sans règle métier Radar, appartient maintenant à `src/shared/components/`.
- Les anciens chemins `src/components/app/` restent des façades de compatibilité.
- Les routes Flash, Scan, Radar, Reel, Profil et Informations consomment les points d'entrée publics des modules.
- Scan consomme l'aperçu public Flash via le point d'entrée public du module Flash.
- Les imports de communication des modules Flash, Scan, Radar et Reel utilisent désormais `src/features/communication`, et non les anciennes façades `src/lib/communication`.
- Les écrans moteurs concernés utilisent les primitives `src/shared/ui` plutôt que les anciens chemins de compatibilité `src/components/ui`.

## 6. Tests et documentation ajoutés ou ajustés

- `src/tests/flash/flash-intent.test.ts` : vérification des champs reconnus et des valeurs de repli.
- `tests/scan/flash-scan-boundary.test.ts` : contrat de mise à jour fonctionnelle du texte Scan.
- `tests/cross-cutting-entrypoints.test.ts` : points d'entrée publics, ownership des composants et façades de compatibilité.
- Guides Flash et Radar et référentiel produit des moteurs mis à jour.
- `src/modules/README.md` précise que les routes et les autres modules consomment les points d'entrée publics.

Ces tests ont été modifiés ou ajoutés mais **n'ont pas été exécutés dans cet environnement**.

## 7. Contrôles restants et limites

- Aucun clone local disponible dans cette session ; typecheck, lint, tests Vitest, build et vérification visuelle mobile n'ont pas été exécutés.
- Sur le head contrôlé, GitHub ne rapporte aucun workflow, aucun check run et aucun commit status.
- Le budget de bundle précédemment signalé en dépassement (253,3 kB gzip pour 250 kB) n'est pas revalidé par cette tranche.
- Les parcours adaptatifs futurs de Flash, Scan et Radar restent distincts du runtime actuel.
- Les capacités En direct relatives aux lieux, activités et services ne sont pas modifiées par ce lot.

## 8. État de la PR

La PR #90 reste ouverte, en brouillon et non fusionnée. Aucune modification n'a été faite sur `main`. Le statut `mergeable: false` indique que la PR présente encore un problème de fusion à résoudre avant toute intégration ; ce lot ne tente pas de le contourner.

**Conclusion :** les incohérences identifiées dans cette tranche ont été corrigées sur la branche de travail. La cohérence du code et de la documentation a été revue statiquement ; la validation d'exécution reste à faire sur le commit exact.
