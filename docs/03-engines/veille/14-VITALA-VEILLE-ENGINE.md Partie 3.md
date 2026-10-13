# 14-VITALA-VEILLE-ENGINE.md

## Partie 3 — Expérience utilisateur, supervision et verrouillage du moteur

# 23. L'organisation de la page Veille

La page Veille constitue le centre de supervision de toutes les activités de surveillance de Vitala. Elle est organisée en deux espaces complémentaires.

## 23.1 Veille personnelle

Cet espace regroupe toutes les veilles de l'utilisateur. Il permet notamment de consulter :

- les veilles actives;
- les veilles suspendues;
- les veilles arrivant prochainement à expiration;
- les veilles terminées;
- les archives.
Chaque veille affiche son état, sa progression et les derniers événements associés.

## 23.2 Veille collective

Cet espace présente les observations globales de Vitala. Il met en avant :

- les besoins émergents;
- les opportunités latentes;
- les catégories les plus surveillées;
- les zones où la demande évolue;
- les services insuffisamment représentés;
- les nouvelles tendances détectées.
Toutes les informations sont agrégées et anonymisées.

# 24. Résumé intelligent

À chaque ouverture de Veille, l'utilisateur obtient un résumé clair de ce qui a évolué depuis sa dernière visite. Par exemple :

- nouvelles opportunités détectées;
- nouvelles correspondances;
- veilles arrivant à expiration;
- besoins émergents dans les catégories suivies;
- nouvelles tendances collectives.
L'objectif est de permettre à l'utilisateur de comprendre rapidement les évolutions importantes sans devoir parcourir chaque veille.

# 25. Explorer une tendance

Les tendances proposées par Veille sont interactives. L'utilisateur peut consulter leur détail afin de comprendre :

- pourquoi cette tendance est apparue;
- comment elle évolue;
- quelles zones sont concernées;
- quels types de besoins sont les plus représentés.
Lorsque cela est pertinent, Vitala peut également suggérer :

- de créer une veille similaire;
- d'étendre une veille existante;
- de répondre à un besoin collectif.
# 26. Répondre à un besoin collectif

Lorsqu'un utilisateur estime pouvoir répondre à une tendance observée, il peut manifester son intérêt. Cette action ne donne jamais accès aux personnes concernées. Vitala informe uniquement les utilisateurs ayant exprimé un besoin compatible. Chaque utilisateur conserve la liberté :

- d'accepter la mise en relation;
- de la refuser;
- ou de l'ignorer.

La confidentialité est préservée jusqu'à l'expression d'un intérêt mutuel.

# 27. L'Indice d'Opportunité Vitala (IOV)

Veille attribue un Indice d'Opportunité aux besoins collectifs observés. Cet indicateur aide les utilisateurs à identifier les opportunités les plus significatives. L'indice prend en compte plusieurs facteurs :

- volume de la demande;
- disponibilité de l'offre;
- évolution de la demande;
- durée moyenne d'attente;
- concentration géographique.
Les niveaux proposés sont : 🟢 Faible 🟡 Modéré 🟠 Fort 🔴 Prioritaire Chaque indice est accompagné d'une explication permettant à l'utilisateur de comprendre son niveau. L'IOV constitue une aide à la décision. Il ne représente jamais une garantie de résultat.

# 28. Les notifications intelligentes

Veille privilégie des notifications utiles. Une notification est envoyée lorsqu'un événement présente un intérêt réel. Exemples :

- une nouvelle opportunité compatible est détectée;
- une tendance importante apparaît;
- une veille nécessite une action;
- une veille arrive à expiration;
- une personne souhaite répondre à un besoin collectif.

Les notifications sont toujours reliées à leur contexte afin de faciliter la compréhension.

# 29. Les archives

Les veilles terminées restent accessibles. Chaque archive conserve notamment :

- les paramètres utilisés;
- la durée de surveillance;
- les événements importants;
- les opportunités détectées;
- le résultat obtenu.
Les archives permettent à l'utilisateur de retrouver facilement ses anciennes surveillances et de s'en inspirer pour de futures veilles.

# 30. Principes UX

Veille repose sur plusieurs principes d'expérience utilisateur.

- Donner une vision claire de l'évolution des besoins.
- Présenter uniquement des informations utiles.
- Expliquer les tendances observées.
- Préserver la confidentialité des utilisateurs.
- Faciliter la prise de décision.
- Maintenir une interface simple malgré la richesse des informations.
- Toujours laisser le contrôle à l'utilisateur.
# 31. Checklist d'implémentation

Avant de considérer Veille comme terminé, les éléments suivants doivent être vérifiés. ✓ Gestion des veilles personnelles. ✓ Gestion des états. ✓ Paramètres de surveillance. ✓ Tableau de bord personnel. ✓ Tableau de bord collectif. ✓ Détection des besoins émergents.

✓ Détection des opportunités latentes. ✓ Détection des tendances. ✓ Consultation détaillée des tendances. ✓ Réponse à un besoin collectif. ✓ Mise en relation sécurisée. ✓ Notifications intelligentes. ✓ Indice d'Opportunité Vitala (IOV). ✓ Gestion des archives. ✓ Confidentialité des données.

# 32. Décisions d'architecture

Les règles suivantes constituent les décisions officielles du moteur Veille.

- Veille ne remplace jamais Radar; il supervise les surveillances.
- Les veilles personnelles sont strictement privées.
- Les tendances collectives sont toujours anonymisées.
- Aucun utilisateur ne peut consulter les missions d'un autre utilisateur.
- Les besoins émergents sont construits à partir d'un ensemble de signaux compatibles.
- Les opportunités latentes représentent des besoins insuffisamment satisfaits.
- Une tendance ne constitue jamais une garantie de marché.
- L'Indice d'Opportunité Vitala est un indicateur d'aide à la décision.
- Toute mise en relation nécessite un intérêt mutuel.
- L'identité des utilisateurs reste protégée tant que les deux parties n'ont pas accepté le contact.
- Les notifications privilégient la pertinence plutôt que la fréquence.
- Les archives restent accessibles tant que l'utilisateur ne les supprime pas.
# Conclusion

Veille constitue le moteur de supervision et d'intelligence collective de Vitala. À l'échelle individuelle, il permet à chaque utilisateur de suivre efficacement ses surveillances et d'en comprendre l'évolution. À l'échelle collective, il transforme des milliers de signaux anonymisés en tendances, en besoins émergents et en opportunités concrètes.

En révélant non seulement ce qui existe, mais également ce qui manque, Veille contribue à rapprocher naturellement l'offre et la demande. Il complète ainsi les autres moteurs de Vitala : Flash diffuse. Scan découvre. Radar recherche. Veille observe, comprend et révèle les opportunités invisibles de l'écosystème. Cette complémentarité fait de Veille l'un des piliers majeurs de l'intelligence de la plateforme.