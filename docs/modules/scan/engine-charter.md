# Scan — fiche de cadrage du moteur

## Statut
Fiche de cadrage complémentaire à la [référence produit, UX et technique Scan V1](./SCAN_ENGINE_REFERENCE_V1.md), qui consolide la vision et les décisions produit. Les [décisions produit V1](./SCAN_PRODUCT_DECISIONS_V1.md) priment sur les sujets encore ouverts de cette fiche. Aucun document ne certifie à lui seul l'état d'implémentation du runtime.

**Ordre de lecture recommandé :** décisions produit validées → référence Scan V1 → présente fiche → état technique du module → vision historique. La vision historique est conservée comme source d'intention, pas comme preuve de fonctionnalité livrée.

## Rôle du moteur
Scan est le **scanner intelligent d'environnement** de Vitalis. Il explore ponctuellement les lieux, activités, services, ressources et informations utiles dans un périmètre limité. L'utilisateur formule librement sa demande ; Scan sélectionne les découvertes pertinentes, les organise par priorité et par catégorie, puis permet d'approfondir sans submerger l'écran.

Scan n'est ni un flux de publication, ni une présence en temps réel, ni une mission de recherche continue.

## Application du principe Vitalis aux demandes Scan partielles

Référence obligatoire : [principe fondamental de traitement des demandes partielles](../../00-foundation/vitalis-core-principles.md).

- Une demande en langage naturel suffisamment exploitable déclenche une recherche avec les critères compris, même si des préférences ou des détails restent inconnus.
- Une demande large ou ambiguë reçoit une première exploration utile lorsque celle-ci reste honnête ; Scan explique les limites et propose une clarification courte sans imposer un long questionnaire.
- Une exigence stricte inconnue ne doit jamais être présentée comme confirmée. Les résultats sont qualifiés selon les preuves disponibles ; les informations manquantes restent « inconnues ».
- Si le point de référence ou une autorisation est indispensable à la recherche de proximité, demander uniquement ce minimum ou proposer un lieu choisi manuellement lorsque cette option est réellement disponible.
- Les critères facultatifs peuvent améliorer le classement, mais ne doivent pas devenir des conditions bloquantes artificielles.

## Repères d'interface déjà établis
- En-tête propre à Scan : icône et nom du moteur à gauche, commandes propres à Scan à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage du scanner.
- Les informations et résultats propres à Scan apparaissent sous l'en-tête.

## Recherche et exploration

- La recherche libre en langage naturel est disponible sans choix préalable de catégorie ou de filtre.
- Scan met en avant les catégories pertinentes selon l'environnement et la demande, tout en laissant accessibles toutes les catégories réellement disponibles.
- Les résultats sont présentés sous forme mixte : découvertes prioritaires, sections par catégorie, puis accès progressif aux autres résultats.
- Chaque catégorie propose une première sélection, des filtres généraux et des filtres spécifiques à la catégorie, puis un chargement progressif.
- Une demande ambiguë reçoit quelques interprétations possibles et peut aussi déclencher une exploration générale ; une demande trop large reçoit d'abord une sélection pertinente et des propositions de précision.
- Plusieurs zones peuvent être explorées dans une même session, mais leurs résultats, critères, rayons et points de référence restent séparés. La V1 ne prévoit pas de comparaison dédiée entre zones.
- Chaque exploration utilise un point de référence explicitement choisi : GPS actuel autorisé, zone approximative réellement prise en charge ou lieu public sélectionné manuellement. Le mode et la précision doivent être indiqués.

## Configuration avant un Scan
Avant chaque lancement, l'utilisateur définit ou confirme les paramètres qui déterminent ce que le moteur explore :
- **Rayon de scan** : distance maximale autour du point de référence autorisé pour ce scan.
- **Types de résultats recherchés** : possibilités ou catégories que l'utilisateur souhaite détecter.
- **Mode de sélection** : filtre strict (exclure les catégories non sélectionnées) ou priorité/classement (mettre certains résultats en avant sans masquer les autres résultats pertinents).
- **Point de référence** : position GPS actuelle autorisée, zone approximative si elle est réellement prise en charge, ou lieu public sélectionné manuellement. Le mode et le niveau de précision sont indiqués.

Distinguer :
1. les préférences par défaut enregistrées dans les paramètres de Scan ;
2. les paramètres du lancement en cours, que l'utilisateur peut ajuster avant de démarrer.

