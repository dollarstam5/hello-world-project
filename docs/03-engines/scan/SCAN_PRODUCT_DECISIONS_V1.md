# Scan — décisions produit validées pour la V1

**Statut :** décisions validées par le propriétaire du produit pendant la consolidation documentaire.  
**Périmètre :** familles de découverte et méthode de compréhension des demandes.  
**Portée :** documentation uniquement ; aucune modification du runtime n'est autorisée par cette validation.

---

## 1. Familles de découverte retenues

Scan a vocation à découvrir cinq grandes familles de possibilités :

1. **Services et aides** — garde d'enfants, aide au déménagement, réparation, ménage, assistance et petits travaux.
2. **Opportunités et disponibilités** — personnes disponibles, missions ponctuelles, offres de travail et compétences recherchées.
3. **Produits et ressources** — objets, produits, équipements et ressources proposés ou recherchés.
4. **Événements et activités** — rencontres, événements et activités locales.
5. **Informations et besoins locaux** — alertes utiles, demandes publiées et informations pratiques.

Cette validation fixe le périmètre fonctionnel visé, pas la disponibilité technique immédiate de toutes les familles.

### Activation progressive et preuve des sources

- Une famille ne peut apparaître dans les résultats que si au moins une source réelle correspondante est raccordée et autorisée.
- Chaque source doit avoir un contrat documenté : propriétaire, données exposées, fraîcheur, zone, filtres, permissions/RLS, limites, coût et tests.
- Scan indique les sources effectivement consultées.
- Une source absente, en panne ou non consultée ne doit jamais être présentée comme explorée.
- Une recherche partielle doit être identifiée comme partielle ; elle ne doit pas être présentée comme exhaustive.
- Les familles sans source validée restent dans la vision produit, sans fausses données ni résultats simulés en production.

La première source identifiée dans l'état actuel du dépôt reste Flash. Les autres intégrations sont progressives et conditionnées par leurs contrats et leurs preuves.

## 2. Compréhension des demandes — règle V1 validée

Scan accepte une demande exprimée avec les mots naturels de l'utilisateur. Il ne doit pas imposer un long formulaire ni obliger l'utilisateur à connaître les catégories techniques.

Le parcours V1 est le suivant :

1. **Formuler** — saisir librement le besoin ou utiliser un raccourci/catégorie.
2. **Interpréter** — convertir les éléments compris en critères structurés.
3. **Distinguer** — séparer les exigences indispensables des préférences facultatives et du contexte.
4. **Clarifier sans bloquer** — lorsque plusieurs interprétations sont possibles, proposer quelques lectures simples et laisser l'utilisateur choisir ; une exploration générale peut commencer sans attendre si elle reste utile et honnête.
5. **Confirmer et rechercher** — présenter les critères compris de façon compacte. Une clarification courte reste utile lorsqu'une information indispensable conditionne réellement la recherche, mais elle ne doit pas devenir un questionnaire obligatoire.

Exemple : « Je cherche quelqu'un pour m'aider à déménager demain matin à Douala. »

Critères attendus lorsque ces éléments sont reconnus :
- besoin : aide au déménagement ;
- lieu : Douala ou zone de proximité choisie ;
- date : demain ;
- moment : matin ;
- priorité : disponibilité annoncée et compatible ;
- famille : service ou aide.

Un résultat qui ne respecte pas une exigence stricte (par exemple la date demandée) ne doit pas être présenté comme une correspondance exacte. Les préférences peuvent influencer le classement sans exclure automatiquement un résultat.

### Méthode technique V1

- Privilégier un parseur structuré, des règles explicites et un vocabulaire de synonymes contrôlé.
- Ne pas rendre le parcours central dépendant d'un fournisseur d'IA, d'un LLM ou d'un service payant.
- Une demande large ou imprécise ne bloque pas automatiquement l'exploration : Scan commence par une sélection pertinente, explique brièvement la limite et propose des moyens simples de préciser.
- Ne pas prétendre avoir compris avec certitude un critère ambigu : le faire confirmer ou poser une question.
- Conserver une possibilité de correction des critères avant lancement.
- Ne pas afficher de filtre comme appliqué si le service ne le reçoit pas ou ne le respecte pas.
- La recherche reste ponctuelle et déclenchée par l'utilisateur.

La compréhension conversationnelle plus riche, l'adaptation avancée, la dictée vocale intelligente et l'assistance de Vita sont des évolutions possibles en V2/V3, non des capacités promises en V1.

## 3. Conséquences sur la référence de conception

Les décisions ci-dessus remplacent, pour les deux sujets concernés, les mentions « à valider » de la référence détaillée `SCAN_ENGINE_REFERENCE_V1.md` :

- la liste des cinq familles est validée comme périmètre fonctionnel visé ;
- l'activation des sources est progressive et soumise à des preuves ;
- la compréhension naturelle avec extraction structurée et clarification courte est validée pour la V1 ;
- les autres décisions produit de la référence restent ouvertes tant qu'elles ne sont pas explicitement validées.

## 4. Limite de cette validation

Cette décision valide la conception produit et documentaire uniquement. Elle n'autorise pas de modification du code, de schéma, de migration, de configuration, de secret, de déploiement ou de fournisseur externe. Toute implémentation fera l'objet d'une étape et d'une autorisation distinctes.

## 5. Historique de validation

- Validation utilisateur : cinq familles de découverte avec activation progressive selon les sources réellement disponibles en V1.
- Validation utilisateur : demandes en langage naturel, interprétation structurée et économique en V1, avec une seule clarification courte si nécessaire ; compréhension conversationnelle avancée et voix réservées à une évolution ultérieure.


## 6. Qualification des résultats — règle V1 validée

Scan distingue trois niveaux de résultats :

1. **Correspondance exacte** — toutes les exigences strictes confirmées par les données de la source sont respectées.
2. **Correspondance proche** — le résultat répond au besoin principal, mais au moins une différence ou limite est présente et explicitement signalée.
3. **Alternative** — le résultat ne satisfait pas suffisamment la demande pour être considéré comme une correspondance, mais peut constituer une piste utile.

### Règles de classement et de présentation

- Ne jamais présenter une correspondance proche ou une alternative comme une correspondance exacte.
- Les filtres stricts restent éliminatoires pour le niveau « exact » ; ils ne sont pas ignorés pour améliorer artificiellement le classement.
- Une correspondance proche doit préciser la différence constatée (par exemple disponibilité non confirmée, période voisine ou caractéristique manquante).
- Une alternative doit être présentée séparément et expliquer en quoi elle pourrait être utile.
- Toute explication doit provenir de données effectivement retournées par la source. Un champ absent reste inconnu ; il ne devient pas une confirmation.
- La proximité, la fraîcheur, la disponibilité et les préférences peuvent contribuer au classement seulement si leurs valeurs sont disponibles, définies et effectivement appliquées.
- Les résultats sont triés de manière déterministe à l'intérieur de leur niveau, avec des règles explicables et testables.
- Si les données ne permettent pas de déterminer le niveau de correspondance, Scan doit afficher l'incertitude ou écarter le résultat plutôt que de fabriquer une certitude.
- Les alternatives ne doivent pas être mélangées aux correspondances exactes sans distinction visuelle et textuelle.

### Portée de cette décision

