# Architecture du système de communication Vitalis

**Statut :** architecture cible V1 à confronter au code existant avant implémentation.  
**Principe :** local-first, déterministe, sans coût variable par message en V1.  
**Limite :** les responsabilités décrites ici ne prouvent pas que des modules équivalents existent déjà dans le dépôt.

## 1. Objectif

Centraliser la sélection et la validation des messages prédéfinis, expressions simples et communications contextuelles, sans centraliser la logique métier des moteurs.

Le système reçoit un contexte minimal et une intention ou un événement métier déjà établi, sélectionne une entrée du catalogue, puis remet un résultat structuré à l'interface.

Il ne doit pas devenir un second système de notifications, une messagerie, un historique de conversation, un moteur de décision métier ou un assistant IA distant en V1.

## 2. Chaîne logique cible

Écran ou domaine métier → intention/événement vérifié → résolution du contexte minimal → sélection du catalogue local → priorité et fréquence → validation → message structuré → présentation UI.

| Responsabilité | Entrée | Résultat |
|---|---|---|
| Context Resolver | Langue, heure, mode, écran, état autorisé | Contexte minimal |
| Intent Resolver | Intention ou événement métier | Catégorie de communication |
| Catalog Selector | Clé, langue, variantes locales | Texte candidat |
| Personalization | Prénom ou variable déjà disponible | Texte personnalisé |
| Priority Manager | Priorité et visibilité actuelle | Décision d'affichage |
| Frequency Manager | Session et événements stables | Afficher ou ignorer |
| Message Validator | Variables, langue, état réel | Message validé ou rejeté |
| Presentation Adapter | Message validé | Contrat consommable par l'UI |

Ces responsabilités peuvent être regroupées dans peu de modules. Ne pas créer une architecture surdimensionnée ni un service distant pour une fonction locale.

## 3. Frontières de responsabilité

- Le domaine métier décide si un bip, une mission, une relation ou une action a réellement atteint son état.
- Le système de communication décide comment l'annoncer, dans quelle langue et à quel moment.
- Le centre de communication conserve ses responsabilités d'organisation des notifications, de l'assistant, des messages et des événements En direct.
- Les composants UI affichent le message et gèrent l'interaction ; ils ne choisissent pas arbitrairement le texte.
- Le système i18n existant reste la source de localisation s'il répond au besoin. Ne pas créer un deuxième moteur de traduction.

## 4. V1 : local-first et sans coût variable par message

La V1 ne doit nécessiter :
- aucun appel à une API de génération de texte ou à un fournisseur IA ;
- aucun appel serveur dédié à une salutation ou expression ;
- aucune nouvelle table Supabase ou migration pour stocker les salutations ;
- aucune requête profil uniquement pour récupérer un prénom ;
- aucun stockage serveur de l'historique des messages de routine.

Le coût marginal des messages standards doit être nul en appels externes et requêtes dédiées. Le système utilise les ressources locales déjà disponibles dans l'application. Cela ne signifie pas que l'hébergement global de l'application n'a aucun coût.

Ordre de préférence pour le contexte :
1. données déjà présentes dans l'état applicatif ;
2. session et profil déjà chargés selon les règles de sécurité ;
3. contexte local de l'écran ou du domaine ;
4. heure et langue du terminal.

En cas de donnée manquante, utiliser une variante neutre. Ne jamais déclencher une requête réseau pour compléter un message non essentiel.

Stockage :
- catalogue dans le bundle local ou le mécanisme i18n existant ;
- règles versionnées dans le code/configuration locale ;
- anti-répétition en mémoire locale limitée ;
- invité : aucune persistance inter-session, effacement à la fin de session ;
- membre : aucune création d'historique parallèle ; préférences futures à raccorder au profil existant après validation.

## 5. Contrat conceptuel du message

Le message remis à l'interface devrait contenir une clé stable, une catégorie, une priorité, le texte localisé résolu, une action ou destination facultative fournie par le domaine, une règle de présentation et un identifiant d'événement métier stable lorsqu'il existe.

Ne jamais inclure de coordonnées précises, identifiants temporaires invités, secrets, jetons d'authentification, contenu de conversation ou données sensibles non nécessaires.

Le contrat TypeScript définitif doit suivre les conventions de types, schémas et validation du dépôt. Ce document ne fournit pas un code prêt à copier.

## 6. Événements et raccordement aux domaines

Les exemples ci-dessous sont des intentions à vérifier, pas un contrat runtime existant :

