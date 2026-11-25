# Historique Scan — V1

## Comportement disponible

Après chaque recherche Scan réussie, Vitalis peut conserver sur l'appareil un petit historique des dix dernières recherches. Une entrée contient uniquement :

- la date et l'heure de la recherche ;
- le nombre de résultats renvoyés.

L'historique est affiché dans la page Scan, sous les résultats. La personne peut l'effacer depuis cette même section.

## Données exclues

L'historique ne conserve jamais :

- les coordonnées GPS ou une adresse précise ;
- le rayon ou la zone recherchée ;
- le texte de recherche ou la catégorie ;
- les titres, identifiants, profils ou détails des résultats ;
- les données de compte.

Les résultats affichés dans la recherche restent distincts de cet historique minimal.

## Stockage et limites

- Stockage local au navigateur/appareil via `localStorage`, sans appel serveur et sans synchronisation.
- Maximum : dix entrées, les plus récentes en premier.
- Une recherche échouée ou une permission de localisation refusée n'est pas enregistrée.
- Une mise à jour automatique des résultats en temps réel ne crée pas une nouvelle entrée.
- Si le stockage local est indisponible ou plein, Scan continue de fonctionner ; l'historique peut simplement ne pas être conservé.
- L'effacement supprime les entrées locales connues de ce navigateur. La désinstallation, l'effacement des données du navigateur ou le changement d'appareil peuvent également faire disparaître cet historique.

## Évolution

Un historique synchronisé entre appareils nécessiterait une décision produit distincte, une durée de conservation, un contrôle de suppression côté serveur et une analyse de confidentialité. Ce n'est pas inclus dans la V1 actuelle.
