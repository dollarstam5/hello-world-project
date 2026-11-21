# Moteur Scan

**Cible produit :** Scan est un scanner intelligent de besoins humains et d'environnement. Il comprend la demande, tient compte de la position ou zone de l'utilisateur lorsque pertinent et autorisé, puis présente en priorité les résultats selon les critères reçus. Propositions, suggestions et similaires restent complémentaires et distincts ; une diversité intelligente n'intervient qu'entre options de pertinence comparable. Ce périmètre produit n'est pas limité aux restaurants, commerces ou lieux.


**Runtime actuellement observé :** le parcours raccordé décrit ci-dessous découvre les Flash actifs dans un rayon borné. Les coordonnées précises des Flash sont stockées côté serveur et ne sont accessibles que selon les règles de sécurité prévues ; la position du scanner est transmise temporairement au RPC et n'est pas persistée par ce contrat.

Le résultat expose une distance et un libellé de zone, jamais la latitude ou la longitude précises. Le serveur limite actuellement la réponse à 50 résultats ; l'écran examiné présente au maximum 20 résultats. Les recherches sont exclues du cache PWA. Le hook utilise un abonnement Supabase nettoyé au démontage, conserve la dernière requête dans une référence stable et bloque les exécutions concurrentes afin qu'un événement Realtime ne crée ni abonnement en boucle ni rafale de scans. Dans l'écran examiné lors de l'audit, le refus GPS affiche une erreur ; aucun parcours de sélection manuelle de lieu ou de zone de repli n'a été vérifié. La sélection manuelle d'un lieu public fait partie de la cible produit, mais ne doit pas être considérée comme déjà raccordée.

## Limites actuellement vérifiées

- Le validateur serveur `scanQuerySchema` accepte un `radiusKm` compris entre **1 et 50 km**.
- Le RPC `scan_public_flashes` calcule la distance et applique le filtre `distance_km <= p_radius_km` lorsqu'un rayon est fourni.
- Le plafond technique actuellement vérifié est donc de **50 km**, et non 25 km.
- Ces limites techniques ne définissent pas les choix qui doivent être proposés dans l'interface : les valeurs de rayon V1 restent une décision produit ouverte.
- Le plafond serveur de 50 résultats est appliqué par le validateur et par le RPC ; l'interface examinée limite l'affichage à 20 résultats.

Le flux public utilise `list_public_flashes`, une projection SQL bornée accessible aux visiteurs. Cette projection ne retourne ni corps détaillé, ni auteur, ni coordonnées. En cas de perte réseau, l'interface peut revenir aux Flash actifs déjà présents dans IndexedDB et retenter le flux public lorsque la connexion revient.

## Cible produit V1 validée — 2026-11-18
Les règles de Scan V1 sont consolidées dans [SCAN_PRODUCT_DECISIONS_V1.md](./SCAN_PRODUCT_DECISIONS_V1.md), sections 31 et 32. Paramètres clés : rayon maximum produit 2 km (runtime actuellement observé différent et à réconcilier) ; rayon initial adaptatif ; choix manuel d'un lieu public si GPS refusé ; historique membre 3 jours ; cache local 24 h / 5 Mo ; sélection par catégories adaptative et chargement progressif ; besoin humain, critères prioritaires et diversité intelligente à pertinence comparable. Ces paramètres sont des décisions produit, **pas des fonctionnalités runtime confirmées**. Les tests doivent prouver les limites server-side, la purge, les quotas, les permissions et le parcours mobile avant toute déclaration de conformité.

## Avancement du Lot 1 — audit et corrections P0 (2026-11-19)

