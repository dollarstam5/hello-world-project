# Périmètres V1, V2 et V3

## V1 — socle retrouvé
Présence manuelle et volontaire ; rayon personnalisable jusqu'à 1 km ; paliers 10/25/50/100 m ; un statut ; durées 30 min/1 h/2 h/3 h/6 h/12 h/24 h ; suppression à expiration ; découverte radiale avec profils cliquables et compteurs de regroupement ; bips accessibles lorsque Réel est actif ; consultation de profil et acceptation directe ; expiration des bips non acceptés après 24 h même si Réel est fermé ; mises en relation acceptées accessibles dans compteur Réel et Notifications ; clôture réciproque après confirmation ; désactivation de la communication ; retrait immédiat des deux espaces ; notification de l'autre participant ; trace minimale date/statut/événement ; historique des conversations avec archivage après 3 mois ou dès dépassement du plafond de 50 conversations (la plus ancienne est archivée) ; prise en compte des perturbations réseau.

Cette liste décrit le périmètre fonctionnel retrouvé, pas une preuve d'implémentation.

## V2
Extensions facultatives payantes : l'utilisateur peut augmenter les plafonds gratuits de certains espaces (notamment le stockage) au moyen d'extensions ou de micro-paiements. Les plafonds deviennent ainsi évolutifs selon les besoins de l'utilisateur, dans des paliers et limites définis par Vitalis. Les revenus générés contribuent au financement des coûts réels de fonctionnement de l'application (infrastructure, stockage, transferts, services et frais associés). Les fonctions essentielles gratuites de V1 restent gratuites. Les offres, prix, limites, renouvellements et conditions de paiement devront être définis après mesure des coûts, prise en compte des frais de paiement et validation de la capacité technique. Aucun stockage illimité ni dépassement des capacités globales ne doit être promis.

 Blocage, signalement, anti-abus et raffinements de communication doivent être arbitrés avant affectation.

## V3
Aucune liste V3 détaillée suffisamment confirmée.

## Gouvernance
Une fonctionnalité entre en V1 lorsque sa décision, ses règles, ses cas limites, ses critères d'acceptation et sa faisabilité/coût sont documentés. Les idées futures restent hors V1 tant qu'elles ne sont pas arbitrées.

## Principe économique V1

La V1 vise zéro coût récurrent obligatoire ou un coût quasi nul strictement maîtrisé. Aucun paiement, abonnement ou supplément de stockage n'est proposé en V1 ; les micro-paiements et extensions facultatives sont réservés à V2.

**Proposition de quotas logiques par compte, à valider :** Profil/avatar 2 Mo (avatar ≤ 500 Ko) ; Réel 5 Mo ; Flash 3 Mo ; Scan 1 Mo ; Radar 1 Mo ; Notifications 1 Mo ; données personnelles/préférences communes 2 Mo ; total indicatif 15 Mo. Ces quotas ne sont pas des réservations physiques et devront être recalibrés selon les usages réels de chaque moteur.

**Proposition de garde-fous globaux Supabase Free, à valider :** base de données 350 Mo sur 500 Mo ; stockage fichiers 700 Mo sur 1 Go ; egress non mis en cache 3,5 Go sur 5 Go/mois ; egress mis en cache 3,5 Go sur 5 Go/mois ; Realtime 1,4 million de messages sur 2 millions/mois ; 140 connexions simultanées sur 200. Alertes à 50 %, limitation des opérations non essentielles à 65 %, arrêt des nouvelles écritures non indispensables à 70 %. Ces seuils sont internes et ne remplacent pas les limites du fournisseur.

Les valeurs et conditions Supabase doivent être vérifiées avant lancement. Le plan Free peut mettre en pause un projet après une semaine d'inactivité ; il ne constitue pas une garantie de disponibilité ou de sauvegarde de production.


## Principe de quotas évolutifs — V2

Le quota gratuit constitue le niveau de base. Un utilisateur qui a besoin de davantage de capacité pourra choisir volontairement une extension payante. Les extensions doivent être compréhensibles, transparentes et proportionnées aux coûts qu'elles génèrent. Les recettes correspondantes ont vocation à contribuer au paiement des factures de fonctionnement de Vitalis. Le modèle économique ne doit pas dégrader les fonctions essentielles gratuites, ni autoriser une vente de capacité que l'infrastructure ne peut pas garantir.
