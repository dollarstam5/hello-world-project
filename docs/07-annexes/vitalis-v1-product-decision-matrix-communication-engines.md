# Matrice de décisions produit V1 — Communication et moteurs secondaires

**Projet :** Vitalis  
**Lot :** A — réconciliation documentaire et décisions produit  
**Branche cible :** `reconcile/lot-a-2026-11`  
**Statut :** document de travail — décisions à valider progressivement  
**Référence d'audit :** PR #34, vague 10 ; HEAD de départ `b004010f5053b91962e5c30c1089390b23023b6c`

> Cette matrice ne transforme pas une proposition en décision. Les éléments sont explicitement étiquetés **VALIDÉ**, **PROPOSITION** ou **À DÉCIDER**. Aucun développement runtime n'est autorisé par ce document seul.

## 1. Règles de décision

- **VALIDÉ** : choix explicitement confirmé par le produit.
- **PROPOSITION** : recommandation de conception, à confirmer avant implémentation.
- **À DÉCIDER** : question encore ouverte.
- **À VÉRIFIER** : nécessite une preuve dans le dépôt, les tests ou l'environnement.
- V1 doit rester simple, mobile-first, peu coûteuse et sans charge mentale inutile.
- Les fonctionnalités V2/V3 ne doivent pas être introduites indirectement dans le périmètre V1.
- Aucun message libre entre membres. Une conversation membre ne peut exister que dans le contexte d'une action autorisée.
- L'assistant IA Vita, l'assistance humaine et la messagerie entre membres sont trois notions distinctes.

## 2. Cloche — structure commune

| ID | Sujet | État | Décision / proposition | Preuve ou suite |
|---|---|---|---|---|
| COM-01 | Point d'entrée | **VALIDÉ** | Une seule cloche ouvre une fenêtre Communication. | Décision produit déjà exprimée. |
| COM-02 | Parcours contenus dans la fenêtre | **VALIDÉ** | Trois parcours : Notifications, Messages liés aux actions, Communication avec l'assistance. | Décision produit déjà exprimée. |
| COM-03 | Messagerie libre | **VALIDÉ** | Pas de messagerie libre entre membres. | Règle produit explicite. |
| COM-04 | Ouverture d'une conversation membre | **VALIDÉ** | Une conversation est rendue possible dans le cadre d'une action / mise en relation. | Le déclencheur précis reste à définir par type d'action. |
| COM-05 | Libellés visibles | **PROPOSITION** | Utiliser « Notifications », « Messages » et « Assistance » ; préciser dans l'interface que les messages sont liés aux actions, sans alourdir les libellés. | À confirmer. |
| COM-06 | Présentation | **PROPOSITION** | Une fenêtre unique avec trois onglets ou destinations internes clairement séparées ; conserver le contexte lors du changement de parcours. | À confirmer avec la maquette UX. |
| COM-07 | Point d'entrée Vita | **À DÉCIDER** | Déterminer si le bouton flottant Vita reste un raccourci secondaire ou si la cloche devient l'entrée principale unique. Éviter deux parcours concurrents. | Arbitrage UX requis. |
| COM-08 | Compteur non lu | **À DÉCIDER** | Définir si le badge de cloche compte toutes les notifications non lues, seulement les éléments prioritaires, ou une autre règle. | Dépend du modèle de notification. |

## 3. Parcours Notifications

