# Réconciliation de l’expérience Vision — novembre 2026

**Branche auditée :** `chore/architecture-folder-cleanup-2026-11`  
**Comparaison :** `main` → branche PR #90  
**Périmètre :** page Vision, carte d’accès, illustrations, route, traductions FR/EN et cohérence avec les capacités runtime Flash/Radar.

## 1. Résultat de la comparaison

| Élément | Sur `main` | Sur la branche | Conclusion |
|---|---|---|---|
| Page Vision | `src/components/experience/VitalisVisionPage.tsx` | `src/composition/experiences/vision/VitalisVisionPage.tsx` | Contenu et comportement conservés ; import local de l’illustration |
| Illustrations | `src/components/experience/VisionEngineArtwork.tsx` | `src/composition/experiences/vision/VisionEngineArtwork.tsx` | Fichier identique |
| Carte Vision | `src/components/experience/VitalisVisionCard.tsx` | `src/composition/experiences/vision/VitalisVisionCard.tsx` | Fichier identique avant normalisation de l’import i18n |
| Route | `src/routes/vision.lazy.tsx` | même chemin | Même route et même chargement différé ; chemin de composant déplacé |
| Traductions Vision | façades sous `src/lib/i18n/` | sources canoniques sous `src/platform/internationalization/` | Traductions dédiées chargées avec la route Vision différée |
| Compatibilité | composants à l’ancien emplacement | façades de réexport | Les anciens chemins directs restent utilisables |

La page conserve ses quatre entrées Flash, Scan, En direct et Radar, ses liens vers les routes et ses sections explicatives. Aucun changement de navigation ou de composition visuelle n’a été nécessaire.

## 2. Écarts de discours détectés

La structure de la page était cohérente, mais certaines traductions décrivaient des fonctions futures comme si elles étaient déjà disponibles.

### Flash

Le code du parcours actuellement audité permet de préparer et d’enregistrer un brouillon local ; il n’active pas la publication. Plusieurs textes Vision parlaient pourtant de confirmer ou de publier un Flash.

**Correction :** les textes FR/EN décrivent maintenant la préparation et l’enregistrement du brouillon sur l’appareil, et précisent que la publication n’est pas encore active dans le parcours actuel. La distinction entre brouillon et publication visible est explicitée.

### Radar

Le code actuellement audité enregistre des brouillons privés de recherche. Le suivi automatique, les correspondances et les alertes ne sont pas actifs. Les textes Vision employaient encore les formulations « suivre une recherche », « veille » et « arrêter le suivi ».

**Correction :** les textes FR/EN décrivent désormais un brouillon privé, modifiable ou annulable. Ils disent explicitement que le suivi automatique, les correspondances et les alertes restent à développer. Le libellé visuel « Recherche suivie » devient « Brouillon de recherche » / « Saved search draft ».

### Scan et En direct

Aucune correction fonctionnelle n’a été appliquée à leur description pendant ce lot. Leur description reste cohérente avec le périmètre audité : recherche ponctuelle à partir des sources disponibles pour Scan ; découverte de personnes proches et présence volontaire distincte pour En direct.

## 3. Normalisation des dépendances

Les deux composants de composition Vision utilisaient encore les chemins de compatibilité `@/lib/i18n/*`. Ils importent maintenant directement depuis `@/platform/internationalization/*`, qui est l’emplacement canonique de la plateforme.

Les façades historiques restent en place :
- `src/components/experience/VitalisVisionPage.tsx`
- `src/components/experience/VitalisVisionCard.tsx`
- `src/components/experience/VisionEngineArtwork.tsx`
- `src/lib/i18n/useVisionI18n.ts`
- `src/lib/i18n/vision-messages.ts`

La route `/vision` importe directement la page depuis `src/composition/experiences/vision`.

## 4. Tests ajoutés

`tests/vision-capability-copy.test.ts` vérifie :
- que les textes Flash FR/EN parlent d’un brouillon local et ne promettent pas une publication active ;
- que les textes Radar FR/EN ne présentent pas les brouillons comme un suivi actif ;
- que les clés de traduction FR et EN restent alignées ;
- que les composants Vision utilisent les entrées i18n canoniques ;
- que la route utilise la composition cible et que la façade historique est conservée.

**Limite de validation :** les tests n’ont pas été exécutés dans cet environnement. Aucun lint, typecheck, build ou contrôle visuel n’a été exécuté pour ce lot. L’ajout de tests constitue un contrat source, pas une preuve de réussite d’exécution.

## 5. Commits de ce lot

- `35fd7d2f44b75ad9a1c17bdac2bdb58c29e8dad0` — alignement des descriptions Vision Flash/Radar sur les capacités actuelles.
- `9a77495e2c06ec0a644937f2dc600bc045b9df56` — ajout initial du test de contrat Vision.
- `4390a1971f9cb088d9804d6b53f2b09c2b6c344f` — correction des assertions localisées.
- `f9523b0b97ebd01f3cc417977b57252aefb40d92` — import i18n canonique de la carte Vision.
- `2b1b5f03cc19e74664e41c12b8f1c342beee87c5` — import i18n canonique de la page Vision.
- `4ab18835667ce575a1d15c9e88dd20f0927ae6cb` — couverture des frontières de composition et i18n.\n- `4efcbb8c32cb630425444dee8f1155f90618c6bd` — nettoyage d’une assertion redondante dans le test.

## 6. Conclusion

**Vision est validée sur le plan structurel pour ce lot**, sous réserve des contrôles automatisés et visuels encore à exécuter. Les corrections apportées sont limitées à la vérité produit des textes et à l’usage des entrées canoniques ; elles ne modifient pas les parcours runtime.

La PR #90 reste ouverte et non fusionnée. Ce rapport ne vaut pas autorisation de fusion.