| Intention | Domaine pressenti | Vérification nécessaire |
|---|---|---|
| Application ouverte / retour | App et session | Point d'entrée et cycle de navigation réels |
| Mission créée / mise à jour | Missions | Événements et statuts déjà existants |
| Bip reçu | En direct | Canal temps réel et événement confirmé |
| Relation établie / clôturée | En direct | Transition métier et participants |
| Scan terminé | Scan | Résultat réel, pas état d'interface supposé |
| Permission refusée | Plateforme | Distinguer refus, indisponibilité et permission non demandée |
| Réseau perdu / retrouvé | Plateforme et synchronisation | Réutiliser les états de connectivité centralisés |

Aucun événement ne doit être émis uniquement pour provoquer un message. Dédupliquer avec les identifiants stables du domaine. Ne jamais exposer les identifiants de session invités.

## 7. Temps, langue et fallback

Utiliser l'heure locale et le fuseau disponibles sur le terminal. Les périodes sont configurables et désactivables. Une heure ou un fuseau indisponible conduit à une formulation neutre. La langue active de l'application est prioritaire ; utiliser le fallback i18n existant. Ne jamais mélanger des fragments FR et EN dans une phrase ni déduire les habitudes de vie à partir de l'heure.

## 8. Priorité et fréquence

Le système garantit que les erreurs et confirmations métier importantes ne sont pas masquées par des salutations ou suggestions.

Il empêche les répétitions sur les re-rendus et changements de route sans nouvelle intention, déduplique les événements, évite les rafales, respecte les préférences et permissions, et laisse l'écran silencieux lorsqu'aucun message n'apporte de valeur.

Les fenêtres temporelles exactes doivent être déterminées par tests UX ; ne pas fixer des délais arbitraires sans mesure.

## 9. Sécurité et confidentialité

- Les messages ne confèrent aucun droit et ne remplacent ni authentification, ni contrôles métier, ni RLS.
- Le prénom est une donnée de présentation, pas une preuve d'identité.
- Les métadonnées modifiables par l'utilisateur ne servent jamais à l'autorisation.
- Aucun identifiant temporaire invité dans les événements de communication.
- Aucun contexte de profil ou de navigation envoyé à un fournisseur tiers en V1.
- Aucun journal du contenu des salutations de routine.
- Les notifications métier suivent les règles de confidentialité du domaine propriétaire.
- Les erreurs n'exposent jamais les secrets ni détails internes.

## 10. Évolution V2 et V3

### V2 — adaptation plus riche
Peut introduire des préférences explicites de ton/fréquence/périodes, des dialogues contextuels et une compréhension naturelle facultative. Une génération IA éventuelle exige une décision dédiée, limites, quotas, consentement, contrôle des données, suivi budgétaire et fallback local. Les confirmations, erreurs, permissions et statuts critiques restent déterministes.

### V3 — assistant personnel facultatif
Peut introduire conversation approfondie, interaction vocale et contexte plus continu, avec contrôles de confidentialité et coordination entre moteurs. Ces capacités restent désactivables et budgétées. Le mode invité ne devient pas un profil persistant par défaut.

## 11. Observabilité et maîtrise des coûts

En V1 : pas de télémétrie contenant le contenu des salutations, pas d'appel serveur par message, pas de dépendance à une clé fournisseur. Les métriques agrégées ne sont autorisées que si un mécanisme existant et conforme est disponible.

En V2/V3, si une génération distante est approuvée : quota par compte/session, budget maximal, limite de longueur et fréquence, cache si sûr, fallback local, coupe-circuit et suivi des coûts. Aucune activation par défaut sans décision explicite.

## 12. Vérification technique avant codage

1. Identifier les catalogues i18n et conventions de messages existants.
2. Identifier les composants globaux d'accueil, expérience, erreur et notification.
3. Inventorier les événements métier réels.
4. Vérifier la représentation du mode invité et de la session membre.
5. Vérifier la source réelle du prénom et la disponibilité heure/langue.
6. Définir un contrat compatible avec les couches architecturales existantes.
7. Définir les tests sans ajouter de stockage serveur.
8. Mesurer bundle et performance ; éviter une dépendance supplémentaire si les primitives existantes suffisent.

## 13. Tests d'acceptation

- sélection déterministe, FR/EN et fallback ;
- limites des périodes horaires, fuseau manquant et changement d'heure ;
- invité/membre, prénom présent/absent/non autorisé ;
- priorités, concurrence, répétition et déduplication ;
- distinction local/envoyé/confirmé ;
- erreur et reprise hors ligne ;
- absence d'appel réseau pour une salutation ;
- absence d'historique serveur et d'identifiant invité dans les payloads ;
- taille du bundle et performance mobile.

## Références

- [Système de communication humaine V1 à V3](../01-product/communication-system-v1-v3.md)
- [Catalogue de communication V1](../01-product/communication-catalog-v1.md)
- [Architecture front-end et expérience](./frontend-experience.md)
- [Architecture IA et intégrations](./ai-architecture-integrations.md)
- [Centre de communication — règles produit V1](../01-product/communication-center-v1.md)
