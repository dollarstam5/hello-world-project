# Veille — guide complet du moteur

**Objet :** superviser les surveillances personnelles et révéler des tendances collectives à partir de signaux agrégés et anonymisés.  
**État :** vision produit consolidée ; les traitements, tableaux de bord et notifications ne sont pas déclarés opérationnels sans preuve runtime.

## 1. Mission et périmètre

Veille a deux espaces indépendants :
1. **Veille personnelle :** suivi privé des surveillances, missions, événements, paramètres et évolutions appartenant à l'utilisateur.
2. **Veille collective :** analyse de signaux compatibles, agrégés et anonymisés pour faire ressortir les besoins émergents, les opportunités latentes et les tendances.

Veille supervise et explique. Il ne remplace pas le moteur qui exécute une recherche persistante, ne modifie pas les missions à la place de leur propriétaire et ne révèle pas les personnes à l'origine d'un signal.

## 2. Parcours personnel complet

### 2.1 Créer une surveillance
Une surveillance peut être initiée depuis une intention de recherche, une publication que son propriétaire souhaite suivre ou depuis l'espace Veille, selon les capacités validées. La personne définit la cible, la catégorie, les zones, les critères, la durée et les préférences de notification. Toute donnée inconnue reste explicitement inconnue.

La création d'une veille ne doit pas activer une recherche sous-jacente sans que les prérequis et le consentement soient réunis. La personne relit la configuration et confirme les actions ayant un effet réel.

### 2.2 Consulter et comprendre
L'espace personnel n'affiche que les surveillances de l'utilisateur connecté. Chaque élément indique son état, sa progression connue, son échéance et les derniers événements confirmés. Un résumé à l'ouverture peut présenter les changements importants depuis la dernière visite, mais ne doit pas inventer de correspondance ou d'événement.

### 2.3 Gérer
Selon les transitions réellement prises en charge, le propriétaire peut ouvrir le détail, modifier les paramètres autorisés, suspendre, reprendre, prolonger, arrêter ou archiver une surveillance. Veille ne modifie, n'active, ne partage et ne supprime jamais une mission sans accord explicite. Les archives peuvent conserver paramètres et événements utiles selon une politique de conservation validée.

## 3. Parcours collectif complet

### 3.1 Construire les signaux
Le moteur collecte uniquement des signaux dont la finalité, la fraîcheur, la provenance et les permissions sont documentées. Les données individuelles ne sont pas exposées. Les sources historiques incluent des signaux de publications et d'activités compatibles ; leur disponibilité doit être vérifiée avant de les compter comme consultées.

### 3.2 Détecter tendances et besoins
Le moteur peut regrouper les besoins répétés, les catégories en croissance, les zones où la demande évolue et les situations où l'offre paraît insuffisante. Une tendance n'est affichée que si le volume et la qualité des données atteignent des seuils d'agrégation définis. Les seuils, fenêtres temporelles, règles de réidentification et méthode de calcul restent à spécifier.

L'Indice d'Opportunité (IOV) est une proposition de mesure combinant volume de demande, disponibilité de l'offre, évolution, attente et concentration géographique. Sa formule, ses seuils et sa gouvernance ne sont pas considérés comme validés. Il ne doit jamais être présenté comme une prédiction ou garantie de marché.

### 3.3 Répondre à un besoin collectif
Un utilisateur peut manifester qu'il est en mesure de répondre à une tendance. Cette action ne révèle pas les personnes à l'origine des signaux et ne crée pas de contact direct. Une mise en relation exige une expression d'intérêt et une acceptation explicites des parties concernées ; l'identité reste protégée jusque-là.

## 4. États, notifications et conservation

Les documents historiques décrivent des états de préparation, actif, attente de résultats, suspendu, arrivé à échéance, terminé et archivé. Leur correspondance avec les états techniques existants doit être établie avant de les traiter comme un contrat runtime. Les notifications doivent être contextuelles : évolution importante, échéance proche, nouvelle correspondance réellement confirmée ou tendance pertinente. Fréquences, canaux, consentements et quotas restent à définir.

La conservation des archives, des paramètres et des événements doit être alignée sur la politique de données, les droits d'effacement et les coûts. Aucune durée historique proposée ne vaut règle de production sans validation.

## 5. Règles métier et confidentialité

- Les surveillances personnelles sont privées et visibles par leur propriétaire uniquement.
- Les signaux collectifs sont agrégés et anonymisés avant présentation.
- Aucun contenu privé, identifiant, mission individuelle ou donnée réidentifiante n'est exposé.
- Une tendance est un indicateur d'observation, pas une garantie de demande ou de résultat.
- Toute mise en relation exige un intérêt mutuel et une autorisation explicite.
- Les propositions de Veille sont facultatives ; la personne garde le contrôle.
- Veille ne remplace pas le traitement de recherche et ne modifie pas ses critères à sa place.

## 6. Architecture et état d'implémentation

Les sources documentaires disponibles décrivent une charte, trois parties historiques et un contrat API ancien. Elles ne prouvent pas l'existence d'un pipeline complet de collecte, d'agrégation, d'anonymisation, de calcul de tendance, de tableau de bord collectif, de notifications ou de tâches planifiées dans le runtime actuel. Avant activation, inventorier les sources, les jobs, les vues, les politiques RLS, les quotas, les seuils et les tests.

## 7. Critères de validation

Tester l'isolation des veilles personnelles, l'anonymisation, les seuils anti-réidentification, la provenance des signaux, la fraîcheur, les tendances reproductibles, les faux positifs, l'IOV explicable, l'intérêt mutuel, les consentements de notification, les expirations et l'effacement des archives.

## 8. Sources conservées

Les trois parties historiques Veille et le contrat API sont conservés comme matériaux de conception. Le présent guide décrit le parcours complet et les garde-fous de Veille sans nécessiter de lecture croisée d'un autre moteur.