Les réglages par défaut ne doivent jamais empêcher l'utilisateur de voir les paramètres réellement appliqués au scan en cours. Le rayon, les catégories, le mode de sélection et le point de référence choisis doivent être transmis au moteur et appliqués par les sources de données. L'interface ne doit jamais afficher un paramètre comme appliqué si le service de recherche ne le respecte pas.

Le rayon par défaut, les options et le plafond V1 restent à fixer. La classification est évolutive ; les catégories prioritaires sont sélectionnées selon l'environnement, et toutes les catégories réellement disponibles restent accessibles. Ne pas reprendre automatiquement les rayons d'En direct ou de Radar : ces paramètres répondent à des usages différents.

## État technique du rayon — vérification du dépôt

À la date de cette révision, le validateur serveur de `src/domains/scan/api/scan.functions.ts` accepte les rayons de **1 à 50 km**. Le RPC `scan_public_flashes` applique effectivement le filtre de distance demandé. L'ancien plafond de 25 km mentionné dans la fiche technique était donc obsolète.

Cette plage décrit la capacité technique actuelle, pas les options d'interface validées. Les valeurs de rayon proposées à l'utilisateur restent à décider ; ne pas exposer automatiquement toutes les valeurs 1–50 km dans l'interface sans validation produit.

## Sources et limites de recherche
- La documentation technique historique de Radar identifie les Flash actifs comme une source de recherche de Scan. Cette source constitue le premier périmètre documentaire connu ; sa disponibilité effective dans le runtime doit être vérifiée.
- D'autres sources (par exemple des disponibilités ou des opportunités issues d'autres domaines) ne peuvent être ajoutées qu'après définition de leur contrat, de leur fraîcheur, de leurs règles d'accès et de leur coût.
- Scan ne doit pas présenter une source non raccordée comme consultée.
- Un résultat doit permettre d'identifier sa source, sa date ou fraîcheur connue, et les critères qui ont conduit à sa présentation.
- La recherche est ponctuelle : l'exploration s'achève avec ses résultats et ne suit jamais la position en continu. Après le Scan, l'utilisateur peut toutefois autoriser séparément un signalement temporaire de nouvelles informations correspondant à la dernière recherche et à son périmètre ; cette autorisation expire automatiquement, est révocable et n'actualise pas la position. Elle est distincte d'une mission Radar. Le suivi durable d'une zone choisie relève de Radar ou d'une veille explicitement créée.

## Frontière avec les autres moteurs
- **En direct** montre les présences proches maintenant ; Scan ne recherche pas les personnes simplement parce qu'elles sont présentes.
- **Flash** publie des informations courtes ; Scan peut découvrir les Flash actifs autorisés dans son périmètre, sans modifier leur contenu ni les autorisations de leur auteur.
- **Radar** suit une intention dans le temps ; Scan ne crée pas automatiquement une mission Radar et ne continue pas à chercher après la fin du scan.
- **Veille** peut présenter des tendances agrégées ; Scan n'accède pas aux données personnelles ou aux missions privées utilisées pour ces analyses.

## Utilisation du profil et confidentialité
Scan définit sa propre projection du profil selon les informations strictement nécessaires à ses résultats et interactions. Il ne doit pas hériter automatiquement du profil complet ni des réglages de visibilité d'En direct ou de Flash.

Les champs visibles, l'éventuel accès au profil complet et les règles membre/invité restent à définir dans le contrat propre à Scan. En attendant cette décision, ne pas supposer qu'un résultat de scan autorise l'affichage de l'identité complète d'une personne.

Les paramètres de recherche (rayon, catégories, priorité et point de référence) ne constituent pas des autorisations de profil et ne doivent pas élargir la visibilité des personnes ou publications. Toute donnée non autorisée est exclue de la réponse côté service/API.

## Sections à compléter pendant la conception
- Valeurs du rayon par défaut, options et plafond strict V1.
- Taxonomie détaillée, correspondance catégories/sources et filtres par sous-catégorie.
- Seuils mesurables de pertinence, confiance et fraîcheur.
- Durées et quotas du signalement temporaire après Scan.
- Durées et quotas de l'historique, du cache et des contributions.
- Contrats de sources, couverture, permissions, sécurité, coûts et critères de test.

## Garde-fous
- Le scanner ne doit pas prétendre détecter une possibilité si aucune source réelle n'est raccordée.
- Les permissions sont demandées au moment où elles deviennent utiles.
- V1 privilégie des critères simples, explicables et peu coûteux.
- Les choix de visibilité du profil restent propres à Scan.
- Le rayon et les critères affichés correspondent aux paramètres réellement appliqués côté service.
- Un scan ponctuel ne doit pas être présenté comme une surveillance continue.
