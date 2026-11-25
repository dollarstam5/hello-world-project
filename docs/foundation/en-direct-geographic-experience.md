# Expérience géographique — En direct

**Statut : proposition de cadrage produit à valider.**  
**Périmètre : expérience cible d'En direct, informations géographiques, découverte et interactions.**  
**Priorité d'expérience : téléphones Android et iOS (P0), tablette (P1), desktop (P2).**  
**Règle de vérité : ce document distingue l'existant audité de l'expérience souhaitée. Il ne décrit aucune intégration de lieux, d'activités ou de services comme déjà opérationnelle.**

## 1. Intention produit

En direct doit aider une personne à découvrir et explorer son environnement, où qu'elle se trouve. Le moteur ne doit pas être limité à un quartier prédéfini ni à une ville particulière.

La personne doit pouvoir expliquer naturellement ce qu'elle cherche, ce qu'elle souhaite faire ou ce qu'elle aimerait découvrir autour d'elle. Vitalis utilise le contexte géographique autorisé pour chercher des informations pertinentes et présenter les possibilités réelles dans la zone.

En direct couvre trois domaines distincts :

1. **Les personnes** — les personnes qui ont choisi de partager leur présence dans En direct.
2. **Les lieux** — les lieux et points d'intérêt situés dans l'environnement : espaces publics, commerces, établissements, équipements et autres lieux pertinents, selon les sources disponibles.
3. **Les activités et services** — les activités annoncées et les services proposés ou accessibles dans la zone, lorsque des informations fiables existent.

Ces trois domaines ne doivent pas être confondus. Ils peuvent provenir de sources différentes, avoir des niveaux de fraîcheur différents et autoriser des interactions différentes.

## 2. Audit de l'existant

### 2.1 Géolocalisation d'En direct

Fichiers inspectés sur la branche :
- `src/modules/reel/api/reel-location.client.ts`
- `src/modules/reel/api/reel-zone.functions.ts`
- `src/modules/reel/api/reel-zone.server.ts`
- `src/modules/reel/model/useReelProximityController.ts`

Constats vérifiés :
- La position est demandée à la suite d'une action explicite dans En direct.
- Le navigateur utilise `getCurrentPosition` : il s'agit d'une position ponctuelle, pas d'un suivi GPS continu ou en arrière-plan.
- La demande utilise une précision non élevée, une durée maximale de 12 secondes et n'accepte pas de position mise en cache.
- Si la position n'est pas disponible, le code affiche une explication et permet de continuer en mode calme.
- Pour la découverte membre, le serveur crée une donnée géographique temporaire liée à la découverte ; le code serveur indique une expiration de 15 minutes.
- Pour la publication de présence, le code utilise une zone approximative et un droit temporaire distinct ; la durée d'expiration de la résolution de zone est de 5 minutes.
- Le code de résolution de présence réduit la précision en cellules d'environ 200 mètres avant de produire un identifiant de zone.
- La découverte actuelle récupère des présences de membres et d'invités. Elle ne recherche pas des lieux, activités ou services.
- Le cache de présences affichées est local au runtime et sa durée de fraîcheur est de 45 secondes.

### 2.2 Géocodage existant hors En direct

Fichiers inspectés :
- `src/modules/flash/api/flash-geocoding.functions.ts`
- `src/modules/flash/api/flash-geocoding.server.ts`
- `src/config/env.server.ts`

Constats vérifiés :
- Flash possède une fonction de géocodage inversé qui utilise Geoapify lorsqu'une clé serveur facultative est configurée.
- Elle transforme une position ponctuelle consentie en libellé de zone (localité, ville, région, pays).
- Le service ne retourne pas une liste de lieux ou d'établissements à découvrir.
- La clé Geoapify absente désactive ce géocodage inversé.
- Cette fonction est liée au parcours Flash ; elle ne constitue pas un moteur de découverte géographique pour En direct.

### 2.3 Conclusion de l'audit

L'existant fournit des briques de géolocalisation ponctuelle, de résolution de zone approximative et de découverte de présences partagées. Il ne démontre pas de catalogue de lieux, de recherche de points d'intérêt, de source d'activités locales ou de répertoire de services branché à En direct.

Aucun fournisseur de cartographie ou de recherche de lieux ne doit être considéré comme choisi sur la seule base de cet audit.