- **Correction P0 en cours : champ de besoin libre.** L'écran Scan collecte désormais le texte du besoin (160 caractères maximum), le transmet à la requête, bloque le lancement si le texte est vide et désactive la saisie pendant l'exécution ou la localisation.
- **Interprétation : non encore raccordée visuellement.** Le parseur déterministe existe dans `packages/core-logic/src/scan-interpreter.ts`, mais l'utilisateur ne voit pas encore de résumé explicite de l'intention/critères interprétés dans l'écran.
- **Qualification des résultats : non fiable en production à ce stade.** Les classifications exact/proche/alternative/non vérifié existent dans la logique, mais le flux Scan fabrique une evidence à partir de Flash sans preuve sémantique de la source ; une qualification positive ne doit donc pas être présentée comme une confirmation métier.
- **Tests :** le commit initial du champ a déclenché Quality en échec à cause d'un formatage Prettier dans le catalogue i18n (pas d'échec fonctionnel Scan démontré dans ce log). Le formatage a été corrigé séparément ; les contrôles du commit correctif sont actuellement en cours.
- **Architecture :** conserver ScanPanel sous la limite de 300 lignes. Si le résumé d'interprétation ou les sections de qualification alourdissent l'écran, extraire des composants UI dédiés et garder les règles dans core-logic, sans déplacer les responsabilités.

### Mise à jour après raccordement du parseur UI

- Un composant séparé `ScanNeedInterpretation` affiche un aperçu local de l'intention déterministe détectée (libellés traduits FR/EN) lorsque la saisie n'est pas vide. Il n'affiche pas les extraits normalisés non accentués pour éviter une présentation brute peu naturelle.
- `ScanPanel` reste sous le seuil architectural de 300 lignes (à confirmer par contrôle CI/mesure locale ; aucune mesure locale disponible dans cette session).
- Les classifications exact/proche/alternative/non vérifié ne sont pas encore exposées dans les cartes : la source publique actuelle ne possède pas de preuve sémantique fiable pour l'intention principale. Ne pas les afficher comme confirmées avant d'avoir un contrat d'évidence source fiable.
- Le contrôle Scan Validation sur run #65 est passé (lint Scan et tests ciblés). Quality du run #2143 a été annulé lors de la progression des commits, donc le résultat global du formatage/build sur le dernier état reste à confirmer par un run complet.

## Qualification des résultats — évolution du Lot 1 (2026-11-19)

- Les cartes de résultat sont désormais rendues par `ScanResults`, séparées de `ScanPanel` (le panneau est resté sous 300 lignes dans la dernière version observée, 220 lignes avant l'extraction).
- Le hook `useScan` expose les assessments issus de la sélection pure. Il calcule les qualifications une seule fois par exécution et conserve la liste des candidats pour l'affichage.
- La présentation sépare les quatre niveaux : `exact`, `close`, `alternative`, `unverified`. Les résultats `unverified` indiquent explicitement que la publication ne confirme pas le besoin.
- **Limite de preuve toujours présente :** la projection Flash publique ne fournit pas le contenu sémantique nécessaire. L'évidence construite pour cette source garde `needMatch: unknown`; une correspondance exacte ne peut donc pas être affichée par ce flux sans evidence source valide.
- **Validation après commits de qualification :** en attente des workflows GitHub sur les derniers commits ; aucun succès global ne doit être revendiqué avant lecture des jobs.

### Résultats qualifiés et limites de la projection (complément)

- `ScanResults` présente les quatre niveaux séparément et n'inclut aucun résultat dans un groupe vide. Le niveau `unverified` affiche un avertissement explicite.
- La projection Flash publique contient titre, catégorie, type, créneau, zone et distance, mais pas assez de détails sémantiques pour confirmer le besoin. Les candidats provenant de cette projection sont donc `unverified`, même si leur titre paraît correspondre.
- Le groupe `exact` n'est pas alimenté par le flux actuel sans preuves source sémantiques valides. Le groupe `alternative` non plus ne peut être produit de façon fiable tant que le source ne permet pas d'établir `no_match`. Les intitulés existent, mais ne signifient pas que les groupes sont actuellement alimentés.
- Un test de régression est ajouté pour empêcher une correspondance exacte fondée uniquement sur un titre suggestif.
- Le dernier commit de test est `d315cf6`. Les workflows pour ce SHA n'étaient pas encore visibles au moment du relevé ; validation CI à confirmer.