Cette règle fixe la qualification produit cible V1. Les seuils éventuels, les règles détaillées de passage d'un niveau à l'autre et les facteurs de départage doivent être spécifiés et testés avant implémentation. Aucun score numérique arbitraire ne doit être inventé.
## 7. Pistes lorsque aucun résultat exact n'est disponible — présentation hybride validée

Lorsque Scan ne trouve aucun résultat exact, il ne doit ni s'arrêter sur un écran vide ni présenter des pistes moins pertinentes comme si elles répondaient à la demande.

### Présentation hybride V1

- Afficher les correspondances exactes en premier, lorsqu'elles existent.
- Présenter les correspondances proches dans une section distincte, avec la différence constatée clairement expliquée.
- Garder les alternatives moins proches dans une section séparée, secondaire et consultable sans surcharger l'écran.
- Si aucun résultat exact n'existe, l'indiquer clairement et présenter les pistes pertinentes déjà obtenues, sans prétendre qu'elles satisfont la demande initiale.
- Scan ne modifie pas silencieusement les critères stricts, le rayon, la période, la catégorie ou les filtres.
- Toute nouvelle recherche avec des critères assouplis exige l'accord de l'utilisateur.
- Ne déclencher automatiquement ni une recherche élargie, ni une mission Radar, ni un suivi.

### Historique de validation

- La distinction exact/proche/alternative est validée.
- Validation utilisateur : présentation hybride (C) — correspondances proches directement visibles, alternatives moins proches séparées et secondaires, avec indication honnête lorsqu'aucune correspondance exacte n'a été trouvée. Aucun critère strict ou périmètre n'est assoupli sans confirmation.


## 8. États de disponibilité des sources — règle V1 validée

Scan doit distinguer explicitement trois situations de recherche. Le statut décrit ce qui s'est réellement passé pendant l'exécution ; il ne doit jamais être déduit de l'absence de résultats seule.

1. **Aucun résultat trouvé** — les sources prévues et disponibles pour cette recherche ont répondu correctement et ont été consultées, mais aucune ne retourne de résultat correspondant aux critères. Scan ne propose des pistes d'élargissement que selon le comportement qui sera confirmé à la section 7 ; aucune suggestion automatique n'est présumée.
2. **Recherche partielle** — au moins une source pertinente n'a pas pu être consultée, a échoué ou a retourné des données incomplètes, tandis qu'une ou plusieurs autres sources ont répondu. Scan présente les résultats disponibles comme partiels, identifie les sources effectivement consultées et signale les limites connues. Il ne prétend pas avoir tout vérifié.
3. **Recherche impossible** — aucune source exploitable n'a fourni de réponse utilisable pour cette recherche. Scan explique simplement que la recherche n'a pas pu être effectuée et, si possible, indique la cause connue ainsi qu'une action réaliste (réessayer, vérifier la connexion ou revenir plus tard). Il ne présente pas cette situation comme une absence de résultats.

### Règles transversales

- L'état est déterminé à partir des réponses réelles des sources, et non d'un résultat vide isolé.
- Scan distingue les sources attendues, les sources effectivement interrogées, celles qui ont répondu et celles qui ont échoué.
- Une source non raccordée ou non autorisée n'est pas comptée comme consultée ; le périmètre de recherche doit rester transparent.
- Une recherche partielle ne peut pas être décrite comme exhaustive.
- Une panne ou un délai d'attente ne doit jamais être transformé en « aucun résultat trouvé ».
- Si la cause exacte d'un échec est inconnue, Scan le dit sans inventer de diagnostic.
- Les messages destinés à l'utilisateur restent courts, chaleureux et compréhensibles, sans jargon technique inutile.

### Historique de validation

- Validation utilisateur : distinction V1 entre « aucun résultat trouvé » après consultation effective, « recherche partielle » lorsque certaines sources n'ont pas répondu et « recherche impossible » lorsqu'aucune source exploitable n'a répondu.


## 9. Explication et traçabilité des résultats — règle V1 validée

Chaque résultat présenté par Scan doit être accompagné d'une explication courte, compréhensible et fondée sur les données réellement retournées par sa source.

### Ce que l'explication doit rendre clair

- **Pourquoi le résultat apparaît** : quels éléments de la demande sont satisfaits et quelles données le confirment.
- **Ce qui diffère** : quel critère n'est pas respecté lorsqu'il s'agit d'une correspondance proche ou d'une alternative.
- **Ce qui reste inconnu** : toute information absente ou non vérifiée doit être présentée comme telle, jamais comme une confirmation.
- **D'où vient l'information** : identifier la source qui a fourni le résultat, avec un libellé compréhensible et, lorsque possible, sa date ou son niveau de fraîcheur.

### Règles de fiabilité

- Toute explication doit être traçable à un champ ou à une donnée effectivement fournie par la source.
- Ne pas inventer de raison, de caractéristique, de disponibilité, de distance ou de niveau de confiance.
- Distinguer une donnée déclarée par la source d'une donnée calculée par Scan ; les calculs doivent reposer sur des entrées disponibles et une règle documentée.
- Si la source ne permet pas de justifier l'affichage du résultat, Scan doit réduire l'affirmation, signaler l'incertitude ou ne pas afficher le résultat.
- L'explication ne doit pas masquer les limites d'une recherche partielle ou d'une source qui n'a pas répondu.
- Les messages restent concis, chaleureux et sans jargon technique inutile. Les détails complémentaires peuvent être accessibles sans surcharger la carte de résultat.

### Historique de validation

- Validation utilisateur : chaque résultat doit expliquer pourquoi il apparaît, quel critère diffère, quelles informations restent non vérifiées et quelle source fournit l'information.


## 10. Fraîcheur des informations — règle V1 validée

Scan doit rendre visible la fraîcheur des informations lorsque la source fournit une date ou un indicateur temporel exploitable. Une information ancienne ne doit pas être présentée comme si elle venait d'être confirmée.

### États de fraîcheur

- **Récente** — la date de publication, de mise à jour ou de vérification est connue et respecte une fenêtre de fraîcheur définie pour le type d'information.
- **Ancienne** — la date est connue, mais dépasse la fenêtre de fraîcheur définie pour le type d'information.
- **Date inconnue** — la source ne fournit aucune date fiable permettant d'évaluer la fraîcheur.

### Règles d'interprétation

- La fenêtre de fraîcheur doit être définie selon la nature de l'information ; une disponibilité, une annonce de service et un événement n'ont pas nécessairement la même durée de validité.
- La date de publication ne doit pas être confondue avec la date de dernière mise à jour ou de dernière confirmation.
- Une date récente ne prouve pas à elle seule que l'information est toujours vraie ou que la disponibilité est encore valable.
- Une disponibilité ne peut être présentée comme confirmée actuellement que si la source fournit une confirmation suffisamment récente et explicite selon une règle définie.
- Si la date est inconnue, Scan l'indique clairement et ne déduit pas une fraîcheur.
- Si la source ne permet pas de vérifier l'actualité, Scan peut afficher le résultat avec cette réserve, le classer comme proche/alternative selon les règles applicables, ou l'écarter si l'actualité est une exigence stricte.
- Les règles de durée par type d'information, les seuils et les éventuels mécanismes de revalidation restent à spécifier et tester avant implémentation.
- La fraîcheur affichée doit provenir de métadonnées réelles de la source ; aucun horodatage ne doit être inventé.

### Historique de validation

