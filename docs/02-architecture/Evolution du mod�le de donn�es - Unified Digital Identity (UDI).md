Évolution du modèle de données : Unified Digital

Identity (UDI)

1. Nouveau principe d'architecture

La base de données de Vitala est organisée selon une approche orientée domaines.

Chaque domaine métier est propriétaire exclusif de ses données.

Aucune donnée métier ne doit être dupliquée dans un autre domaine.

L'Unified Digital Identity (UDI) constitue la représentation unifiée de l'utilisateur mais ne devient jamais

propriétaire des données produites par les autres domaines.

2. Organisation des données

Les informations visibles dans le profil utilisateur proviennent de plusieurs domaines spécialisés.

Chaque domaine conserve la responsabilité de son propre modèle de données.

Domaine Identity

Responsable de :

•

utilisateurs

•

identité

•

informations personnelles

•

vérifications

•

statut du compte

Domaine Capabilities

Responsable de :

•

compétences

•

expériences

•

certifications

•

domaines d'expertise

•

centres d'intérêt

1

Domaine Context

Responsable de :

•

localisation

•

disponibilité

•

mobilité

Domaine Intentions

Responsable des objectifs actuels de l'utilisateur :

•

recherche d'opportunités

•

recrutement

•

partenariat

•

investissement

•

collaboration

•

autres intentions futures

Les intentions sont historisées afin de suivre leur évolution.

Domaine Preferences

Responsable de :

•

préférences utilisateur

•

personnalisation

•

paramètres Radar

•

paramètres Veille

•

paramètres Recommendation

Domaine Privacy

Responsable de :

•

visibilité des informations

•

consentements

•

préférences de confidentialité

Domaine Trust

Le Trust Engine reste propriétaire de :

•

Trust Profile

2

•

Trust Score

•

Trust Evidence

•

Trust History

•

Trust Events

Le profil utilisateur ne contient qu'une vue agrégée de ces informations.

Domaine Activity

Responsable de :

•

Flash publiés

•

réponses

•

missions

•

interactions

•

historique utilisateur

Domaine Recommendation

Responsable des recommandations générées.

Domaine Radar

Responsable des données Radar.

Domaine Veille

Responsable des résultats produits par le moteur Veille.

Domaine Statistics

Responsable des indicateurs calculés concernant l'activité utilisateur.

3. Agrégation

L'UDI est reconstruite dynamiquement à partir des données des différents domaines.

Elle constitue une vue métier unifiée.

3

Cette approche garantit :

•

une seule source de vérité ;

•

l'absence de duplication ;

•

une évolution indépendante des domaines ;

•

une meilleure maintenabilité.

4. Règles de gouvernance

Chaque table appartient à un domaine unique.

Toute modification d'une donnée est réalisée exclusivement par son domaine propriétaire.

Les autres domaines utilisent cette donnée via des contrats métiers ou des vues adaptées.

5. Préparation des évolutions futures

Cette organisation permet d'ajouter de nouveaux domaines (Organisation, Entreprise, Marketplace, IA,

etc.) sans remettre en cause les structures existantes.

L'UDI pourra intégrer ces nouveaux domaines sous forme de nouvelles vues, sans modification de son

rôle d'agrégateur.

4

