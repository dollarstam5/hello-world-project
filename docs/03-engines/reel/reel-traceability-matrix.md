# Réel — matrice de traçabilité V1

**Statut du document :** consolidation des décisions fonctionnelles connues.  
**Règle de preuve :** une décision validée n'est pas une preuve d'implémentation. Les statuts techniques et les tests doivent être vérifiés séparément.

## 1. Statuts utilisés

| Statut | Signification |
| --- | --- |
| VALIDÉE | Décision fonctionnelle approuvée |
| À SPÉCIFIER | Détail technique ou règle secondaire non confirmé |
| À TESTER | Test attendu identifié, exécution ou preuve à fournir |
| NON VÉRIFIÉ | Aucun élément du dépôt ne prouve le comportement |
| OUVERT | Décision ou raccordement encore incomplet |

## 2. Décisions A et B

| Décision | Contenu retenu | Statut | Traçabilité |
| --- | --- | --- | --- |
| A | Option de parcours antérieure non retenue au profit du parcours B. Le libellé et le détail complets de cette variante doivent rester rattachés à leur compte rendu source ; ils ne sont pas reconstitués ici. | NON RETENUE | Aucun comportement ne doit être implémenté à partir d'une supposition sur A. |
| B | Parcours de contact rapide par bip depuis une petite carte de profil. Le destinataire peut accepter directement ou consulter le profil avant de répondre. Les bips reçus sont accessibles depuis un compteur et une feuille de liste avec avatar et courte description. Ce choix évite un long parcours de mise en relation. | VALIDÉE | Le bip ne contient pas de message libre. L'acceptation crée une mise en relation unique. Implémentation et tests : NON VÉRIFIÉS. |

## 3. Décisions C — expérience et interactions

### C-01 — aperçu d'une personne

| Point | Décision fonctionnelle | Statut |
| --- | --- | --- |
| C-01 | Afficher les informations utiles à la décision : nom, photo ou avatar, intention actuelle et distance approximative. L'âge, une courte présentation et les centres d'intérêt sont facultatifs. Le téléphone et la position exacte restent privés. Le contact direct n'est pas possible avant acceptation. | VALIDÉE |
| C-01 — libellé d'action | Le libellé ancien « Ça m'intéresse » ne doit pas être repris comme action principale ; le parcours B utilise un bip. | REMPLACÉ |

### C-02 — bip et mise en relation

| Point | Décision fonctionnelle | Statut |
| --- | --- | --- |
| C-02 | Un bip est une demande courte, sans texte libre. Le destinataire peut accepter ou refuser. Une seule demande en attente est conservée par paire et son retrait est possible. Les bips en attente, envoyés ou reçus, sont conservés pendant 24 h après la fermeture de la présence. Les bips reçus restent accessibles uniquement dans Réel, jamais dans Notifications. Ils expirent ensuite, sans historique permanent des bips non acceptés. Le point de départ exact des 24 h reste à spécifier. | VALIDÉE |
| C-02 — acceptation | L'acceptation crée une mise en relation unique et durable. Le bip accepté quitte les bips reçus ; l'acceptation est signalée à son auteur. Les compteurs ne doivent pas compter deux fois le même événement. | VALIDÉE |
| C-02 — fin de relation | La fermeture par l'une des deux personnes ferme la relation pour les deux, désactive la communication associée, demande confirmation et informe l'autre personne. | VALIDÉE |
| C-02 — trace | Seule une trace technique minimale de l'événement (date, état, événement) est conservée pour cette fermeture ; aucun historique de conversation n'est créé par cette action. | VALIDÉE |

### C-03 — conversation liée à une mise en relation

| Point | Décision fonctionnelle | Statut |
| --- | --- | --- |
| C-03.1 | La conversation est créée automatiquement après acceptation de la mise en relation. | VALIDÉE |
| C-03.2 | Les deux personnes peuvent écrire immédiatement après l'ouverture de la conversation. | VALIDÉE |
| C-03.3 | Texte uniquement : pas de média ni d'appel en V1. | VALIDÉE |
| C-03.4 | Le partage de zone est volontaire et ponctuel ; il ne révèle jamais le GPS exact et ne crée aucun suivi continu. | VALIDÉE |
| C-03.5 | Notifications internes et notifications push si elles sont autorisées. | VALIDÉE |
| C-03.6 | Les états envoyé, reçu et lu sont distingués. | VALIDÉE |
| C-03.7 | Un message n'est pas modifiable. Son auteur peut le retirer de son propre affichage ; la copie du destinataire reste visible. | VALIDÉE |
| C-03.8 | Limite de 1 000 caractères par message. | VALIDÉE |
| C-03.9 | Le signalement est accessible depuis la conversation. | VALIDÉE |

### C-04 — fin et accès à la conversation

| Point | Décision fonctionnelle | Statut |
| --- | --- | --- |
| C-04.1 | Après la fin de la relation, la conversation reste accessible en lecture seule aux deux personnes. Les anciens messages sont conservés, l'envoi est désactivé et un message informatif explique la situation. Aucun nouveau contact ne peut être initié depuis cette ancienne conversation. | VALIDÉE |
| C-04.2 | La fin de relation exige une confirmation explicite et est définitive ; la relation ne peut pas être réactivée depuis cette conversation. | VALIDÉE |
| C-04.3 | Une formulation de message de confirmation a été proposée, mais son libellé exact n'est pas attesté comme validé. | À SPÉCIFIER |
| C-04.4–C-04.5 | Le détail des décisions n'est pas reproduit dans les éléments récupérés. Ne pas compléter par déduction. | OUVERT |

## 4. Décisions P — confidentialité et conservation