| ID | Sujet | État | Proposition de départ V1 | À préciser / tester |
|---|---|---|---|---|
| NOT-01 | Finalité | **PROPOSITION** | Informer l'utilisateur d'un événement utile lié à son compte ou à une action qu'il a engagée. | Éviter les notifications promotionnelles et redondantes en V1. |
| NOT-02 | Sources | **À DÉCIDER** | Événements issus des moteurs Vitalis et des actions de l'utilisateur uniquement. | Lister les événements V1 autorisés moteur par moteur. |
| NOT-03 | Priorité | **PROPOSITION** | Deux niveaux simples : standard et important ; pas de taxonomie complexe visible. | Définir les critères d'importance. |
| NOT-04 | Lecture | **PROPOSITION** | Chaque élément possède un état lu/non lu ; l'ouverture marque comme lu selon une règle cohérente. | Définir si lecture au clic ou à l'affichage. |
| NOT-05 | Historique | **PROPOSITION** | Historique récent paginé ou chargé progressivement, avec limite de conservation V1. | Définir la durée et le plafond de volume. |
| NOT-06 | Archivage / suppression | **À DÉCIDER** | Ne pas reprendre automatiquement toutes les opérations du contrat API historique. Commencer par le minimum réellement utile. | Choisir archivage, suppression ou aucune action utilisateur en V1. |
| NOT-07 | Canaux | **PROPOSITION** | Centre in-app d'abord ; push seulement si le coût, les permissions et la valeur sont validés. | Pas d'email/SMS récurrent par défaut. |
| NOT-08 | Anti-bruit | **PROPOSITION** | Regrouper les événements similaires et dédupliquer côté serveur avec une clé idempotente. | Définir fenêtres et règles de regroupement. |
| NOT-09 | Préférences | **À DÉCIDER** | Paramètres V1 très limités, uniquement si plusieurs catégories de notifications sont réellement livrées. | Éviter un écran de préférences prématuré. |

### 3.1 Catalogue initial d'événements à notifier — décision validée

**État produit : VALIDÉ le 2026-11-09.** La sélection ci-dessous est validée pour le périmètre fonctionnel des notifications V1. Cette validation ne constitue pas une preuve d'implémentation runtime ni l'autorisation de modifier le code.

| Événement | Décision V1 | Justification |
|---|---|---|
| Une demande ou action de l'utilisateur est acceptée | **VALIDÉ — notifier** | Changement d'état qui appelle une suite de l'utilisateur. |
| Une demande est refusée, annulée ou expire | **À ARBITRER selon l'action** | Informer sans générer plusieurs alertes pour une même transition. |
| Un nouveau message arrive dans une conversation liée à une action | **VALIDÉ — notifier** | Réponse attendue dans un échange autorisé. |
| Une action nécessite une confirmation ou une réponse de l'utilisateur | **VALIDÉ — notifier** | Événement nécessitant une intervention. |
| Un événement de sécurité ou de compte important survient | **VALIDÉ — notifier** | Information sensible à ne pas enfouir. |
| Une simple mise à jour de contenu ou activité passive survient | **VALIDÉ — ne pas notifier par défaut** | Reste consultable dans le moteur ; évite le bruit. |
| Une recommandation ou suggestion non urgente est disponible | **VALIDÉ — ne pas notifier par défaut en V1** | Peut rester dans le moteur, sans notification proactive. |
| Une action est créée ou modifiée par l'utilisateur lui-même | **VALIDÉ — ne pas notifier** | L'utilisateur connaît déjà l'action qu'il vient d'effectuer. |

**Règle validée :** une notification doit correspondre à un changement d'état utile, une réponse attendue ou un événement de sécurité. Une action utilisateur ne doit pas se notifier elle-même. Les transitions multiples d'une même action doivent être dédupliquées et ne pas produire une rafale d'alertes.

## 4. Parcours Messages liés aux actions

