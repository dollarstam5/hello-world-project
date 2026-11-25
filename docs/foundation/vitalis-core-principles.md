# Principes fondamentaux de Vitalis

**Statut : décision produit transversale validée — priorité P0 / obligatoire**  
**Portée : tous les moteurs, toutes les interfaces et tous les parcours Vitalis**  
**Application : V1 et versions suivantes**

## 1. Principe prioritaire : accompagner plutôt que bloquer

**Vitalis doit aider la personne à avancer avec les informations qu'elle possède déjà. Une demande ne doit jamais être refusée uniquement parce que son contenu est incomplet lorsque l'action peut être exécutée de manière sûre et utile.**

Lorsqu'une personne fournit des informations partielles, Vitalis doit, dans cet ordre :

1. Comprendre l'intention et identifier l'action demandée.
2. Distinguer les éléments indispensables à l'exécution des informations simplement utiles.
3. Exécuter l'action avec les informations disponibles dès que le minimum réellement nécessaire est présent.
4. Enregistrer ou traiter le contenu conformément aux règles du moteur et à son cycle de vie.
5. Expliquer avec des mots simples les limites éventuelles du résultat.
6. Proposer, après ou pendant l'action sans la bloquer, des compléments facultatifs qui peuvent améliorer la visibilité, la productivité, la précision ou la pertinence.
7. Laisser la personne choisir d'ajouter ces éléments maintenant ou plus tard.

**Règle de décision : information facultative manquante = poursuivre et proposer une amélioration ; information indispensable manquante = demander uniquement cette information, en préservant tout ce qui peut déjà être conservé ou préparé.**

## 2. Priorité et portée

Cette règle est un principe produit de niveau fondamental. Elle s'applique à tous les moteurs Vitalis, sans exception de domaine :

- **Flash** : un Flash suffisamment renseigné pour être créé ou publié est traité avec les éléments disponibles. Les compléments facultatifs sont proposés pour améliorer sa visibilité et son utilité.
- **Scan** : une recherche exploitable est lancée même si certains critères sont inconnus. Les résultats présentent honnêtement leurs limites et proposent des précisions facultatives.
- **Réel** : une présence peut démarrer avec les informations minimales autorisées. Les informations de profil facultatives peuvent être enrichies ensuite.
- **Radar** : une recherche ou une veille est préparée et enregistrée dès que son minimum nécessaire est disponible. Les critères supplémentaires servent à améliorer les correspondances.

La même règle s'applique aux parcours communs, aux formulaires, aux dialogues, aux assistants, aux notifications et aux évolutions futures.

## 3. Garde-fous non négociables

Ce principe ne permet jamais de contourner :

- les contrôles d'identité, de session, de propriété et d'autorisation ;
- les consentements explicites, notamment pour la localisation, la présence, la visibilité et les communications ;
- les exigences légales, la sécurité des personnes et la prévention des abus ;
- les validations indispensables à l'intégrité des données ou à l'exécution correcte d'une action ;
- les quotas, les limites du moteur, les règles de modération et les protections serveur/RLS.

Une information n'est « indispensable » que si son absence empêche réellement l'action ou rend son exécution dangereuse, non autorisée ou incohérente. Une préférence, un détail de présentation ou un critère d'amélioration ne doit pas être transformé en condition bloquante.

Les droits d'un visiteur, d'un invité et d'un membre restent distincts. Un contenu partiel n'accorde aucun droit supplémentaire et ne transforme pas une session invitée en session membre.

## 4. Expérience attendue

- Ne pas culpabiliser la personne et ne pas présenter ses informations comme un formulaire mal rempli.
- Ne pas imposer une longue liste de champs avant de montrer une première valeur utile.
- Ne pas inventer les informations manquantes ni présenter une estimation comme un fait.
- Distinguer clairement ce qui a été exécuté, ce qui reste inconnu et ce qui pourrait être amélioré.
- Formuler les suggestions comme des possibilités facultatives, concrètes et adaptées au contexte.
- Ne pas répéter une suggestion que la personne a déjà refusée ou différée, sauf changement pertinent du contexte.

**Formule directrice : Vitalis accompagne la progression de l'utilisateur au lieu de sanctionner ses oublis.**

## 5. Critères de conformité obligatoires

Un parcours conforme doit démontrer que :

1. Les informations minimales nécessaires sont identifiées et justifiées.
2. Les champs facultatifs ne bloquent pas l'action.
3. L'action est réellement exécutée et son résultat est clairement confirmé.
4. Les compléments sont proposés de façon facultative et contextuelle.
5. Une donnée inconnue n'est jamais inventée.
6. Les contrôles de sécurité, de consentement et de droits restent appliqués.
7. Les tests couvrent les demandes complètes, partielles, minimales et réellement inexécutables.

Toute nouvelle fonctionnalité ou correction d'un moteur doit vérifier cette règle avant validation. Une implémentation qui rejette une demande exploitable uniquement pour des informations facultatives manquantes est non conforme et doit être corrigée.

## 6. Références d'application

- [Matrice centrale des droits et décisions](../02-architecture/vitalis-engine-decision-matrix.md)
- [Documentation des moteurs métier](../03-engines/README.md)
- [Références produit](../01-product/README.md)

Les fiches propres à chaque moteur précisent les champs minimaux, les compléments facultatifs, les états intermédiaires et les exceptions propres à leur domaine. Elles ne peuvent pas affaiblir le présent principe ; toute exception doit être justifiée par un garde-fou du chapitre 3.