- Validation utilisateur : Scan distingue les informations récentes, anciennes et de date inconnue, et ne présente jamais une annonce ancienne comme une disponibilité actuelle confirmée.

## 11. Informations contradictoires entre sources — règle V1 validée

Lorsque plusieurs sources fournissent des informations incompatibles sur un même élément, Scan doit rendre cette contradiction visible. Il ne choisit pas arbitrairement une version et ne transforme pas un conflit en certitude.

### Détection et distinction des situations

- **Contradiction explicite** — deux sources comparables donnent des valeurs incompatibles sur un même fait (par exemple, disponibilité annoncée d'un côté et indisponibilité de l'autre).
- **Informations non comparables** — les sources ne décrivent pas exactement le même élément, la même période, la même zone ou le même état ; Scan ne doit pas présenter cette différence comme un conflit établi.
- **Information obsolète** — une donnée plus ancienne peut expliquer l'écart, mais son ancienneté ne suffit pas à prouver automatiquement que l'autre donnée est correcte.
- **Information absente** — l'absence d'une valeur dans une source n'est pas une contradiction et ne confirme aucune des autres valeurs.

### Règles de traitement

- Ne pas choisir arbitrairement une source ni masquer le conflit par un score, un classement ou une formulation affirmative.
- Examiner la fraîcheur des données selon les règles de la section 10 et la qualité des sources uniquement à partir de métadonnées et de critères documentés et vérifiables.
- Ne pas inventer de score de fiabilité, de hiérarchie entre sources ou de mécanisme de résolution.
- Tant qu'une contradiction pertinente n'est pas résolue par une preuve suffisante, Scan ne présente pas le fait concerné — notamment une disponibilité — comme certain ou confirmé.
- Expliquer simplement ce qui diffère, identifier les sources concernées et afficher leurs dates lorsque celles-ci sont disponibles.
- Si les éléments ne permettent pas de déterminer quelle information est valable, conserver explicitement l'incertitude ; selon son importance pour la demande, qualifier le résultat avec réserve ou ne pas le présenter comme une correspondance exacte.
- Une information plus récente ne l'emporte pas automatiquement : sa comparabilité et la nature de la confirmation doivent également être établies.

### Points restant à spécifier avant implémentation

Les règles de priorité entre sources, les critères mesurables de qualité, les seuils de fraîcheur propres à chaque donnée et les éventuelles résolutions automatiques restent à documenter et à tester. Aucune résolution automatique ne doit être supposée en V1 tant que ces règles ne sont pas définies et validées.

### Historique de validation

- Validation utilisateur : Scan doit signaler les informations réellement contradictoires, ne pas choisir arbitrairement entre les sources et ne pas affirmer une disponibilité certaine sans preuve suffisante.

## 12. Détection et traitement des doublons entre sources — règle V1 validée

Scan peut recevoir plusieurs annonces provenant de sources différentes qui semblent décrire le même service, la même personne, le même produit ou la même opportunité. Il doit limiter les répétitions inutiles sans fusionner à tort des éléments distincts.

### Distinguer les cas

- **Doublon confirmé** — les sources fournissent des identifiants communs ou des éléments concordants suffisamment probants selon des règles explicites et vérifiables.
- **Doublon probable** — plusieurs caractéristiques concordent, mais les éléments disponibles ne suffisent pas à établir qu'il s'agit du même élément.
- **Éléments distincts** — une différence significative est établie, ou les données montrent qu'il s'agit d'entités différentes.
- **Indéterminé** — les données sont insuffisantes pour conclure.

Une ressemblance de titre, de description, de catégorie, de lieu ou de date, prise isolément, ne suffit pas à confirmer un doublon.

### Règles de présentation et de regroupement

- Ne pas supprimer silencieusement une annonce parce qu'elle ressemble à une autre.
- Ne fusionner automatiquement l'affichage que lorsque le doublon est confirmé par des critères documentés et testables.
- Pour un doublon probable ou indéterminé, conserver les annonces distinctes ou les présenter comme des éléments possiblement liés, avec une réserve claire.
- Préserver pour chaque annonce sa source d'origine, ses identifiants, ses dates, ses données propres et son état de fraîcheur.
- Si plusieurs sources confirment le même élément, rendre les sources consultées identifiables ; ne pas faire croire qu'une source a fourni les données des autres.
- Ne pas additionner, compléter ou harmoniser des champs contradictoires comme s'ils décrivaient nécessairement une seule annonce.
- Une mise à jour d'une source ne doit pas écraser sans preuve les informations propres à une autre source.
- Le regroupement ne doit pas modifier artificiellement le nombre de personnes, de services ou d'opportunités réellement disponibles.

### Protection contre les faux rapprochements

- Les critères de rapprochement doivent dépendre du type d'élément : une personne, une annonce de service, un produit et un événement ne s'identifient pas de la même manière.
- Ne pas utiliser de données sensibles ou de rapprochements intrusifs pour identifier une personne.
- Ne pas exposer d'identifiants internes ou techniques dans l'interface utilisateur.
- Si les éléments nécessaires au rapprochement ne sont pas disponibles ou autorisés, Scan indique l'incertitude et ne prétend pas avoir dédupliqué les résultats.

### Points restant à spécifier avant implémentation

Les critères propres à chaque famille, les identifiants fiables utilisables, les seuils de confirmation, la durée de conservation des liens entre annonces et les règles de mise à jour restent à définir et à tester. Aucun score de similarité arbitraire ni rapprochement automatique non validé n'est autorisé par cette décision.

### Historique de validation

- Validation utilisateur : Scan doit éviter les doublons entre sources sans fusionner des éléments distincts sur la seule base d'une ressemblance ; la provenance et les incertitudes doivent être conservées.

## 13. Gestion géographique des résultats — règle V1 validée

Scan doit interpréter la localisation avec prudence et expliquer clairement la portée géographique de chaque recherche. Une proximité supposée, une zone déclarée et une distance calculée ne sont pas des informations équivalentes.

### Distinguer les informations géographiques

- **Localisation précise vérifiée** — coordonnées ou adresse suffisamment précises, autorisées et exploitables pour le calcul prévu.
- **Localisation approximative** — quartier, secteur, zone ou position volontairement imprécise ; Scan ne lui attribue pas une distance exacte.
- **Localisation déclarée** — lieu indiqué par la personne ou la source, sans vérification indépendante ; l'interface ne le présente pas comme une position vérifiée.
- **Localisation inconnue** — aucune information géographique exploitable ; Scan ne fabrique ni lieu ni distance.

### Rayon et calcul de distance

- Le rayon demandé par l'utilisateur constitue un critère géographique explicite de recherche.
- Une distance métrique ne peut être affichée que si les coordonnées nécessaires sont disponibles et si une méthode de calcul documentée est effectivement appliquée.
- La méthode doit préciser ce qui est mesuré : distance géographique directe ou distance de trajet. Ces deux valeurs ne doivent jamais être confondues.
- Une grille, une cellule ou une zone de regroupement ne permet pas à elle seule d'affirmer une distance métrique précise.
- Si la précision des données ne permet pas de vérifier qu'un résultat respecte le rayon, Scan ne le présente pas comme étant certainement dans le rayon.
- Les résultats dont la distance ne peut pas être établie peuvent être présentés séparément comme localisation approximative ou non vérifiée, si cela reste utile et compréhensible ; ils ne sont pas mélangés aux résultats dont la proximité est confirmée.
- Le rayon ne doit pas être élargi automatiquement. Toute proposition d'élargissement suit la règle de la section 7 et nécessite le choix de l'utilisateur.

