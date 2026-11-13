# Moteur Scan

Scan découvre les Flash actifs dans un rayon borné. Les coordonnées précises des Flash sont stockées côté serveur et ne sont accessibles que selon les règles de sécurité prévues ; la position du scanner est transmise temporairement au RPC et n'est pas persistée par ce contrat.

Le résultat expose une distance et un libellé de zone, jamais la latitude ou la longitude précises. Les recherches sont limitées à 50 résultats et exclues du cache PWA. Le hook utilise un abonnement Supabase nettoyé au démontage, conserve la dernière requête dans une référence stable et bloque les exécutions concurrentes afin qu'un événement Realtime ne crée ni abonnement en boucle ni rafale de scans. Le refus GPS conserve le mode de recherche par zone lorsque celui-ci est disponible.

## Limites actuellement vérifiées

- Le validateur serveur `scanQuerySchema` accepte un `radiusKm` compris entre **1 et 50 km**.
- Le RPC `scan_public_flashes` calcule la distance et applique le filtre `distance_km <= p_radius_km` lorsqu'un rayon est fourni.
- Le plafond technique actuellement vérifié est donc de **50 km**, et non 25 km.
- Ces limites techniques ne définissent pas les choix qui doivent être proposés dans l'interface : les valeurs de rayon V1 restent une décision produit ouverte.
- La limite de 50 résultats est appliquée par le validateur et par le RPC.

Le flux public utilise `list_public_flashes`, une projection SQL bornée accessible aux visiteurs. Cette projection ne retourne ni corps détaillé, ni auteur, ni coordonnées. En cas de perte réseau, l'interface peut revenir aux Flash actifs déjà présents dans IndexedDB et retenter le flux public lorsque la connexion revient.