| ID | Sujet | État | Proposition de départ V1 | À préciser / tester |
|---|---|---|---|---|
| MSG-01 | Nature | **VALIDÉ** | Conversation membre contextualisée à une action ; jamais une boîte de chat libre. | Décision produit explicite. |
| MSG-02 | Déclenchement | **VALIDÉ** | La conversation est ouverte uniquement après l'acceptation d'une demande ou la confirmation d'une mise en relation autorisée. | Déclencheur précis à décliner par moteur/action ; aucun chat libre ni contact hors contexte. |
| MSG-03 | Contexte obligatoire | **PROPOSITION** | Chaque fil référence l'action source, son type, son identifiant et son état. | Définir le comportement si l'action source est supprimée/expirée. |
| MSG-04 | Participants | **PROPOSITION** | Seuls les participants autorisés par l'action peuvent lire et écrire. | Tests d'isolation et de révocation indispensables. |
| MSG-05 | Fin de conversation | **À DÉCIDER** | Clôture manuelle, clôture liée à la fin de l'action, ou combinaison des deux. | Définir les cas de réouverture. |
| MSG-06 | Blocage / signalement | **PROPOSITION** | Prévoir un mécanisme de sécurité et de signalement accessible depuis le contexte de conversation. | Définir traitement, modération et preuves minimales. |
| MSG-07 | Contenu V1 | **À DÉCIDER** | Le texte est le minimum envisagé ; pièces jointes, médias, accusés de lecture et présence en ligne ne sont pas présumés V1. | Confirmer le périmètre exact. |
| MSG-08 | Conservation | **À DÉCIDER** | Définir durée, suppression et traçabilité en cohérence avec l'action source et les obligations applicables. | Ne pas inventer une durée avant arbitrage. |
| MSG-09 | Notifications de message | **PROPOSITION** | Une notification sobre à la réception, dédupliquée et liée au fil/action. | Définir préférences et cas où l'utilisateur est déjà dans le fil. |
| MSG-10 | Temps réel | **PROPOSITION** | Ne retenir le temps réel que si nécessaire ; sinon rechargement léger / synchronisation à la demande pour contenir les coûts. | Mesurer latence et coûts avant choix technique. |

## 5. Parcours Assistance

| ID | Sujet | État | Proposition de départ V1 | À préciser / tester |
|---|---|---|---|---|
| AST-01 | Parcours | **VALIDÉ** | La cloche propose un accès à la communication avec l'assistance. | Décision produit explicite. |
| AST-02 | Distinction | **VALIDÉ** | Vita (assistant IA) n'est ni une conversation membre ni une assistance humaine. | À préserver dans les libellés et états. |
| AST-03 | Assistant existant | **À VÉRIFIER** | Réutiliser le socle Vita existant après audit de son point d'entrée et de son état de session. | Ne pas dupliquer le moteur ni son historique. |
| AST-04 | Assistance humaine | **À DÉCIDER** | Déterminer si un contact humain est réellement dans le périmètre V1, et sous quelle disponibilité. | Ne pas promettre un support humain non opérationnel. |
| AST-05 | Historique | **À DÉCIDER** | Séparer clairement l'historique Vita de toute demande adressée à une personne de l'équipe. | Modèle de données et confidentialité. |
| AST-06 | Disponibilité / délai | **À DÉCIDER** | Afficher des délais uniquement s'ils sont mesurés et tenus. | Pas de promesse de réponse instantanée non garantie. |

## 6. Moteurs secondaires — cadrage V1/V2/V3

Les niveaux ci-dessous sont des **propositions de cadrage**, pas des engagements de livraison. Les décisions déjà prises sur la navigation et le fonctionnement de Réel restent prioritaires.

| Domaine | État runtime observé en vague 10 | Proposition V1 | Pistes V2/V3 | Décision requise |
|---|---|---|---|---|
| Flash | Partiel : feed, création locale, transitions et intentions de synchronisation. | Stabiliser le parcours essentiel, les règles de visibilité, l'expiration et les actions de contact autorisées. | Médias avancés, filtres enrichis, automatisations. | Définir précisément les actions V1 et leur lien éventuel avec Messages. |
| Scan | Partiel : fonction serveur, hook, classement et abonnement Realtime. | Scan limité, résultat compréhensible, confidentialité de position et contrôle des coûts. | Reconnaissance enrichie et capacités avancées si budget validé. | Définir entrée, résultat, limites d'usage et données conservées. |
| Radar | Logique de domaine partielle ; écran placeholder ; modèle canonique incertain. | Arbitrer d'abord entre Radar personnel (rayon/période/statut) et Radar d'opportunités (save/hide/report). | Recommandations et automatisations enrichies. | **Arbitrage de modèle obligatoire avant UI/runtime.** |
| Veille | Contrat historique ; runtime non démontré dans la passe. | Ne pas lancer de surveillance continue coûteuse. Évaluer une consultation à la demande ou des règles déterministes très bornées. | Déclencheurs proactifs, agrégation et personnalisation. | Définir la valeur utilisateur et les sources V1. |
| Recommendation | Contrat historique ; runtime non démontré dans la passe. | Pas de moteur de recommandation autonome coûteux sans données, règles et budget validés. | Personnalisation progressive et apprentissage si justifié. | Définir critères déterministes V1 ou reporter. |
| Trust | Documentation/index présents ; parcours runtime complet non démontré. | Commencer par transparence, historique vérifiable et règles explicites ; ne pas afficher un score non justifié. | Vérifications et signaux supplémentaires sous gouvernance. | Définir preuves, niveaux, contestation et limites d'affichage. |
| Missions | Contrat historique ; migration SQL mal formée relevée ; runtime non démontré. | Ne pas activer avant clarification du modèle, des transitions et de la chaîne SQL canonique. | Automatisation et scénarios avancés. | Définir la place de Missions en V1 et les dépendances techniques. |

