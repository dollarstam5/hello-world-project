# Matrice centrale des droits et décisions Vitalis

**Statut :** première matrice de cadrage V1. Les règles transversales sont définies ; les droits métier non encore confirmés restent explicitement à décider et ne doivent pas être interprétés comme autorisés.

## 1. Principe commun

Toute demande suit le même ordre :

1. Identifier le mode de session : visiteur, invité ou membre.
2. Vérifier l'état du compte lorsque la personne est membre.
3. Identifier précisément le moteur, la ressource et l'action demandée.
4. Vérifier la disponibilité réelle de la fonctionnalité.
5. Vérifier le consentement spécifique, la propriété et les limites applicables.
6. Si l'action touche une donnée ou une opération protégée, demander l'autorisation au serveur.
7. Si la personne est hors ligne, ne mettre en attente que les commandes expressément compatibles et revalidables.

Le moteur central ne remplace pas les règles propres aux domaines. Il garantit que les mêmes contrôles de base sont appliqués partout.

## 2. Socle commun par mode

| Mode | Découverte publique | Ouvrir un espace | Créer/modifier/supprimer | Publier ou contacter | Données privées |
| --- | --- | --- | --- | --- | --- |
| Visiteur | Oui, si la ressource est publique | Non par défaut | Non | Non | Non |
| Invité | Oui, si public | Parcours Réel invité uniquement | Refus par défaut ; exception future uniquement après politique serveur dédiée | Refus par défaut | Session éphémère strictement limitée |
| Membre actif | Oui, selon visibilité | Oui | Vérification serveur et propriété | Vérification serveur, consentement et règles du moteur | Selon droits, consentements et RLS |
| Profil incomplet/invité | Présentation publique seulement | Non | Non | Non | Non |
| Profil suspendu/fermé | Présentation publique seulement | Non | Non | Non | Non |
| État inconnu ou erreur | Présentation publique seulement | Non | Non | Non | Non |

La présentation publique ne donne pas accès aux détails privés, aux résultats réservés ni aux opérations.

## 3. Matrice par moteur

| Moteur | Finalité | Actions à contrôler | Consentements / données sensibles | Règles métier V1 connues | Décisions encore nécessaires |
| --- | --- | --- | --- | --- | --- |
| Réel | Présence locale immédiate et mises en relation | Entrer, démarrer/arrêter présence, découvrir, envoyer/recevoir bip, accepter/refuser, fermer relation | Partage volontaire de présence/localisation approximative ; visibilité du profil ; durée de présence | Durées et rayons autorisés définis ; présence membre avec consentement ; bips privés ; acceptation crée une relation ; invité non encore raccordé aux opérations | Parcours invité sécurisé ; calcul spatial réel ; application du rayon ; transport temps réel ; règles de blocage/signalement ; conservation détaillée |
| Flash | Partager une information utile, temporaire et située dans une zone | Lire, créer, modifier, archiver, supprimer, publier, signaler, contacter si prévu | Zone et visibilité ; identité affichée ; éventuelles pièces jointes | Exemples pédagogiques séparés des données réelles ; gestion locale « Mes Flash » existante | Visibilité publique/privée ; durée et expiration ; modération ; quotas ; règles de contact ; synchronisation et droits serveur |
| Scan | Rechercher des informations ou besoins à proximité | Lancer recherche, lire résultats, consulter profil, conserver/effacer historique | Localisation ou zone ; paramètres de rayon ; historique minimal | Choix de rayon 1/5/10/20 km ; historique local limité à date et nombre de résultats ; pas de coordonnées conservées dans l'historique | Contrat exact des sources ; précision de zone ; consentement ; visibilité des profils ; anti-abus ; quotas et accès invité |
| Radar | Enregistrer une veille pour un besoin | Créer, modifier, annuler, consulter, synchroniser, recevoir correspondance/alerte | Intention, zone approximative, rayon, durée ; consentement aux alertes | Veilles privées en brouillon ; rayons 1/3/5/10/25/50 km ; durée 3 à 90 jours ; stockage local et synchronisation existants | Correspondances automatiques ; traitement planifié ; alertes ; quotas ; visibilité des correspondances ; rétention et règles de notification |
| 2×2 | Accéder aux espaces Espace et Talents et à leurs fonctions | Entrer, consulter, gérer profil/espace, publier une offre ou une compétence si livré, contacter si prévu | Identité, informations de profil, visibilité, données liées aux talents | Le menu donne accès à Espace et Talents ; aperçus pédagogiques explicitement marqués « Exemple » | Définir si 2×2 est un conteneur ou un moteur métier ; droits Espace/Talents ; publication ; recherche ; visibilité ; mise en relation et modération |