### Résultats proches des limites et zones imprécises

- Scan tient compte de la précision connue des données lorsqu'il évalue un résultat proche de la limite du rayon.
- Si l'incertitude géographique empêche de déterminer de quel côté de la limite se trouve un résultat, il le signale au lieu de trancher artificiellement.
- Une zone déclarée ou approximative ne doit pas être transformée en point exact pour faciliter le classement.
- Un résultat situé dans une zone voisine ne doit pas être présenté comme respectant le rayon demandé sans preuve suffisante.
- Si la localisation est une exigence stricte et qu'elle ne peut pas être vérifiée, le résultat ne peut pas être qualifié de correspondance exacte sur ce critère.

### Respect de la vie privée et transparence

- Scan n'affiche que le niveau de précision nécessaire à la recherche et autorisé par la source et les permissions applicables.
- La position précise d'une personne ne doit pas être révélée à partir d'une localisation approximative ou d'une zone de recherche.
- Les données de localisation ne doivent pas être conservées ou réutilisées au-delà des finalités et durées autorisées.
- L'interface explique simplement si la proximité est calculée, approximative ou inconnue, sans exposer de détails techniques inutiles.

### Points restant à spécifier avant implémentation

La méthode de calcul retenue, les exigences de précision par type de source, le traitement des incertitudes aux limites, les règles de confidentialité, les éventuelles zones géographiques prises en charge et les seuils associés restent à documenter et à tester. Aucun calcul de distance, niveau de précision ou comportement géographique n'est considéré comme implémenté par cette décision.

### Historique de validation

- Validation utilisateur : Scan doit distinguer localisation précise, approximative, déclarée et inconnue ; ne pas inventer de distance ni de proximité, signaler l'incertitude aux limites du rayon et ne jamais élargir la zone sans accord de l'utilisateur.

## 14. Gestion des horaires et des disponibilités — règle V1 validée

Scan doit distinguer les horaires annoncés, les périodes de disponibilité et une confirmation réelle de disponibilité. La publication d'une annonce, même récente, ne prouve pas qu'un service ou une personne est disponible au moment de la recherche.

### États de disponibilité

- **Disponible maintenant** — la source fournit une indication explicite et suffisamment récente couvrant le moment de la recherche, selon une règle de fraîcheur définie pour ce type d'information.
- **Disponible plus tard** — une période future est explicitement indiquée par la source et correspond au créneau recherché ; cela ne signifie pas que la disponibilité est confirmée pour le moment présent.
- **Disponibilité récurrente** — la source décrit un horaire qui se répète selon des jours ou des périodes précis. Scan conserve la distinction entre règle récurrente et confirmation ponctuelle pour une date donnée.
- **Indisponible sur le créneau** — la source indique explicitement que le créneau demandé n'est pas disponible.
- **Disponibilité expirée** — la période annoncée est passée ou la validité de l'information est dépassée selon une règle documentée.
- **Non confirmée / inconnue** — la source ne donne pas d'information suffisante, ou ne permet pas de vérifier la disponibilité pour le créneau demandé.

### Règles d'interprétation

- Distinguer l'heure de publication, la dernière mise à jour, la période annoncée et la dernière confirmation effective.
- Ne pas déduire une disponibilité actuelle d'une annonce simplement visible ou récemment publiée.
- Une disponibilité future ne doit pas être présentée comme une disponibilité immédiate.
- Un horaire récurrent décrit une habitude ou une règle déclarée ; il ne confirme pas à lui seul chaque occurrence.
- Si l'utilisateur demande un créneau précis, Scan vérifie ce créneau et ne remplace pas silencieusement la date, l'heure ou le fuseau horaire.
- Si le fuseau horaire est nécessaire et inconnu ou ambigu, Scan demande une clarification courte ou signale que le créneau ne peut pas être vérifié.
- Les intervalles doivent être interprétés sans inventer de durée, de disponibilité entre deux créneaux ou de continuité non indiquée par la source.
- Une contradiction entre horaires ou états de disponibilité suit la règle de la section 11 ; Scan ne choisit pas arbitrairement une valeur.
- Une information expirée ou non confirmée ne peut pas justifier une correspondance exacte lorsque la disponibilité est une exigence stricte.
- Si une source ne fournit pas de disponibilité, Scan affiche « non confirmée » ou « inconnue », et non « indisponible ».

### Présentation à l'utilisateur

- Indiquer clairement le jour, la date et le créneau lorsque ces données sont fournis et pertinents.
- Distinguer les horaires d'ouverture ou de fonctionnement d'un service de la disponibilité effective d'une personne ou d'une prestation.
- Afficher la date ou le moment de dernière confirmation lorsque la source le permet.
- Employer des formulations simples : « disponible maintenant », « proposé demain matin », « horaires habituels », « disponibilité à confirmer » ou « créneau passé », selon les données réellement connues.
- Ne pas afficher de compte à rebours, de disponibilité en direct ou de confirmation instantanée si la source ne fournit pas ces informations.

### Points restant à spécifier avant implémentation

Les fenêtres de fraîcheur par type de disponibilité, la fréquence de revalidation, la gestion précise des fuseaux horaires, les règles des horaires récurrents, les bornes des créneaux et les contrats de confirmation propres à chaque source restent à définir et à tester. Aucun état de disponibilité en temps réel n'est considéré comme implémenté par cette décision.

### Historique de validation

- Validation utilisateur : Scan doit distinguer disponibilité actuelle, future, récurrente, expirée, explicitement indisponible et non confirmée ; un horaire publié ne constitue pas à lui seul une confirmation de disponibilité.

## 15. Annulations, modifications et suppressions d'annonces — règle V1 validée

Scan doit tenir compte du cycle de vie d'une annonce afin de ne pas continuer à présenter comme active une proposition explicitement annulée, retirée ou expirée. Il doit distinguer l'état de l'annonce de la réalité du service, de la personne ou de l'opportunité qu'elle décrit.

### États du cycle de vie

- **Active** — la source indique explicitement que l'annonce est active, ou fournit un état exploitable dont la validité est établie selon son contrat.
- **Modifiée** — la source signale une nouvelle version ou un changement de données. Scan conserve la date et la provenance de cette modification.
- **Annulée** — la source indique explicitement que l'annonce ou la proposition a été annulée.
- **Retirée / supprimée** — la source confirme explicitement que l'annonce n'est plus publiée ou a été supprimée de son système.
- **Expirée** — la période de validité annoncée est passée selon les données et règles temporelles disponibles.
- **Statut inconnu / non vérifié** — la source ne fournit pas d'état suffisamment fiable, ou la vérification n'a pas pu être menée à terme.

### Règles de traitement

