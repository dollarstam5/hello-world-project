# Scan — guide complet du moteur

**Objet :** exploration ponctuelle de l'environnement pour répondre à un besoin exprimé par l'utilisateur.  
**Action centrale :** lancer un Scan après avoir confirmé la demande et les paramètres effectifs.  
**Statut :** référence produit V1 et état runtime séparés.

## 1. Mission et périmètre

Scan comprend une demande en langage naturel, construit des critères de recherche, consulte les sources réellement disponibles et présente les résultats utiles avec leur provenance et leurs limites. Les cinq familles de découverte visées en V1 sont : services et aides ; opportunités et disponibilités ; produits et ressources ; événements et activités ; informations et besoins locaux. Une famille n'est présentée comme recherchée que si une source réelle, autorisée et testée est raccordée.

Scan est ponctuel : il n'est ni un flux de publication, ni une présence en temps réel, ni une surveillance durable. Une recherche persistante relève d'un autre contrat métier et doit être créée explicitement.

## 2. Parcours utilisateur complet

### 2.1 Formuler et interpréter
1. L'utilisateur décrit son besoin librement (texte ; dictée simple si le navigateur la prend en charge).
2. Le parseur extrait les éléments détectables : besoin, catégorie, lieu, période, contraintes et préférences.
3. Scan distingue exigences strictes, préférences facultatives et contexte.
4. Un aperçu compact permet de corriger l'interprétation.
5. Si une information indispensable est inconnue, Scan pose une clarification courte. Sinon, il conserve les inconnues et prépare une recherche utile.

La compréhension V1 repose sur un parseur déterministe et des règles explicites ; elle ne promet pas une reformulation générative ou un fournisseur LLM.

### 2.2 Configurer et lancer
Avant chaque lancement, l'utilisateur confirme :
- le point de référence : GPS autorisé, zone approximative réellement prise en charge ou lieu public choisi manuellement ;
- le rayon ;
- les familles/catégories recherchées ;
- le mode strict (exclure les catégories non sélectionnées) ou prioritaire (classer certaines catégories en premier).

Les préférences par défaut et les paramètres de la recherche en cours sont distincts. L'utilisateur voit les paramètres effectifs. La recherche ne démarre qu'après confirmation explicite. Si la localisation ou une autorisation indispensable manque, demander ce minimum ou proposer une option réellement disponible.

### 2.3 Résultats et qualification
Les résultats sont organisés en correspondances exactes, proches et alternatives. Chaque résultat explique brièvement pourquoi il apparaît, ce qui est confirmé, ce qui diffère, ce qui reste inconnu, la source et sa fraîcheur connue. Une information absente n'est jamais transformée en confirmation.

Si aucune correspondance exacte n'existe, les pistes proches et alternatives restent séparées. Scan ne modifie pas silencieusement les critères, le rayon, la période ou la catégorie. Toute nouvelle recherche assouplie demande l'accord de l'utilisateur.

### 2.4 États de recherche
- **Aucun résultat :** les sources prévues et disponibles ont répondu correctement, sans résultat conforme.
- **Recherche partielle :** certaines sources ont répondu, d'autres ont échoué ou n'ont pas pu être consultées ; le périmètre partiel est expliqué.
- **Recherche impossible :** aucune source exploitable n'a répondu ; la panne n'est pas présentée comme une absence de résultats.

L'historique, le cache et les préférences sont soumis à leurs durées et quotas V1 ; ils ne doivent pas stocker plus de données que nécessaire.

## 3. Sources, données et confidentialité

La première source documentée et raccordée est la projection publique de Flash actifs. Les cinq familles sont une cible produit, pas une preuve que cinq connecteurs existent. Pour chaque source, le contrat doit préciser propriétaire, champs exposés, fraîcheur, filtres, permissions/RLS, limites, coût et tests.

Le résultat public ne révèle pas les coordonnées précises ni des champs privés de l'auteur. Les critères de recherche et la localisation de l'utilisateur sont utilisés pour cette exécution selon les autorisations, sans être automatiquement transformés en suivi continu. Les projections de profil sont propres à Scan et ne sont pas héritées d'un autre moteur.

## 4. Paramètres et règles de recherche

Le rayon est appliqué côté service ; un filtre visible n'est valide que si la source le reçoit et le respecte. Le validateur serveur observé dans les documents techniques accepte 1 à 50 km, alors que la décision produit V1 fixe un maximum cible de 2 km et un rayon initial adaptatif. Ces valeurs sont divergentes : l'interface ne doit pas prétendre respecter la limite produit tant que contrat et runtime ne sont pas réconciliés.

Le serveur limite le nombre de résultats (50 dans l'état technique documenté) et l'écran examiné affiche jusqu'à 20 résultats. Ces plafonds sont des limites runtime décrites dans les audits, pas une promesse d'exhaustivité.

## 5. Architecture et responsabilités

Le domaine comprend `src/modules/scan/api/`, hooks `useScan*`, services d'historique et Realtime, composants `ScanPanel`, `ScanNeedInterpretation`, `ScanResults`, `ScanHistory` et la route `/scan`. Le parseur et les règles de sélection doivent rester déterministes et testables. L'UI collecte et présente ; les services appliquent les filtres et contrôles côté serveur.

## 6. État runtime connu et limites

Les documents de branche décrivent une recherche de Flash publics actifs dans un rayon borné, un aperçu d'interprétation local, un historique et une gestion des préférences. Les projections Flash disponibles ne contiennent pas nécessairement la preuve sémantique permettant de certifier qu'un Flash répond exactement au besoin ; dans ce cas, le résultat reste non vérifié. Le GPS refusé peut encore conduire à une erreur dans l'écran audité ; la sélection manuelle de lieu fait partie de la cible produit mais n'est pas considérée comme raccordée sans preuve actuelle.

## 7. Critères de validation

Tester la séparation exigences/préférences, les demandes partielles, la confirmation avant recherche, les rayons réels, le point de référence, la séparation des zones, les trois états de recherche, la qualification exacte/proche/alternative, les preuves et provenance, l'absence de coordonnées précises, l'historique/cache, la purge, les permissions et la stabilité Realtime.

## 8. Sources conservées

La charte, les décisions produit V1, la référence détaillée Scan, l'état technique et la vision UJ-09 restent disponibles pour les détails de conception et l'historique. Le présent guide contient le parcours complet et les invariants de Scan.