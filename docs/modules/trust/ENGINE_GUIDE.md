# Trust — guide complet du moteur

**Objet :** évaluer et présenter des informations de confiance à partir de preuves validées, explicables et traçables.  
**Attention :** Trust Engine n'est pas synonyme des niveaux de confiance affichés dans le produit.  
**État :** architecture cible consolidée ; implémentation complète à vérifier.

## 1. Mission et périmètre

Trust est l'autorité métier qui reçoit des événements et preuves candidates, décide de leur validité et de leur effet, maintient un historique et produit des vues de confiance destinées aux consommateurs autorisés. Les autres domaines peuvent fournir des preuves, mais ne modifient jamais directement le score, le niveau ou l'historique Trust.

Trust n'est ni une note de popularité, ni un jugement moral, ni une sanction automatique globale. Il doit rester progressif, contextuel, explicable, réversible, auditable et protecteur de la vie privée.

## 2. Parcours complet des preuves

### 2.1 Réception
Une preuve candidate arrive d'un domaine source : identité vérifiée, mission terminée et confirmée, activité pertinente, interaction, validation communautaire ou signalement confirmé. La preuve doit contenir au minimum une référence source, une catégorie, une date, un objet métier, un état de validation et une justification traçable.

Un événement émis par un autre domaine n'est pas encore un fait Trust. Les signalements non confirmés ne sont pas traités comme des faits établis.

### 2.2 Validation et décision
Trust vérifie la source, l'intégrité, la cohérence, la duplication, l'autorité de l'émetteur et l'état de validation. Une preuve invalide ou insuffisante est rejetée ou mise en attente selon une règle explicite. Les règles de calcul sont versionnées, déterministes et testables. Les poids, seuils et facteurs exacts ne sont pas définis par la consolidation actuelle et ne doivent pas être inventés.

### 2.3 Calcul et mise à jour
Après validation, Trust applique la version de règles en vigueur et met à jour le profil interne de confiance. Les facteurs peuvent tenir compte de la nature, de la fiabilité, de la gravité, de l'ancienneté et du contexte de la preuve, mais chaque facteur doit être défini avant mise en production. Les preuves vieillissantes peuvent être reconsidérées selon une politique documentée.

### 2.4 Correction et contestation
Une erreur est corrigée par une nouvelle entrée liée à la preuve d'origine ; l'historique initial n'est pas silencieusement réécrit. Le résultat courant est recalculé. La personne doit disposer d'une explication adaptée et d'un mécanisme de contestation ou de correction proportionné à l'impact. Les détails sensibles de sécurité restent réservés aux rôles autorisés.

### 2.5 Présentation
Trust produit une Trust View : projection autorisée du niveau actuel, badges, progression synthétique et facteurs explicables. L'interface et l'UDI présentent cette vue ; ils ne recalculent pas le Trust. Les données brutes, pondérations internes, signalements sensibles et données d'autres personnes ne sont pas exposés par défaut.

## 3. Modèle de données conceptuel

- **Trust Evidence/Event :** preuve candidate ou validée, provenance, date, objet source, justification, statut et version de validation.
- **Trust Profile :** synthèse interne de la confiance et de son évolution.
- **Trust View :** projection limitée à un consommateur et à un contexte autorisés.
- **Rule Set :** version de règles de calcul et de validation, testée et auditable.
- **Correction/Appeal :** événement de rectification ou contestation relié à la preuve initiale.

Ce modèle décrit la cible métier ; la présence de champs de score dans le schéma ne prouve pas que tout le pipeline est livré.

## 4. Niveaux produit et moteur Trust

Les niveaux visibles côté produit et leur signification fonctionnelle sont définis dans le document produit de référence. Le moteur Trust est le système technique qui évalue les preuves et alimente les vues. Il faut maintenir cette distinction : une règle d'affichage d'un niveau ne constitue pas une preuve du calcul ni de son implémentation.

## 5. Sécurité et gouvernance

Aucun client ne peut écrire directement un Trust Score ou un niveau dérivé. Les changements passent par les mécanismes autorisés du domaine Trust. La lecture est limitée au propriétaire, aux consommateurs explicitement autorisés et aux rôles d'administration prévus. Les poids, motifs sensibles et décisions de modération sont gouvernés, versionnés, testés et auditables.

## 6. Consommateurs et producteurs

Les domaines métier peuvent produire des événements ou preuves. Trust seul valide et décide de leur effet. Trust publie ensuite des vues et événements de changement. Les systèmes de présentation agrègent uniquement les vues permises. Cette circulation ne donne pas aux producteurs la propriété du profil Trust.

## 7. API, architecture et état observé

Le contrat API canonique est documenté dans `docs/api/trust-api.md`. Les sources historiques proposent des endpoints et événements, mais ceux-ci ne prouvent pas qu'ils sont actifs. La migration `20260912000000_protect_identity_trust_system_fields.sql` protège certains champs système, borne `profiles.trust_score` entre 0 et 100 et limite les valeurs `udi.level` à `guest`, `identified`, `verified` et `trusted`. Cela confirme des contraintes de schéma, pas le pipeline complet de preuves, calcul, historique, recalcul, contestation et API.

## 8. Critères de validation

Tester l'authenticité et la provenance des preuves, l'idempotence, les preuves non confirmées, les règles versionnées, le recalcul, le vieillissement, les corrections, les contestations, l'audit, l'isolation, les projections par contexte et l'impossibilité d'écrire le score directement depuis un client.

## 9. Sources conservées

Les spécifications historiques Trust Engine et le contrat API ancien sont conservés pour la traçabilité. Ce guide constitue le point d'entrée autonome du moteur ; les niveaux produit, l'architecture et le contrat API ne doivent pas être confondus.