- Seuls les événements ou états réellement fournis par une source autorisée peuvent établir une annulation, un retrait, une suppression ou une modification.
- L'absence momentanée d'une annonce dans une réponse ne prouve jamais sa suppression : pagination incomplète, filtre, délai, panne, cache, recherche partielle ou indisponibilité de la source peuvent expliquer cette absence.
- Une annonce explicitement annulée, retirée, supprimée ou expirée ne doit plus être présentée comme une proposition active ou disponible.
- Si cela apporte une utilité réelle, son état peut être indiqué dans un historique ou un contexte distinct, sans la mélanger aux annonces actives.
- Une modification doit préserver la provenance, l'identifiant de source, la date de modification et, lorsque cela est nécessaire pour comprendre un changement, la dernière version connue.
- Une nouvelle version ne doit pas écraser silencieusement une information concurrente ou contradictoire provenant d'une autre source. Les règles de contradiction de la section 11 continuent de s'appliquer.
- La suppression d'une annonce ne signifie pas nécessairement que le service, la personne, le produit ou l'opportunité sous-jacente n'existe plus. Scan ne doit pas déduire cette disparition.
- Si l'état ne peut pas être vérifié, Scan signale l'incertitude et ne présente pas l'annonce comme certainement active. Si l'activité actuelle est une exigence stricte, le statut inconnu ne peut pas justifier une correspondance exacte.
- Les changements d'état et leur date ne doivent jamais être inventés. La date de détection par Scan doit rester distincte de la date effective de l'événement lorsqu'elle est connue.

### Points restant à spécifier avant implémentation

Les contrats d'événements de cycle de vie par source, la fréquence de revalidation, la gestion des suppressions propagées, les marqueurs de retrait (« tombstones »), le cache, les durées de rétention, la traçabilité des changements et les règles relatives aux droits de suppression des données restent à définir et à tester. Cette décision ne suppose aucun mécanisme de synchronisation ou de suppression déjà implémenté.

### Historique de validation

- Validation utilisateur : Scan doit distinguer les annonces actives, modifiées, annulées, retirées ou supprimées, expirées et de statut inconnu ; une absence temporaire dans une réponse de source ne constitue pas une preuve de suppression.

## 16. Frontière géographique et comportementale entre Scan et Radar — règle V1 validée

Scan et Radar sont deux moteurs distincts. Leur différence ne tient pas seulement à la taille du rayon : elle concerne aussi le point géographique utilisé et le caractère ponctuel ou suivi de la recherche.

### Scan — explorer ponctuellement autour d'un point de référence choisi

- Scan effectue une exploration ponctuelle autour d'un point de référence explicitement choisi pour ce lancement : position GPS actuelle autorisée, zone approximative si elle est réellement prise en charge, ou lieu public sélectionné manuellement.
- Son rayon est limité et plus restreint que les possibilités de recherche géographique prévues pour Radar.
- Si l'utilisateur se déplace vers un autre quartier ou une autre ville, il peut lancer une nouvelle exploration depuis sa nouvelle position ou sélectionner un autre lieu public. Chaque exploration reste distincte et ses résultats ne sont pas mélangés.
- Scan est une recherche ponctuelle déclenchée par l'utilisateur. Il ne suit pas sa position en continu et ne surveille pas automatiquement les lieux déjà visités ou les zones précédemment scannées.
- Après un Scan, l'utilisateur peut accorder séparément une autorisation temporaire de signalement de nouvelles informations correspondant à sa dernière recherche et à son dernier périmètre. Cette autorisation facultative, révocable et à expiration automatique n'actualise jamais sa position et ne constitue pas une mission Radar ; ses règles détaillées figurent à la section 24.
- Un résultat géographique doit respecter les règles de précision, de calcul et d'incertitude de la section 13. Aucun rayon ni aucune distance ne peut être prétendu appliqué si le calcul correspondant n'est pas réellement effectué.

### Radar — surveiller une zone choisie, indépendante de sa position

- Radar permet à l'utilisateur de sélectionner une zone d'intérêt qui peut être différente de l'endroit où il se trouve actuellement.
- Il peut ainsi suivre des possibilités ciblées dans une zone choisie, même lorsque l'utilisateur se trouve ailleurs.
- Cette surveillance est distincte d'un scan ponctuel : elle peut s'inscrire dans la durée selon des paramètres que l'utilisateur configure explicitement dans Radar.
- Radar peut proposer des périmètres plus étendus, des zones ciblées et, si des données fiables existent, des zones à forte fréquentation.
- La sélection d'une zone ne garantit ni couverture exhaustive, ni résultat, ni disponibilité. Les résultats dépendent des sources réellement raccordées, autorisées et consultées.

### Passage volontaire de Scan vers Radar

- Lorsque la recherche Scan montre qu'une exploration plus large ou le suivi d'une autre zone pourrait être utile, Scan peut proposer d'ouvrir Radar.
- L'utilisateur doit ouvrir Radar pour choisir la zone, définir les paramètres de recherche et activer, le cas échéant, une surveillance.
- Scan ne bascule pas automatiquement vers Radar, ne lance pas une recherche Radar en arrière-plan et ne modifie pas silencieusement le rayon ou la zone.
- Les critères de la recherche initiale peuvent être repris comme point de départ uniquement si le parcours le permet réellement et si l'utilisateur peut les vérifier et les modifier avant de lancer la recherche Radar.
- Une recherche ou une surveillance effectuée dans Radar doit être clairement identifiée comme telle ; elle ne doit pas être présentée comme une recherche déjà exécutée ou vérifiée par Scan.

### Limites et éléments restant à spécifier

- Lorsque le mode GPS est choisi, la position doit être actuelle au moment du lancement et non une ancienne position conservée sans indication.
- Une zone approximative ou un lieu public sélectionné manuellement doit être identifié comme tel ; une localisation approximative ne doit jamais être présentée comme exacte.
- Le changement de point de référence entre deux explorations conduit à un nouveau périmètre distinct ; il ne transforme pas Scan en surveillance persistante.
- Pour Radar, restent à définir : les modes de sélection de zone (carte, adresse, quartier ou autre), les rayons et limites autorisés, la durée et la fréquence de surveillance, les conditions d'actualisation, les notifications, les sources consultées et les règles de désactivation.
- Les zones à forte fréquentation doivent reposer sur des données et une méthode documentées ; aucun niveau de trafic ne doit être inventé.
- Les deux moteurs restent soumis aux permissions, à la précision géographique, aux limites des sources et aux règles de confidentialité.
- Cette décision fixe la distinction produit ; elle ne signifie pas que le calcul dynamique du rayon Scan ou la surveillance de zone Radar sont déjà implémentés.

### Historique de validation

- Validation utilisateur initiale : Scan explore ponctuellement les environs de la position actuelle, avec un rayon plus limité ; après déplacement, un nouveau scan porte sur les environs de la nouvelle position.
- Clarification produit ultérieure : chaque exploration Scan peut utiliser un point de référence explicitement choisi — GPS actuel, zone approximative réellement prise en charge ou lieu public sélectionné manuellement. Plusieurs zones peuvent être explorées dans une même session, avec des résultats séparés.
- Validation utilisateur : Radar peut surveiller une ou plusieurs zones choisies indépendamment de la position actuelle, dans la durée.
- La règle de référence initiale centrée uniquement sur la position actuelle est donc précisée par les décisions des sections 20 et 26 ; elle ne doit pas exclure la sélection manuelle d'un lieu public.


## 17. Scan comme scanner intelligent d'environnement — règle V1 validée

Scan est un **scanner d'environnement**. Il explore les possibilités et les informations utiles présentes dans une zone, au lieu de se limiter à rechercher une annonce ou une catégorie unique. Un même environnement peut contenir, par exemple, des marchés, des commerces, des centres commerciaux, des restaurants, des services, des lieux de loisirs et des zones d'événements ou de fête.

