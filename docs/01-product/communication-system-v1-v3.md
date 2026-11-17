# Système de communication humaine Vitalis — V1 à V3

**Statut :** spécification produit de référence.  
**Périmètre :** accueil, retours, expressions courtes, messages prédéfinis, confirmations, erreurs, notifications, suggestions et dialogues.  
**Nature :** documentation uniquement ; ce document ne certifie pas l'implémentation actuelle.

## 1. Décision produit

Vitalis doit disposer d'un système central de communication humaine partagé par l'application et ses moteurs. Les textes, expressions simples et messages prédéfinis sont sélectionnés et servis par ce système selon des règles explicites ; les composants d'écran ne choisissent pas chacun leurs propres formulations.

La V1 repose sur une approche hybride et déterministe :
1. catalogue local de messages rédigés à l'avance ;
2. règles de contexte et de priorité ;
3. personnalisation limitée aux informations réellement disponibles et autorisées ;
4. gestion de fréquence et anti-répétition ;
5. validation du message avant affichage.

**Aucun modèle IA distant ne compose les communications standard en V1.** L'intelligence de V1 vient de la sélection contextuelle de contenus prédéfinis, pas d'une génération libre.

## 2. Personnalité, fréquence et prénom

La personnalité de Vitalis est celle d'un **compagnon attentionné** : chaleureux, amical, naturel, direct et respectueux. Vitalis accompagne sans s'imposer et ne prétend pas être une personne humaine.

La fréquence est équilibrée : accueillir lors d'une première ouverture ou d'un retour pertinent, accompagner lorsqu'une action le nécessite, signaler une information réellement utile et préférer le silence à une salutation répétitive.

Le nom d'affichage disponible (qui peut être un prénom ou un nom choisi) est utilisé de façon **occasionnelle et naturelle**, jamais systématiquement :
- approprié pour un accueil, un retour pertinent ou un accompagnement personnel ;
- facultatif si cela rend une phrase plus humaine ;
- généralement inutile dans les libellés, erreurs techniques et notifications répétitives ;
- jamais répété dans plusieurs messages rapprochés.

Le nom d'affichage doit déjà être disponible dans un contexte autorisé ; ne pas extraire arbitrairement un prénom d'un nom complet. Aucune lecture réseau supplémentaire ne doit être déclenchée uniquement pour le récupérer.

## 3. Contextes autorisés

Le système peut exploiter uniquement les signaux nécessaires et déjà disponibles : heure locale et fuseau, langue active, prénom disponible, mode invité ou compte, écran/moteur actif, état réel d'une action et préférences explicitement enregistrées.

Il ne déduit jamais l'humeur, l'intention, la situation familiale, les habitudes ou la disponibilité d'une personne à partir de signaux indirects. Une donnée absente conduit à une formulation neutre, jamais à une requête réseau dédiée.

## 4. Périodes de la journée

Base éditoriale initiale, configurable et à évaluer avec les usages réels :

| Période | Plage locale indicative |
|---|---:|
| Très tard dans la nuit | 00:00–03:00 |
| Tôt le matin | 03:00–05:00 |
| Le matin | 05:00–08:00 |
| En matinée | 08:00–11:00 |
| Milieu de journée | 11:00–14:00 |
| Après-midi | 14:00–17:00 |
| Fin de journée | 17:00–19:00 |
| Soirée | 19:00–22:00 |
| Nuit | 22:00–00:00 |

Ces plages ne sont pas des vérités universelles. Le système utilise l'heure locale du terminal ; si l'heure ou le fuseau est indisponible, il choisit un message neutre. Une salutation temporelle n'est jamais obligatoire à chaque ouverture.

## 5. Modes invité et compte

### Invité
- Accueil contextuel à partir de la langue, de l'heure et de l'écran.
- Prénom utilisable uniquement s'il a été fourni pour la session et si son usage est permis.
- Aucun historique persistant de communication.
- État anti-répétition limité à la session et supprimé à sa fin.
- Aucun identifiant temporaire d'invité dans les événements, journaux ou métadonnées.
- Aucun droit membre ne peut être suggéré ou attribué par un message.

### Compte connecté
- Prénom déjà présent dans le contexte chargé.
- Préférences explicites et signaux récents autorisés, si disponibles.
- Réutilisation du profil et des mécanismes existants ; aucun historique parallèle des salutations.
- La communication ne modifie jamais les permissions ou droits métier.

## 6. Responsabilités du système

1. Résoudre le contexte minimal : langue, heure, mode, écran et état métier autorisé.
2. Identifier l'intention : accueil, retour, aide, confirmation, notification, suggestion, erreur ou état.
3. Sélectionner une variante dans le catalogue local.
4. Personnaliser uniquement avec les variables disponibles et autorisées.
5. Appliquer les priorités et la fréquence.
6. Valider la langue, les variables, l'exactitude et les droits d'affichage.
7. Fournir un message structuré à l'interface appelante.