## 3. Parcours cible — parler de son environnement avec ses propres mots

### 3.1 Point de départ

L'entrée principale doit être une invitation simple, pas une grille de catégories ni un formulaire.

**Titre proposé**  
Qu'aimeriez-vous trouver autour de vous ?

**Texte proposé**  
Dites-moi ce que vous cherchez ou ce que vous aimeriez faire dans les environs. Je regarderai ce que je peux trouver autour de vous.

**Exemples de formulations**
- « Où puis-je trouver un endroit calme pour m'asseoir un moment ? »
- « Je cherche un marché ou un petit commerce ouvert dans les environs. »
- « Y a-t-il un espace où les enfants peuvent jouer près d'ici ? »
- « J'aimerais découvrir une activité intéressante aujourd'hui. »
- « Je cherche un atelier qui peut réparer un appareil. »
- « Quelles personnes ont choisi de partager leur présence dans les environs ? »
- « Je voudrais trouver un endroit accessible sans devoir beaucoup marcher. »

Ces exemples montrent la liberté d'expression attendue. Ils ne garantissent pas que les données correspondantes seront disponibles dans chaque zone.

### 3.2 Contexte géographique

Quand la demande nécessite une recherche locale, Vitalis explique pourquoi la position peut aider et demande l'autorisation au moment utile.

Le contexte géographique peut provenir :
- de la position ponctuelle de l'appareil, si la personne l'autorise ;
- d'une zone ou d'un lieu indiqué directement par la personne, si cette alternative est disponible ;
- d'une zone déjà explicitement choisie dans le contexte courant, si elle reste valable et que son usage est clair.

Ne jamais supposer que la position actuelle est connue. Ne pas réutiliser silencieusement une ancienne position pour une nouvelle demande.

**En cas de refus ou d'indisponibilité GPS :**
- expliquer simplement que la position n'a pas été obtenue ;
- proposer de continuer sans recherche locale si cela a du sens ;
- prévoir, comme évolution à concevoir, une saisie libre de ville, quartier ou lieu de référence ;
- ne pas bloquer l'accès général à En direct ni publier la position de la personne.

### 3.3 Compréhension de la demande

Vitalis conserve la formulation originale. Il identifie le type de recherche seulement dans la mesure où il peut le faire avec fiabilité :
- présence de personnes ;
- lieu ou point d'intérêt ;
- activité ;
- service ;
- demande mixte ou encore ambiguë.

Si une clarification est nécessaire, Vitalis pose une seule question à la fois. Il ne demande pas à la personne de sélectionner une catégorie si le sens de sa demande est déjà suffisamment clair.

La personne peut corriger la compréhension sans devoir réécrire toute sa demande.

### 3.4 Présentation des résultats

Les résultats sont regroupés par nature, avec des intitulés explicites. Une recherche mixte peut afficher plusieurs groupes, mais ne doit pas mélanger une présence personnelle avec une fiche d'établissement.

Chaque résultat ne présente que les informations disponibles et pertinentes :
- nom ou intitulé ;
- nature du résultat (personne, lieu, activité ou service) ;
- description courte ;
- secteur ou distance approximative, si cette information est fiable et autorisée ;
- adresse ou repère, seulement si la source le fournit et si son affichage est approprié ;
- horaires, conditions ou disponibilité, uniquement si une source les fournit ;
- source et fraîcheur de l'information, lorsque disponibles ;
- action réellement prise en charge par Vitalis.

Ne pas afficher un champ vide sous forme de certitude. Ne pas calculer ou afficher une distance précise à partir d'une localisation approximative.

## 4. Niveaux de fiabilité des informations

Les résultats doivent distinguer les statuts suivants :

| Statut | Ce que Vitalis peut dire | Ce qu'il ne doit pas laisser entendre |
|---|---|---|
| Information répertoriée | « J'ai trouvé ce lieu dans une source. » | Que le lieu est ouvert ou disponible maintenant |
| Information déclarée | « Cette activité est annoncée pour… » | Que l'activité est toujours maintenue |
| Information récente | « La source indique une mise à jour récente. » | Que chaque détail a été vérifié par Vitalis |
| Disponibilité confirmée | « La disponibilité est confirmée par la source connectée. » | Une garantie au-delà de ce que confirme la source |
| Information inconnue | « Je n'ai pas cette information. » | Une supposition sur les horaires, prix, qualité ou disponibilité |
| Aucun résultat fiable | « Je n'ai pas trouvé d'information fiable dans cette zone. » | Que rien n'existe dans les environs |