**Attention :** les éléments de la colonne « décisions encore nécessaires » sont des travaux à spécifier, pas des fonctions disponibles. Ne pas afficher de boutons actifs ni simuler de résultats pour ces capacités.

## 4. Contrôles obligatoires selon l'action

| Famille d'action | Contrôles minimum avant exécution |
| --- | --- |
| Lire une information publique | Ressource réellement publique, statut publié, projection de données minimale |
| Lire une information privée | Session valide, propriétaire ou droit explicite, RLS/serveur |
| Créer | Moteur activé, compte autorisé, champs valides, consentement requis, quota, anti-abus |
| Modifier | Tous les contrôles de création + propriété ou permission explicite + état modifiable |
| Supprimer/annuler | Propriété ou permission explicite, confirmation adaptée, conséquences et révocation des accès associés |
| Publier | Contrôles de création + visibilité choisie + consentement de diffusion + modération si nécessaire |
| Découvrir/rechercher | Source activée, zone et rayon autorisés, consentement si localisation, limitation de fréquence, filtrage des données |
| Contacter / mise en relation | Identité autorisée, destinataire éligible, consentement/choix explicite, anti-spam, blocage et signalement |
| Synchroniser | Session encore valide, propriétaire, version/état, idempotence, revalidation des droits et conflits |
| Exporter | Droit explicite, périmètre défini, protection des données et confirmation |
| Recevoir une notification | Événement réel, préférence/permission applicable, absence de doublon et contenu non sensible |

## 5. Règles de confidentialité communes

- Collecter le minimum nécessaire à l'action demandée.
- Ne jamais exposer téléphone, adresse exacte, coordonnées GPS, données privées ou détails de compte dans une carte de résultat sans règle explicite et consentement approprié.
- Séparer les exemples de démonstration des données réelles et signaler clairement les exemples.
- Respecter la visibilité choisie par la personne ; une session authentifiée ne rend pas son profil public.
- Un consentement est lié à un objectif précis, peut être retiré et ne doit pas être réutilisé pour un autre objectif.
- Ne pas transformer une action temporaire en historique durable sans règle produit claire.
- Les invités ne reçoivent pas de profil permanent ; aucune fusion automatique avec un compte membre.
- Les données hors ligne sont minimales, protégées localement, révalidées au retour du réseau et supprimées si la commande n'est plus autorisée.

## 6. Décision hors ligne

| Action | Mise en attente par défaut |
| --- | --- |
| Brouillon privé Radar | Oui, selon le contrat offline-first existant |
| Gestion locale de Flash appartenant au membre | Oui, dans les limites du dépôt local existant |
| Démarrage/arrêt d'une présence Réel | Non |
| Bip, acceptation ou fermeture de relation | Non |
| Recherche de proximité et lecture de résultats | Non |
| Publication ou prise de contact | Non |
| Changement de droits, consentements ou visibilité | Non |
| Synchronisation d'une commande déjà mise en attente | Revalidation serveur obligatoire |

Une décision `defer` indique uniquement qu'une commande peut rejoindre une file locale contrôlée. Elle n'est jamais une autorisation de l'exécuter plus tard sans revalidation.

## 7. Répartition des responsabilités

- **Gestionnaire central** : mode d'accès, état du compte, contrôles transversaux, statut de décision et messages humains.
- **Domaine moteur** : règles métier, validité de la ressource, cycle de vie, consentements propres au moteur et commandes offline compatibles.
- **Serveur / base** : autorisation finale, propriété, RLS, quotas faisant foi, limites anti-abus, idempotence et journal technique minimal.
- **Interface** : présente les possibilités réellement disponibles, explique simplement les refus et ne considère jamais un résultat client comme une preuve d'autorisation.

## 8. Ordre recommandé de mise en œuvre

1. Réel : finaliser les règles de présence, invité, rayon, bips, relations, blocage et signalement avant activation publique.
2. Flash : définir le cycle de vie, la visibilité, la modération et les règles de publication.
3. Scan : définir les sources, les projections de résultats, la localisation et les limites de recherche.
4. Radar : compléter correspondances, alertes, expiration, quotas et revalidation.
5. 2×2 : clarifier les droits propres à Espace et Talents et les fonctions réellement livrées.
6. Consolider les contrôles serveur/RLS et exécuter les tests positifs et négatifs de tous les moteurs.

Chaque étape doit être documentée et testée dans le domaine concerné, sans créer une branche supplémentaire ni activer prématurément une capacité.