Le moteur doit sélectionner et organiser les découvertes utiles à la demande. La qualité, la pertinence et la lisibilité priment sur le volume brut. Un grand rayon qui produit des milliers d'éléments difficiles à consulter n'est pas un résultat satisfaisant.

### Taxonomie évolutive

La classification est organisée en grandes familles et sous-catégories. Elle doit pouvoir évoluer sans reconstruire le moteur. Les familles de découverte déjà définies à la section 1 décrivent les domaines de données et de possibilités ; elles ne remplacent pas la taxonomie des lieux, activités et environnements. Les deux dimensions peuvent coexister dans le modèle de classement.

Exemples de grandes catégories d'environnement :
- commerces et shopping ;
- alimentation et restauration ;
- loisirs, sorties et événements ;
- services et activités professionnelles ;
- transport et mobilité ;
- santé et bien-être ;
- éducation et formation ;
- lieux publics et espaces de rencontre.

Ces exemples constituent une base de classification, pas une liste fermée. Chaque famille peut contenir des sous-catégories adaptées. Une catégorie n'est présentée comme disponible que si des données ou une source réelle permettent de l'explorer.

### Présentation contextuelle

- Scan met en avant les catégories pertinentes selon l'environnement et la demande.
- L'utilisateur peut toujours accéder à toutes les catégories disponibles ; une catégorie moins fréquente n'est pas supprimée définitivement.
- Les catégories prioritaires peuvent changer lorsque l'utilisateur précise sa demande ou explore une autre zone.
- La présentation doit rester légère et ne pas afficher systématiquement toutes les sous-catégories dès l'ouverture.

## 18. Recherche libre, compréhension et demandes imprécises — règles V1 validées

### Recherche libre en langage naturel

L'utilisateur peut écrire directement ce qu'il cherche, avec ses propres mots, sans devoir sélectionner une catégorie ou remplir des filtres. Exemples : « un marché ouvert près de moi », « un endroit animé pour sortir ce soir », « un centre commercial avec des restaurants » ou « où trouver rapidement un mécanicien ? ».

Les catégories et filtres restent des moyens complémentaires de parcourir et préciser l'environnement ; ils ne sont pas des prérequis à la recherche libre.

### Interprétation d'une demande ambiguë

Lorsque la demande permet plusieurs interprétations (par exemple « un endroit sympa »), Scan :
- propose quelques interprétations plausibles et compréhensibles ;
- laisse l'utilisateur choisir ou reformuler ;
- peut aussi lancer une exploration générale pertinente sans attendre sa réponse ;
- ne transforme pas cette étape en formulaire ou questionnaire obligatoire.

### Demande trop large ou imprécise

Scan commence par présenter une sélection pertinente avec les données disponibles. Il explique brièvement pourquoi la demande reste large, puis propose des moyens simples de la préciser : catégorie, type de lieu ou d'activité, période, caractéristique recherchée ou périmètre. Il ne bloque pas systématiquement l'exploration en exigeant une précision préalable.

## 19. Organisation des résultats et approfondissement — règles V1 validées

### Présentation mixte

Les résultats sont organisés en trois niveaux :
1. **Découvertes prioritaires** : sélection des éléments les plus pertinents, toutes catégories confondues.
2. **Sections par catégorie** : résultats regroupés par familles pour faciliter l'exploration.
3. **Autres résultats** : accès progressif, sans charger ni afficher d'emblée un volume difficile à consulter.

La pertinence par rapport à la demande reste le premier critère de classement. La proximité, la fraîcheur et la fiabilité interviennent ensuite selon les règles déjà définies ; un élément ne doit pas être promu uniquement parce qu'il est proche.

### Approfondissement d'une catégorie

À l'ouverture d'une catégorie, Scan affiche une première sélection pertinente, puis permet :
- d'affiner avec des critères adaptés à cette catégorie ;
- de charger progressivement davantage de résultats ;
- de conserver le contexte et les critères de la recherche initiale ;
- de revenir aux autres catégories sans perdre la recherche en cours.

Scan ne doit pas charger d'un seul coup des milliers de résultats. La pagination ou le chargement progressif doit être borné et mesuré.

### Filtres généraux et contextuels

La V1 combine :
- des filtres généraux applicables lorsque leur sens est pertinent (par exemple zone, période ou distance) ;
- des filtres spécifiques à la catégorie (par exemple type de cuisine et gamme de prix pour la restauration, ou type et date pour un événement).

Les filtres sont proposés selon la catégorie réellement explorée. Un filtre n'est jamais affiché comme appliqué s'il n'est pas transmis et respecté par le service ou la source.

## 20. Plusieurs zones dans une même session — règle V1 validée

L'utilisateur peut explorer plusieurs zones de référence au cours d'une même session Scan. Chaque zone donne lieu à une exploration distincte.

- Les résultats de chaque zone restent séparés.
- Chaque exploration conserve son propre point de référence, son rayon et ses critères effectifs.
- Scan ne fusionne pas automatiquement les résultats de zones différentes.
- L'utilisateur peut revenir aux résultats d'une zone déjà explorée pendant la session, dans les limites de conservation locale définies.
- La V1 ne nécessite pas d'interface dédiée de comparaison côte à côte entre zones.
- La sélection manuelle d'un lieu public est un point de référence possible si le service le prend effectivement en charge ; elle ne doit pas être confondue avec une position GPS actuelle.