Les résultats doivent pouvoir signaler une couverture limitée. « Aucun résultat trouvé » ne signifie pas « il n'existe rien ».

## 5. Interactions possibles — principes, pas promesses techniques

L'expérience doit permettre d'explorer les résultats sans présumer de l'existence d'une intégration externe.

### Interactions génériques à prévoir dans la conception
- ouvrir une fiche ou un aperçu ;
- comprendre pourquoi le résultat correspond à la demande ;
- affiner naturellement la demande ;
- élargir ou réduire la zone de recherche ;
- consulter la source et les informations disponibles ;
- revenir aux résultats précédents dans la session ;
- signaler une information manifestement incorrecte, si un mécanisme de signalement est défini.

### Interactions dépendantes des capacités futures
- obtenir un itinéraire ou ouvrir une application de navigation ;
- consulter des horaires actualisés ;
- vérifier une disponibilité ;
- contacter un établissement ou un organisateur ;
- participer ou s'inscrire à une activité ;
- réserver ou commander.

Ces actions ne doivent apparaître que si une source et une intégration réelles les prennent en charge. Une fiche trouvée ne signifie pas qu'une interaction est possible.

Pour les personnes, conserver les règles propres à En direct : seules les présences partagées apparaissent ; la découverte ne rend pas la personne visible ; le Bip reste soumis aux règles existantes. Ne pas transposer automatiquement les actions d'une fiche de lieu à un profil personnel.

## 6. Principes de recherche géographique

La conception technique devra répondre aux questions suivantes avant tout branchement fournisseur :

1. Quelles sources peuvent couvrir les pays et les zones dans lesquels Vitalis sera utilisé ?
2. Quels types de lieux, d'activités et de services chaque source décrit-elle réellement ?
3. Les données sont-elles ouvertes, sous licence, payantes ou soumises à des restrictions d'affichage et de cache ?
4. Quelle est la date de mise à jour et comment détecter les informations périmées ?
5. Les coordonnées précises doivent-elles rester côté serveur ?
6. Comment classer les résultats selon l'intention, la distance approximative, la pertinence et la fraîcheur sans inventer de score de confiance ?
7. Comment gérer les doublons, les lieux fermés, les établissements déplacés et les informations contradictoires ?
8. Quel comportement adopter quand une zone a peu ou pas de couverture ?

Le choix d'un fournisseur cartographique, d'un catalogue de lieux ou d'une source d'activités est une décision d'architecture et de produit distincte. Geoapify est présent dans le dépôt pour le géocodage inversé de Flash ; cela ne suffit pas à valider son adéquation à tous les besoins d'En direct.

## 7. Confidentialité, consentement et sécurité

- Demander la localisation uniquement lorsqu'elle apporte une valeur à la demande.
- Expliquer l'usage de la position avec des mots compréhensibles.
- Ne pas activer de suivi continu ou en arrière-plan par défaut.
- Ne pas rendre publique la position GPS précise d'une personne.
- Distinguer la position utilisée pour rechercher des informations de la présence volontairement publiée dans En direct.
- Ne pas conditionner la découverte des lieux à la publication de sa présence personnelle.
- Limiter la conservation et l'accès aux coordonnées selon une politique à définir et à vérifier.
- Éviter les résultats qui exposeraient une personne vulnérable ou la localisation d'un enfant.
- Pour les services sensibles (santé, hébergement, protection, aide sociale), présenter les sources avec prudence et ne pas suggérer une garantie de sécurité, de qualification ou de prise en charge.
- Respecter les conditions d'utilisation, les licences et les règles de confidentialité des sources externes.

## 8. États de l'expérience

L'interface devra prévoir au minimum les états suivants :