Le domaine métier reste propriétaire de la vérité de l'événement et de son statut. Le système de communication décide comment l'annoncer, pas si l'événement a eu lieu.

L'état de compte (invité ou membre connecté) est distinct du niveau de confiance (identifié, vérifié ou de confiance). Une session authentifiée peut être présentée comme « Membre » sans attribuer automatiquement un niveau de confiance. Le système de communication ne calcule ni ne modifie ce niveau.

## 7. Priorités

Ordre de priorité :
1. sécurité, confidentialité et information critique ;
2. résultat réel d'une action ou confirmation nécessaire ;
3. demande d'action métier et notification importante ;
4. progression, attente, erreur récupérable et reprise ;
5. suggestion utile liée au contexte ;
6. accueil et salutation ;
7. expression décorative ou encouragement.

Une communication secondaire ne masque jamais une erreur ou une confirmation importante.

## 8. Anti-répétition et vérité des messages

- Ne pas répéter la même salutation à chaque navigation ou re-rendu.
- Ne pas envoyer plusieurs messages spontanés pour le même événement.
- Dédupliquer à partir d'un identifiant métier stable lorsqu'il existe.
- Ne fabriquer aucun événement, compteur ou présence.
- Ne pas transformer une suggestion en urgence artificielle.
- Respecter les préférences et permissions de notification.
- Ne conserver aucun historique serveur des salutations de routine.
- Si l'utilité du message n'est pas établie, ne rien afficher.

Distinguer strictement les états : proposé, en cours, enregistré localement, envoyé, reçu par le service, confirmé, échoué et en attente de reprise. « C'est fait ! » n'est permis qu'après confirmation effective.

## 9. Feuille de route V1 / V2 / V3

| Capacité | V1 — gratuite et déterministe | V2 — adaptation avancée | V3 — assistant personnel |
|---|---|---|---|
| Messages prédéfinis | Catalogue local FR/EN | Enrichissement et variantes | Bibliothèque enrichie |
| Expressions courtes | Sélection contextuelle | Dialogues plus souples | Expressions adaptées à la conversation |
| Salutations temporelles | Règles locales configurables | Préférences horaires facultatives | Adaptation plus fine et contrôlée |
| Prénom | Occasionnel, déjà disponible | Préférences personnalisables | Usage conversationnel contrôlé |
| Contexte | Heure, langue, mode, écran, état métier | Préférences et contexte autorisés plus riches | Contexte conversationnel autorisé |
| Suggestions | Règles simples et données réelles | Plus personnalisées | Dialoguées et coordonnées |
| Dialogue | Boîtes courtes à choix prédéfinis | Compréhension naturelle facultative | Conversation approfondie facultative |
| Génération IA | Aucune pour les communications standard | Optionnelle, désactivable et budgétée | Assistant optionnel, gouvernance renforcée |
| Voix | Aucune génération conversationnelle | Expérimentation ciblée si budget validé | Interaction vocale facultative |
| Historique de routine | Aucun historique serveur | Données minimisées | Rétention limitée et explicite si nécessaire |
| Coût variable par message | Aucun appel externe ni requête dédiée | Quotas et suivi obligatoires si IA activée | Budget par compte/session et arrêt automatique |

Le passage à une version future n'autorise pas automatiquement l'activation d'une IA, d'un fournisseur ou d'une dépense. Toute capacité payante exige une décision distincte.

## 10. Critères d'acceptation V1

- [ ] Point d'entrée central pour les messages prédéfinis et expressions communes.
- [ ] Textes visibles issus du catalogue i18n, pas de chaînes improvisées dans les composants.
- [ ] Sélection déterministe, testable et indépendante d'un fournisseur IA.
- [ ] Langue, heure locale, mode et contexte métier avec fallbacks.
- [ ] Prénom occasionnel, sans lecture réseau supplémentaire.
- [ ] Frontières invité/membre respectées.
- [ ] Messages exacts par rapport à l'état réel des actions.
- [ ] Priorités et anti-répétition appliquées.
- [ ] Aucune table, migration ou requête serveur ajoutée pour les salutations.
- [ ] Aucune dépense IA, API externe ou crédit par message en V1.
- [ ] Tests des langues, périodes, modes, priorités, répétitions et erreurs.
- [ ] Les moteurs adoptent le système sans lui déléguer leur logique métier.

## 11. Points à vérifier avant production

Les textes définitifs, les plages horaires, la fréquence exacte, les événements disponibles et les interfaces techniques doivent être confrontés au dépôt et aux usages. Les noms de modules et d'événements proposés dans la documentation ne sont pas réputés exister tant qu'ils n'ont pas été vérifiés.

## Références

- [Langage humain et communication Vitalis](./communication-language.md)
- [Centre de communication — règles produit V1](./communication-center-v1.md)
- [Catalogue de communication V1](./communication-catalog-v1.md)
- [Architecture du système de communication](../02-architecture/communication-system-architecture.md)
- [Vitalis Experience System](./experience-system.md)
