# Flash — Circuit des pièces jointes V1 (local-first)

**Branche :** `scan-phase-a-interpreter`  
**Date :** 2026-11-19  
**Statut :** Phase de construction locale — transfert cloud non validé

## But
Permettre à un membre de joindre des fichiers à son Flash, de les conserver réellement sur l'appareil et de les ouvrir depuis le composer et le dashboard. Ne pas afficher de fausse disponibilité réseau.

## Décisions et limites V1
- Les fichiers sélectionnés sont conservés dans IndexedDB dans une table dédiée aux blobs locaux, distincte de la table synchronisée des métadonnées.
- Les blobs ne passent jamais dans l'outbox de sync (pas de transfert binaire Sync actuel).
- Le circuit local doit fonctionner hors ligne, et expliciter que les pièces jointes restent sur cet appareil tant que le service cloud n'est pas implémenté.
- Le pipeline cloud (bucket, upload, politiques Storage, URL signées, téléchargement, reprises) est une phase distincte et bloquée jusqu'à son audit/validation.
- Aucun preview/open button ne doit être affiché si le Blob n'existe pas localement ou si le type n'est pas autorisé.

## Types et limites initiales à valider par les tests
- Types autorisés : image, vidéo, audio, document.
- Limites initiales : maximum 3 fichiers et 20 MiB au total par Flash; maximum 10 MiB par fichier.
- MIME est contrôlé côté client et revalidé côté ouverture; noms de fichiers neutralisés pour l'affichage.
- Pas de fichiers exécutables, HTML, SVG actif, archive ou format non identifié.
- Les images sont affichées dans un aperçu sécurisé; les vidéos/audio via contrôles natifs; les documents sont ouverts seulement dans les formats explicitement pris en charge. Éviter les URL persistantes et révoquer les object URLs.
- L'ajout, retrait et suppression du Flash doivent nettoyer les blobs orphelins lorsque la relation n'existe plus; cette opération doit être transactionnelle et testée.

## Étapes
1. Schema Dexie version suivante + table locale `mediaBlobs` (non synchronisée).
2. Service local de blobs : validation, stockage, récupération, suppression, nettoyage.
3. UI de sélection et affichage des pièces jointes dans le composer, avec limites et erreurs accessibles.
4. Persister les blobs lors de l'enregistrement d'un Flash et attacher les références `mediaIds`.
5. Dashboard : aperçus/open locaux et suppression; indiquer clairement « sur cet appareil ».
6. Tests migration DB, quota, types, limites, hors-ligne, attachement, ouverture, suppression, nettoyage et changements de compte.
7. Pipeline distant : stockage privé, RLS/permissions, signed URLs à courte durée, upload reprenable, validation serveur, suppression et tests.

## Critère de fin de phase locale
Les fichiers doivent être effectivement persistés et récupérés après rechargement; aucune preview ne doit dépendre de fichiers factices. La sync cloud ne sera pas déclarée faite.

## Implémentation — fondation en cours

- La table Dexie locale non synchronisée `mediaBlobs` est ajoutée (version DB 5) avec Blob, ownerId, flashId, nom, MIME, taille et date.
- Un service local expose validation MIME, limites par fichier, stockage/relecture, association au Flash, suppression et liste filtrée par propriétaire.
- Les limites actuelles du service : 3 fichiers, 10 MiB par fichier, 20 MiB par Flash; MIME autorisés explicitement, SVG/HTML/archive/octet-stream refusés.
- Les tests ciblés couvrent la validation MIME, fichiers vides, taille maximale et types non supportés.
- **À ce stade, la sélection dans le composer, l'association transactionnelle avec la création Flash, l'aperçu dans le dashboard et le nettoyage de blobs ne sont pas encore connectés.** Ce service seul ne constitue pas encore un circuit fonctionnel utilisateur.

## Avancement — circuit composer/dashboard connecté (validation en attente)

- La sélection des fichiers est intégrée à l'étape de revue du composer.
- Les fichiers sont contrôlés par MIME déclaré et taille (contrôle client, non substitut à une validation serveur), avec limite 3 fichiers, 10 MiB chacun, 20 MiB cumulés.
- Le composer persiste les blobs après création du brouillon, associe leurs IDs au Flash, et tente de supprimer le brouillon et ses blobs en cas d'échec de cette séquence.
- Le dashboard récupère les blobs locaux par Flash et affiche un aperçu image, contrôles vidéo/audio ou lien d'ouverture/téléchargement local. Les URLs d'objet sont révoquées au démontage/actualisation.
- La suppression d'un Flash tente de supprimer les blobs locaux associés; si le nettoyage échoue, la suppression du Flash reste réussie et les blobs orphelins nécessiteront un nettoyage ultérieur.
- Le message UI précise que les fichiers sont conservés sur l'appareil. Aucun transfert cloud n'est encore implémenté.
- Les tests CI doivent être observés avant de déclarer le lot stable. Les contrôles client MIME ne garantissent pas l'authenticité du contenu; le serveur devra revalider type réel et permissions avant upload.

## Validation du lot local

**Validation dédiée réussie sur le commit `a1db6dec9e1eaa32dcab3a0bc33d6f4b46e94da` (2026-11-19) :
- ESLint ciblé des fichiers Flash/media : réussi.
- Tests de validation MIME et limites : réussis.
- Build production : réussi.
- Scan Validation : réussi.
- Dependency Review : réussi.
- Quality global : échoue encore avant les tests globaux, à l'étape `Verify foundation and secrets`. Cela n'annule pas les résultats du workflow dédié, mais ne valide pas l'ensemble du dépôt.