- **Avant localisation :** la personne peut exprimer sa demande ; Vitalis explique quand la position est utile.
- **Autorisation demandée :** raison de la demande et alternative compréhensible.
- **Localisation obtenue :** secteur approximatif utilisé pour la recherche, sans exposer les coordonnées brutes.
- **Localisation refusée ou indisponible :** message non culpabilisant et possibilité de poursuivre autrement lorsque c'est possible.
- **Recherche en cours :** progression perceptible, sans animation excessive.
- **Résultats disponibles :** groupes séparés et informations sourcées.
- **Résultats partiels :** préciser les catégories ou informations non couvertes.
- **Aucun résultat fiable :** le dire sans conclure que rien n'existe.
- **Erreur de source :** conserver la demande et permettre de réessayer.
- **Hors connexion :** expliquer ce qui ne peut pas être actualisé ; ne pas présenter des données anciennes comme actuelles.
- **Présences humaines indisponibles :** distinguer l'absence de présence partagée de l'absence de lieux ou services.

## 9. Proposition de progression produit

Cette progression est une proposition de séquencement, pas un engagement de livraison :

### Étape A — socle de découverte géographique
- définir les sources et la couverture géographique ;
- préciser le modèle de requête locale et la protection de la position ;
- permettre de découvrir les lieux avec leurs informations sourcées ;
- garder la découverte des présences comme domaine séparé.

### Étape B — activités et services
- ajouter les sources qui couvrent réellement les activités et services ;
- distinguer annonces, informations de catalogue et disponibilités confirmées ;
- définir les interactions prises en charge par chaque source.

### Étape C — compréhension plus riche
- améliorer la compréhension des demandes naturelles et mixtes ;
- permettre d'affiner la recherche par conversation ciblée ;
- personnaliser la pertinence selon le contexte explicitement donné, sans déduire des informations sensibles.

L'ordre définitif dépendra de la couverture des sources, des coûts, des licences, de la qualité des données et des décisions produit.

## 10. Décisions produit à valider

Les points suivants restent ouverts et ne sont pas supposés validés par la seule rédaction de ce document :

1. **Présentation initiale :** commencer par une zone de saisie libre unique, puis afficher des groupes de résultats selon la demande.
2. **Découverte sans GPS :** permettre à la personne de saisir librement une ville, un quartier ou un lieu de référence lorsque la localisation n'est pas autorisée ou disponible.
3. **Périmètre de résultats :** afficher personnes, lieux, activités et services dans une même expérience, mais dans des groupes visuellement distincts.
4. **Zone de recherche :** laisser Vitalis proposer une zone pertinente et permettre à la personne de l'élargir ou de la réduire, sans imposer un rayon avant l'expression.
5. **Interactions :** n'afficher que les actions réellement supportées par les données et intégrations disponibles.

## 11. Critères d'acceptation

- Une personne peut commencer par écrire une phrase naturelle, sans sélectionner une catégorie obligatoire.
- En direct peut être utilisé dans toute zone couverte par les sources retenues, et ne suppose pas un quartier fixe.
- La découverte des personnes reste distincte des lieux, activités et services.
- La position est demandée au moment utile et n'est pas publiée par défaut.
- Le refus du GPS ne bloque pas l'accès général à En direct.
- Une alternative par zone déclarée est proposée si elle est validée et implémentée.
- Chaque résultat distingue l'information connue, inconnue, déclarée et confirmée.
- Aucun horaire, tarif, disponibilité, lieu ou résultat n'est inventé.
- La source et la fraîcheur sont visibles lorsqu'elles sont disponibles.
- L'absence de résultat n'est pas présentée comme la preuve qu'il n'existe aucune possibilité.
- Les interactions indisponibles ne sont pas affichées comme des fonctions opérationnelles.
- La personne peut corriger ou préciser sa demande sans la recommencer.

## 12. Références et limites

- [Référentiel produit des moteurs conversationnels](./conversational-engines-product-reference.md)
- [Proposition éditoriale — première découverte et exemples](./first-opening-copy-and-examples.md)
- [Principes fondamentaux de Vitalis](./vitalis-core-principles.md)
- Code audité : `src/modules/reel/api/reel-location.client.ts`, `src/modules/reel/api/reel-zone.functions.ts`, `src/modules/reel/api/reel-zone.server.ts`, `src/modules/reel/model/useReelProximityController.ts`, `src/modules/flash/api/flash-geocoding.server.ts`.

Ce document formalise une cible produit à partir de l'audit statique. Il ne choisit pas de fournisseur, ne garantit pas la couverture des données et ne certifie pas la disponibilité réelle de lieux, activités ou services.

**Périmètre : documentation uniquement. Aucun code applicatif, fournisseur externe ou comportement runtime n'a été modifié.**