Les modes de référence autorisés (position GPS actuelle, zone approximative prise en charge ou sélection manuelle d'un lieu public) sont décrits dans les règles géographiques. Le choix d'une zone dans Scan reste une exploration ponctuelle ; la surveillance durable d'une zone relève de Radar.

## 21. Présentation des correspondances et alternatives — présentation hybride validée

La qualification détaillée des résultats est définie à la section 6 : correspondance exacte, correspondance proche et alternative sont trois statuts distincts. L'interface ne doit jamais mélanger ces statuts ni présenter une alternative comme une réponse exacte.

La présentation hybride validée à la section 7 s'applique : résultats exacts en premier lorsqu'ils existent, correspondances proches dans une section distincte, alternatives moins proches dans une section secondaire. Lorsque aucun exact n'est trouvé, Scan l'indique clairement et présente uniquement les pistes pertinentes déjà obtenues. Toute modification des critères stricts, du rayon, de la période, de la catégorie ou des filtres nécessite l'accord de l'utilisateur.

## 22. Personnalisation et préférences — règles V1 validées

- La personnalisation reste discrète, utile et contrôlable ; elle ne doit pas enfermer l'utilisateur dans ses habitudes.
- Pour un membre connecté, les préférences de recherche peuvent être conservées de manière persistante.
- La personnalisation est activée par défaut pour un membre, mais celui-ci peut la désactiver, consulter ses préférences, les modifier ou les supprimer.
- Pour un invité, les préférences sont temporaires et limitées à la session ; elles ne sont pas conservées après celle-ci.
- Les préférences influencent la sélection ou le classement uniquement lorsqu'elles sont pertinentes et compatibles avec la demande explicite. Elles ne remplacent jamais les critères stricts de l'utilisateur.

## 23. Historique de recherche — règles V1 validées

- Un membre connecté peut retrouver ses recherches, consulter leurs critères et leur rayon, les relancer et supprimer chaque entrée individuellement.
- Un invité dispose uniquement d'un historique temporaire de session, qui disparaît à la fin de celle-ci.
- L'historique ne doit pas conserver de coordonnées précises inutiles.
- La durée de conservation, le nombre maximal d'entrées et les champs exacts conservés restent à fixer avant implémentation ; aucune durée ou capacité non validée ne doit être inventée.

## 24. Actualisation et signalement temporaire après Scan — règles V1 validées

### Scan à la demande

Scan reste un moteur déclenché à la demande. L'utilisateur peut actualiser ses résultats. Il ne suit pas en continu la position de l'utilisateur et ne transforme pas une exploration ponctuelle en surveillance permanente.

### Autorisation temporaire de signalement

Après un Scan, l'utilisateur peut choisir d'autoriser temporairement le signalement de nouvelles informations correspondant à sa dernière recherche et à son dernier périmètre, y compris lorsque l'application est fermée.

Cette autorisation :
- est facultative, distincte du lancement du Scan et révocable à tout moment ;
- porte uniquement sur les critères et le périmètre de la recherche concernée ;
- n'active pas le suivi GPS et ne déclenche aucune actualisation de position ;
- expire automatiquement à la durée choisie ;
- ne se renouvelle jamais silencieusement ;
- reste distincte d'une mission Radar et ne doit pas être présentée comme telle.

### Durée et recherches suivies simultanément

- L'utilisateur choisit parmi plusieurs durées proposées, dans une limite maximale V1 à définir.
- Plusieurs recherches peuvent être autorisées simultanément, chacune avec ses propres critères, périmètre et expiration.
- Un quota strict limite le nombre d'autorisations actives ; si le quota est atteint, Scan propose de terminer une autorisation existante.
- L'utilisateur peut arrêter individuellement chaque autorisation.
- Les options de durée, le plafond maximal et le quota exact restent à spécifier avant implémentation.

### Pertinence des notifications

- Les découvertes de pertinence élevée peuvent déclencher une notification push si l'utilisateur l'a autorisée.
- Les découvertes de pertinence moyenne restent visibles dans Scan sans push.
- Les découvertes de faible pertinence ne sont signalées que si cela apporte une utilité réelle ; sinon elles sont filtrées.
- Les seuils doivent être définis et testés. Aucun score numérique arbitraire n'est validé.
- Les notifications dans l'application et application fermée respectent les autorisations système et les préférences de l'utilisateur.

## 25. Contributions et vérification des informations — règles V1 validées

Les membres et les invités peuvent proposer de nouveaux lieux ou des corrections, selon des règles et quotas adaptés à leur statut.

- Une contribution non vérifiée est identifiée explicitement comme telle.
- Elle ne devient confirmée qu'après une vérification appropriée.
- Les contrôles combinent automatisation, sources fiables et validation humaine lorsque nécessaire ; un contrôle automatique seul ne prouve pas l'existence réelle d'un lieu ou la véracité d'une information.
- Les membres peuvent signaler une fermeture, un déménagement, des horaires erronés, un événement annulé ou une information obsolète.
- Plusieurs signalements concordants peuvent augmenter la priorité de vérification, sans constituer à eux seuls une confirmation.
- Les invités peuvent contribuer sans compte avec une identité temporaire de session, des quotas adaptés et une vérification supplémentaire proportionnée au risque. Aucun historique de compte invité n'est créé.
- Les traces de vérification sont minimales et limitées à ce qui est nécessaire pour la confiance et la modération.

## 26. Protection des lieux et précision géographique — règles V1 validées

- Les lieux publics peuvent être affichés avec une localisation exacte lorsque la donnée est fiable et que cette précision est appropriée.
- Les lieux privés ou sensibles bénéficient d'une protection renforcée ou sont exclus ; les domiciles privés ne sont jamais exposés.
- Une localisation approximative est présentée comme approximative. Scan ne fabrique jamais une précision métrique à partir d'une grille ou d'une donnée qui ne la permet pas.
- Les modes de référence possibles sont : position GPS précise avec autorisation, zone approximative si le système la prend réellement en charge, ou sélection manuelle d'un lieu public.
- L'interface indique le mode de localisation et son niveau de précision.
- La navigation peut être proposée depuis la fiche d'un lieu : adresse et distance lorsque disponibles, carte intégrée Vitalis et option de navigation externe. La solution V1 doit rester légère et éviter une dépendance coûteuse.
- La disponibilité réelle de chaque mode, la méthode de calcul et la précision affichée doivent être vérifiées techniquement avant d'être promises.

## 27. Fonctionnement hors connexion et conservation locale — règles V1 validées

- Les résultats déjà consultés peuvent être conservés localement pour consultation hors connexion.
- La durée de cache est adaptative selon le type d'information, avec un plafond strict de durée et de volume à définir.
- Un événement terminé est retiré des événements actifs après son expiration.
- Une fiche de commerce peut être conservée plus longtemps ; les horaires et disponibilités anciens sont signalés comme à confirmer.
- Hors connexion, l'utilisateur peut préparer une exploration à relancer. Une recherche préparée n'est pas exécutée et ne doit jamais être présentée comme telle.
- Au retour du réseau, Scan demande une confirmation avant de lancer la recherche préparée.
- Les données potentiellement obsolètes affichent leur date de dernière actualisation et une réserve adaptée.

## 28. Mise à jour après reconnexion — règles V1 validées

- Après reconnexion, la nouvelle version disponible remplace la fiche active consultée.
- Scan conserve la date de dernière actualisation et une trace minimale des changements nécessaires.
- Les changements importants peuvent être signalés à l'utilisateur.
- Les contradictions et incertitudes restent visibles ; une mise à jour plus récente ne résout pas automatiquement un conflit.
- La synchronisation ne doit pas réintroduire des données supprimées ou non autorisées.

## 29. Limites de couverture et transparence — règles V1 validées

- Scan présente les découvertes disponibles dans les sources réellement consultées ; il ne prétend pas couvrir tout l'environnement.
- Lorsque la couverture est limitée, il le signale clairement.
- L'utilisateur peut signaler un lieu ou une activité manquante.
- Une contribution apparaît comme non vérifiée jusqu'à son contrôle ; elle ne se confond pas avec une découverte confirmée.
- Une absence dans les sources consultées ne prouve pas l'inexistence d'un lieu ou d'une activité.

## 30. Points de conception encore ouverts

Les règles suivantes sont validées dans leur principe, mais leurs paramètres ou contrats exacts restent à définir avant implémentation :
- valeurs du rayon par défaut, options de rayon et plafond strict V1 ;
- limites d'adaptation du rayon par densité, type de demande et quantité de résultats ;
- fenêtres de fraîcheur et de validité par type d'information ;
- seuils mesurables de pertinence et règles de départage ;
- seuils et paramètres de confiance ;
- nombre maximal de résultats affichés par section et taille des lots de chargement progressif ;
- taxonomie détaillée, libellés définitifs et correspondance entre catégories et sources ;
- filtres généraux et filtres propres à chaque sous-catégorie ;
- durées et quotas de signalement temporaire après Scan ;
- quotas de contributions et contrôles anti-abus ;
- durées, volumes et champs du cache local et de l'historique ;
- sources de données autorisées, contrats, couverture et coûts ;
- méthodes géographiques et précision réellement disponible ;
- paramètres de notification, seuils de pertinence et mécanismes de livraison ;
- décision de présentation et de déclenchement des alternatives lorsqu'aucune correspondance exacte n'est disponible ;
- conditions de disponibilité des cartes et de la navigation intégrée.

Ces points sont des paramètres à spécifier ou vérifier, pas des décisions de principe encore ouvertes. Leur présence dans la liste ne signifie pas qu'une implémentation existe.

### Historique de validation complémentaire

- Validation utilisateur : Scan est un scanner intelligent d'environnement, avec classification évolutive, sélection contextuelle des catégories, recherche libre, compréhension non bloquante des demandes imprécises, résultats mixtes et approfondissement progressif.
- Validation utilisateur : filtres généraux et filtres adaptés à chaque catégorie ; plusieurs zones explorables dans une session avec résultats séparés ; correspondances exactes, proches et alternatives clairement distinguées.
- Validation utilisateur : personnalisation contrôlable, historique membre/invité, signalement temporaire facultatif après Scan, contributions avec vérification, protection des lieux, modes géographiques explicites, consultation hors ligne et mise à jour contrôlée après reconnexion.

## 31. Consolidation des règles Scan V1 — décisions validées (2026-11-18)

Cette section regroupe les décisions prises pendant la finalisation produit. Elle prévaut sur les paramètres précédemment indiqués comme ouverts dans la section 30. La portée reste documentaire : aucun code, schéma, migration, configuration, secret ou déploiement n'est autorisé par cette validation.

### Période et suivi après Scan
- La fenêtre temporelle des résultats est **intelligente et adaptée à la demande** (maintenant, aujourd'hui, prochaines heures ou jours, selon la demande et la nature de l'information). Les dates ne sont pas inventées.
- Le signalement temporaire après Scan propose une **durée intelligente**, suggérée selon le besoin et modifiable par l'utilisateur ; il expire automatiquement, est révocable et ne se renouvelle pas silencieusement. Il reste distinct de Radar et n'implique pas de GPS continu.
- **3 suivis simultanés maximum** en V1, chacun avec ses critères, son périmètre et son expiration. Arrêt individuel, expiration libérant une place ; aucun dépassement payant en V1.
- Notifications intelligentes : pertinence très élevée = push si autorisé ; pertinence moyenne = signal discret dans Vitalis ; faible pertinence = filtrée. Préférences, permissions et quotas sont respectés.
- Historique membre : **3 jours maximum**. Relance possible avec critères, période, rayon et filtres utiles ; suppression individuelle et purge automatique. Invité : historique de session uniquement, non persistant après session.
- Cache local : **24 heures maximum et 5 Mo maximum**. Purge des données les plus anciennes en cas de dépassement ; priorité aux résultats utiles de la session active ; médias lourds exclus. Cache toujours présenté comme potentiellement périmé, avec dernière actualisation.

### Correspondances, catégories et volume
- La présentation des correspondances et alternatives reste hybride : exact en premier, proches séparées et différences expliquées, alternatives dans une section secondaire. Aucun critère explicite, rayon, période, catégorie ou filtre n'est assoupli sans accord.
- Évaluation intelligente des critères : Scan distingue exigences essentielles et préférences secondaires, sans modifier silencieusement les contraintes explicites.
- Les grandes zones et volumes élevés sont traités par **sélection intelligente par catégories**, avec quantité disponible lorsque connue et approfondissement indépendant.
- Le nombre de résultats au premier affichage est **adaptatif**, selon richesse, pertinence, diversité et lisibilité ; pas de résultats artificiels pour remplir une section.
- Chargement **progressif intelligent à la demande**, en lots bornés et adaptés à la densité/connexion, sans récupération massive initiale. Déduplication, classement cohérent et quotas serveur stricts.

### Contributions et fiabilité
- Quota : **5 contributions maximum par jour**, membres et invités ; protections renforcées pour invités (session temporaire, contrôles et anti-abus). Aucun quota payant/dépassement en V1.
- Confiance progressive. Un signalement isolé reste en attente ; deux signalements indépendants renforcent la confiance mais ne déclenchent pas de correction sensible automatique ; **trois signalements concordants et indépendants** peuvent permettre une correction ordinaire.
- Les informations sensibles ou à risque nécessitent une vérification renforcée, quel que soit le nombre de signalements. Comptes liés, sessions suspectes ou sources identiques ne sont pas comptés comme indépendants.
- En cas de contradiction, Scan privilégie la **fiabilité et la fraîcheur documentées**, pas une simple majorité. Il signale les versions contradictoires, conserve l'incertitude tant qu'elle n'est pas résolue et ne présente pas une disponibilité comme certaine sans preuve suffisante.
- Les contributions ne deviennent pas automatiquement fiables en raison du quota ou du nombre de signalements ; les contrôles anti-abus restent nécessaires.

### Validité et transparence des informations
- Expiration adaptée au type : événements terminés retirés ; offres/opportunités retirées à expiration ou indisponibilité ; commerces/services conservés tant qu'ils sont considérés actifs et réévalués ; informations incertaines signalées ; données obsolètes exclues des priorités.
- Origine et fiabilité sont **discrètement visibles** : source identifiable, état (vérifié/récent/déclaré/à confirmer selon preuves) et date accessible. Les détails sont consultables sur la fiche. Ne jamais afficher une vérification ou fraîcheur non prouvée.

### Localisation et rayon
- Scan reste utilisable sans GPS : en cas de refus, l'utilisateur peut choisir manuellement un **lieu public**. Position GPS, zone approximative prise en charge et lieu manuel sont clairement distingués ; le rayon part du point choisi. Aucun positionnement faux ou présenté comme exact.
- Rayon maximal V1 : **2 km**. Scan ne dépasse pas ce plafond.
- Rayon initial : **adaptatif/intelligent**, selon la demande, la catégorie, la densité et les résultats estimés, sans dépasser 2 km.
- Un rayon explicitement choisi est strictement respecté ; aucun élargissement automatique. En cas de résultats insuffisants, Scan explique la limite et demande l'accord pour une autre recherche.
- Explication du rayon : **courte et contextuelle**, uniquement lorsqu'elle aide à comprendre le choix ; elle doit refléter le rayon réellement appliqué.

### Paramètres encore à définir ou à prouver
Ces décisions de principe sont fermées. Les détails techniques restent à spécifier ou mesurer, notamment les valeurs exactes des durées intelligentes et des fenêtres par type de source, seuils de pertinence/notifications, règles d'indépendance et anti-abus, tailles des lots et quotas serveur, sources réelles et contrats, précision géographique réellement supportée, et tests de conformité. Ces points ne rouvrent pas les choix validés ci-dessus.

### Historique de validation
- Validation utilisateur : fenêtre temporelle intelligente ; durée intelligente du suivi ; 3 suivis simultanés ; notifications intelligentes ; historique 3 jours ; cache 24 h / 5 Mo ; distinction critères essentiels/secondaires ; présentation par catégories ; sélection initiale adaptative ; provenance/fiabilité discrètes ; expiration selon type ; confiance progressive et quota 5 contributions/jour ; seuil de 3 signalements indépendants pour correction ordinaire ; traitement des contradictions par fiabilité/fraîcheur ; GPS facultatif avec lieu public manuel ; chargement progressif ; rayon maximum 2 km, rayon initial adaptatif et explication contextuelle.
