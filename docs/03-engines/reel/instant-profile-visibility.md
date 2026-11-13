# Instant — périmètre du profil et visibilité

## Statut

Règle produit validée à intégrer au périmètre prioritaire d'Instant. Ce document complète l'architecture UI existante ; il ne prétend pas que le réglage de visibilité décrit ici est déjà implémenté.

## Principe

Chaque moteur Vitalis consomme le profil selon son propre besoin. L'ouverture d'un moteur ne donne jamais, à elle seule, accès au profil complet. Les champs visibles dans un moteur sont définis par son contrat produit et ses réglages de confidentialité.

## Profil affiché par défaut dans Instant

Instant utilise uniquement les trois éléments suivants pour représenter une personne dans la proximité :

1. **Nom** : nom d'affichage choisi ou autorisé par l'utilisateur.
2. **Photo** : photo/avatar de profil autorisé.
3. **Description de présence** : courte description que l'utilisateur définit pour son usage dans Instant. Elle décrit ce qu'il souhaite rendre visible dans ce contexte, et ne doit pas être assimilée à la biographie générale du profil.

Ces trois éléments forment la projection publique minimale d'Instant. Les cartes de proximité, les disques regroupés, les fiches rapides et les vues de présence doivent respecter cette projection.

## Consultation facultative du profil complet

- Les paramètres propres à Instant doivent proposer un choix explicite permettant d'autoriser ou non la consultation du profil complet depuis Instant.
- Présentation possible : une case à cocher ou un interrupteur intitulé **« Autoriser la consultation de mon profil complet depuis Instant »**.
- La valeur par défaut recommandée est **désactivée** : le profil complet n'est pas consultable tant que l'utilisateur n'a pas donné son accord explicite.
- Lorsque le réglage est désactivé, l'ouverture d'une fiche depuis Instant reste limitée au nom, à la photo et à la description de présence.
- Lorsque le réglage est activé, Instant peut proposer un accès au profil complet, sous réserve des droits d'accès et des règles générales de confidentialité de Vitalis.
- L'utilisateur peut retirer son autorisation à tout moment. Le retrait doit prendre effet pour les consultations suivantes et ne doit pas être contourné par une donnée précédemment chargée ou mise en cache côté client.
- Le réglage ne doit pas rendre le profil complet public dans les autres moteurs ni modifier leurs propres règles.

## Séparation des données

- Le profil complet reste la source canonique des données de compte.
- La description de présence est une donnée contextuelle propre à Instant ; ne pas remplacer ni modifier la biographie générale du compte avec cette description.
- Les projections envoyées à l'interface doivent contenir uniquement les champs nécessaires au mode d'affichage autorisé.
- Le contrôle d'accès doit être appliqué côté serveur/API ; masquer un bouton ou une section dans l'interface ne constitue pas une protection.
- Les modes membre et invité restent distincts. Le profil temporaire d'un invité ne doit pas être transformé en profil membre ni recevoir les droits d'un membre.

## Impacts UI/UX à prévoir

- Dans la fiche rapide d'une personne : afficher uniquement les trois éléments minimaux.
- Ajouter dans les paramètres d'Instant le choix explicite de visibilité du profil complet.
- Si l'accès complet est autorisé, proposer une action distincte pour ouvrir le profil ; ne pas remplacer la fiche rapide par un profil complet imposé.
- Afficher un état compréhensible lorsque le profil complet n'est pas partagé, sans donner l'impression qu'une erreur s'est produite.
- Garder le profil de l'utilisateur au centre de l'action principale d'Instant ; ce profil central ne doit pas être confondu avec la fiche complète consultable par autrui.

## Critères d'acceptation

- [ ] Sans consentement, la projection Instant ne contient que nom, photo et description de présence.
- [ ] Le réglage de consultation du profil complet est propre à Instant.
- [ ] Le réglage est désactivé par défaut, sauf décision produit ultérieure explicite.
- [ ] Le serveur refuse la lecture des champs complets lorsque le consentement est absent ou retiré.
- [ ] Le retrait du consentement est respecté lors des requêtes suivantes et dans les données réutilisées côté client.
- [ ] Les autres moteurs ne changent pas de comportement à cause de ce réglage.
- [ ] Les parcours invité et membre restent séparés.

## Points à préciser pendant la conception détaillée

- Liste exacte des champs composant le « profil complet » et règles de visibilité individuelles éventuelles.
- Durée et stratégie d'invalidation des données mises en cache.
- Comportement exact de l'écran si une personne retire son consentement pendant qu'une fiche est ouverte.
- Libellé final et emplacement du réglage dans les paramètres Instant.