| Décision | Règle | Statut |
| --- | --- | --- |
| P-01 | Une conversation fermée affiche exactement : « Cette conversation n'est plus disponible pour l'envoi de messages. » | VALIDÉE |
| P-02 | La personne peut partager volontairement et ponctuellement une zone approximative, jamais son GPS exact ni un suivi de déplacement. | VALIDÉE |
| P-03 | Masquer un message le retire uniquement de l'affichage de son auteur ; la copie du destinataire est conservée. | VALIDÉE |
| P-04 | À expiration, la présence disparaît de Réel et du profil, sans historique utilisateur des anciennes présences. Une conservation technique séparée peut subsister selon une durée documentée. | VALIDÉE |

**Distinctions importantes :** les bips non acceptés expirent après 24 h et ne disposent pas d'historique permanent. Les mises en relation acceptées sont durables. Le mode invité ne conserve pas les données personnelles de session après la fin de celle-ci ; l'historique d'un compte Vitalis suit des règles de conservation distinctes. La décision d'archivage DEC-046 prévoit six mois de conservation après archivage, puis une suppression définitive, avec suppression de l'historique possible à la demande et sans export. La portée exacte de cet archivage (conversations, relations ou autres éléments) doit être reliée au document source avant implémentation ; elle ne doit pas être appliquée aux bips non acceptés.

## 5. Exigences et tests associés

Les identifiants ci-dessous proviennent des repères de traçabilité déjà établis. Ils indiquent des tests attendus, pas des tests dont l'exécution est prouvée.

| Décision / exigence | Tests associés | État de preuve |
| --- | --- | --- |
| C-02 — bip non accepté visible 24 h dans Réel seulement, expiration ensuite et réconciliation sans doublon au retour du réseau | Identifiant de test à attribuer après spécification du point de départ des 24 h | À SPÉCIFIER / À TESTER |
| C-03.4 — partage de zone volontaire et ponctuel | C03-T04 à C03-T07 | À TESTER |
| C-03.7 — retrait local d'un message | C03-T13 à C03-T15 | À TESTER |
| C-04.1 — conversation en lecture seule après fermeture | C04-T01 à C04-T03 | À TESTER |
| C-04.3 — libellé de confirmation | C04-T06 à C04-T09 | À SPÉCIFIER puis À TESTER |
| P-01 — blocage de l'envoi après fermeture | P01-T01 à P01-T02 | À TESTER |
| P-02 — zone approximative, consentie et ponctuelle | P02-T01 à P02-T03 | À TESTER |
| P-03 — masquage local uniquement | P03-T01 à P03-T04 | À TESTER |
| P-04 — expiration et séparation des historiques | P04-T01 à P04-T04 | À TESTER |

Le point de départ exact du délai de 24 h reste ouvert. Les événements en attente doivent être conservés puis réconciliés sans doublon au retour du réseau.

Les exigences techniques T-01 à T-09 restent des éléments de spécification ouverts. Aucun identifiant de test supplémentaire n'est créé ici pour A, B, C-01 ou C-02 : il doit être relié à une source existante avant d'être ajouté.

## 6. Confrontation au dépôt actuel

| Élément observé | Constat | Conclusion |
| --- | --- | --- |
| `src/lib/experience/presence.ts` | Le module publie et écoute toujours un événement dans un bus en mémoire sur le processus courant. | Ce n'est pas encore le transport temps réel multi-appareils. |
| `src/routes/reel.tsx` | La page présente les sections Présence, Bips reçus, Mises en relation et Historique comme indisponibles. | L'interface n'affiche pas de présence ni de relation fictive. |
| Migration `supabase/migrations/20261110010000_reel_presence_and_bips.sql` | Ajoute les tables de présence, bips et relations, des RPC contrôlées, des règles RLS et une publication Postgres Changes conditionnelle. | Socle SQL ajouté ; application sur une base de test et exécution des tests pgTAP encore à prouver. |
| Conversations | Le centre de communication possède des états vides ; aucune conversation Réel réelle n'est produite par le module de présence actuel. | C-03 et C-04 ne sont pas attestées par le runtime actuel. |
| Découverte géographique | La première version filtre sur une clé de zone opaque commune ; le rayon métrique est enregistré mais aucun calcul de distance n'est effectué. | Ne pas afficher de distance ni annoncer un filtrage exact par rayon avant l'algorithme spatial et ses tests. |
| Commandes de bip | Les RPC de création, acceptation, refus et retrait sont ajoutées ; l'acceptation crée une relation unique et le même identifiant client permet de rejouer une demande. | Le raccordement de l'outbox locale et les tests de reprise réseau restent à réaliser. |

## 7. Conditions avant activation du parcours Réel

1. Vérifier la migration dans la chaîne standard, l'appliquer sur une base de test et exécuter le test pgTAP 130 ainsi que les tests RLS existants.
2. Raccorder Supabase Realtime côté client, avec autorisations, reprise après reconnexion et nettoyage des abonnements.
3. Définir et tester la précision de la clé de zone et le calcul réel du rayon ; aucun GPS exact ne doit être stocké ou diffusé.
4. Raccorder les commandes de présence et de bip à l'interface, à l'outbox locale et à la réconciliation idempotente après coupure réseau.
5. Vérifier le parcours invité sur une session anonyme réelle.
6. Créer la conversation liée à l'acceptation, puis implémenter la fermeture de relation et la lecture seule après fermeture.
7. Relier chaque test attendu ci-dessus à un test automatisé ou à une preuve reproductible sur appareil.

Le socle SQL est ajouté, mais aucune de ces conditions d'activation utilisateur n'est déclarée satisfaite sans exécution et preuve.
