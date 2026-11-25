# Personas Vitala

**Statut :** référence produit consolidée à partir de la source historique V1.  
**Portée :** intentions et comportements d'usage, pas catégories démographiques ni permissions d'accès.

## Principe

Un persona décrit ce qu'une personne cherche à accomplir dans un contexte donné. Une même personne peut adopter plusieurs personas selon le besoin, le moment et l'opportunité. Les personas ne constituent ni des types de compte exclusifs, ni une progression obligatoire, ni une preuve d'identité ou de confiance.

Les exemples et transitions ci-dessous proviennent de la définition produit historique. Ils décrivent l'intention de conception ; ils ne prouvent pas que tous les parcours sont déjà implémentés.

## Personas du périmètre MVP

### Consultant

**Intention :** découvrir Vitala sans engagement préalable.

- **Besoins :** comprendre la valeur du service, explorer et observer.
- **Actions envisagées :** consulter l'accueil, explorer les fonctionnalités et les opportunités publiques.
- **Transition possible :** commencer à rechercher activement une information ou une opportunité.

Le mot « consultant » désigne ici un état d'exploration dans le vocabulaire produit. Il ne doit pas être confondu avec une profession de conseil.

### Découvreur

**Intention :** trouver quelque chose d'utile ou repérer une possibilité.

- **Besoins :** gagner du temps, découvrir des ressources et des solutions pertinentes.
- **Actions envisagées :** utiliser Radar ou Flash, consulter des recommandations et sauvegarder des opportunités.
- **Transition possible :** devenir Demandeur ou Contributeur selon le besoin.

### Demandeur

**Intention :** résoudre un besoin précis, immédiat ou planifié.

- **Besoins :** trouver une personne, une ressource, un service ou une information.
- **Actions envisagées :** publier une demande ou une opportunité, lancer une recherche et comparer des réponses.
- **Exemples historiques :** rechercher un artisan, un chauffeur, un partenaire ou un service domestique.
- **Confiance :** la source historique indique un compte enregistré comme minimum attendu ; cette règle doit être confirmée par les parcours et autorisations réels.

### Contributeur

**Intention :** proposer une solution, une compétence, une ressource ou une information utile.

- **Besoins :** aider, répondre à une opportunité, valoriser une compétence ou développer une activité.
- **Actions envisagées :** répondre à une demande, proposer un service ou partager une ressource.
- **Exemples historiques :** artisan, enseignant, prestataire ou autre personne offrant une compétence.
- **Confiance :** la source historique recommande le niveau « Identifié » ; ce n'est pas une règle d'autorisation confirmée par ce document.

### Recommandeur

**Intention :** partager une expérience ou recommander une personne ou une organisation sur la base d'éléments concrets.

- **Besoins :** aider autrui, transmettre une référence et renforcer la qualité des mises en relation.
- **Actions envisagées :** soumettre une recommandation et confirmer une expérience réelle.
- **Garde-fou :** une recommandation doit être liée à une relation ou une expérience vérifiable ; la popularité seule ne constitue pas une preuve.
- **Confiance :** la source historique recommande le niveau « Vérifié » ; la règle opérationnelle reste à valider.

## Personas évolués

Les personas suivants sont décrits comme des extensions possibles, pas comme des capacités MVP garanties.

### Garant

Apporte une référence ou une garantie contextualisée, par exemple au titre d'une relation professionnelle, associative ou d'une expérience connue. Le rôle d'un garant ne remplace jamais une vérification officielle ni une procédure de sécurité.

### Acteur local

Facilite l'activité d'un environnement local, d'un groupe ou d'une communauté. Le rôle ne doit pas impliquer automatiquement un pouvoir de modération ou d'administration.

### Professionnel

Utilise Vitala dans le cadre d'une activité professionnelle durable. Le persona décrit une intention d'usage et ne vaut ni certification, ni statut légal, ni niveau de confiance « Pro ».

## Profils de contexte

Les profils de contexte décrivent des éléments utiles à la personnalisation, par exemple les centres d'intérêt, la situation familiale, les études, l'activité ou l'appartenance à une organisation. Ils sont distincts des personas : une personne peut cumuler plusieurs contextes et changer de persona sans que son identité ou son niveau de confiance change automatiquement.

Les exemples historiques doivent être utilisés avec parcimonie et uniquement lorsque la personne les renseigne ou qu'une base légitime existe. Ne pas inférer un contexte sensible à partir du comportement.

## Parcours et règles d'expérience

Le parcours historique « Consultant → Découvreur → Demandeur ou Contributeur → Recommandeur → Garant / Professionnel » est une illustration, pas un tunnel obligatoire. Une personne peut revenir à l'exploration, agir comme Demandeur dans un contexte et Contributeur dans un autre.

Lors de la conception d'un parcours :

1. Identifier l'intention actuelle plutôt que d'assigner un persona permanent.
2. Proposer uniquement les actions disponibles et autorisées dans l'état réel du produit.
3. Expliquer les prérequis de vérification ou de confiance lorsqu'ils existent.
4. Ne pas déduire la fiabilité, la compétence ou la légitimité d'une personne de son persona.
5. Vérifier le parcours dans le code et les tests avant de le présenter comme disponible.

## Relation avec les autres références

- Les niveaux de confiance et les prérequis historiques sont définis dans [Niveaux de confiance](./trust-levels.md).
- Le modèle de confiance et les événements sont décrits dans [Domaine Trust](../02-architecture/trust-domain.md).
- L'identité numérique et ses vues sont décrites dans [Modèle d'identité numérique unifiée](../02-architecture/identity-model.md).

## Source historique

La source `docs/02-VITALA - PERSONAS V1.md` est conservée pour la traçabilité. Cette référence canonique la synthétise sans autoriser sa suppression.