## 7. Décisions transversales à conserver

| ID | Sujet | État | Règle |
|---|---|---|---|
| TRV-01 | Simplicité | **VALIDÉ** | Une action principale claire par écran ; limiter les choix simultanés et les réglages prématurés. |
| TRV-02 | Modernisation | **VALIDÉ** | Comportement moderne et intelligent, mais sans complexifier l'expérience. |
| TRV-03 | Coûts V1 | **VALIDÉ** | Zéro coût récurrent ou quasi nul visé ; quotas, plafonds, pagination, déduplication et traitements à la demande. |
| TRV-04 | Offline | **VALIDÉ** | Préserver les actions en attente et synchroniser au retour du réseau ; définir les conflits par domaine. |
| TRV-05 | Médias | **VALIDÉ** | Médias minimums / non indispensables en V1. |
| TRV-06 | Preuve | **VALIDÉ** | Une décision produit n'est pas une preuve d'implémentation ; une doc n'est pas un test réussi. |
| TRV-07 | Sécurité | **PROPOSITION** | Autorisation serveur systématique, isolation par utilisateur, validation des entrées, limites anti-abus et journalisation proportionnée. |

## 8. Ordre de validation proposé

1. Cloche : valider le libellé et la structure des trois parcours.
2. Notifications : choisir les événements réellement utiles en V1.
3. Messages : définir les actions qui peuvent ouvrir un fil et les règles de fermeture.
4. Assistance : décider si V1 signifie Vita uniquement ou inclut un canal humain.
5. Radar : arbitrer le modèle produit canonique.
6. Flash et Scan : préciser les parcours et limites V1.
7. Veille, Recommendation, Trust et Missions : décider V1, V2 ou V3 sur la base de valeur, dépendances et coût.
8. Transformer les décisions validées en exigences, contrats, données, permissions et tests traçables avant tout développement.

## 9. Journal de validation

| Date | ID / sujet | Décision utilisateur | Référence / preuve |
|---|---|---|---|
| Antérieure au 2026-11-09 | COM-01 à COM-04 | Structure de cloche et absence de messagerie libre validées. | Échanges produit antérieurs, réconciliation vague 10. |
| 2026-11-09 | NOT-10 — Catalogue initial d'événements | Sélection V1 validée : acceptation, nouveau message lié à une action, réponse/confirmation attendue et événement important de sécurité/compte ; refus/annulation/expiration à arbitrer selon l'action ; pas de notification par défaut pour activité passive, recommandation non urgente ou action initiée par l'utilisateur. | Validation explicite de l'utilisateur dans la conversation du 2026-11-09. |
| 2026-11-09 | MSG-02 — Déclenchement d'une conversation | V1 validée : ouverture uniquement après acceptation d'une demande ou confirmation d'une mise en relation autorisée ; le fil reste rattaché à l'action source. | Validation explicite de l'utilisateur dans la conversation du 2026-11-09. |

---
**Règle de mise à jour :** après chaque arbitrage utilisateur, mettre à jour l'état, la décision retenue, les impacts V1/V2/V3 et les tests d'acceptation associés. Ne pas effacer les propositions rejetées : les conserver dans l'historique de décision si elles expliquent un choix d'architecture ou de produit.
