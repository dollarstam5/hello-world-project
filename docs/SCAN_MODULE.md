# Moteur Scan

Scan dÃ©couvre les Flash actifs dans un rayon bornÃ© ou une zone dÃ©clarÃ©e. Les coordonnÃ©es des Flash rÃ©sident dans `flash_locations`, lisible uniquement par leur propriÃ©taire. La position du scanner est un paramÃ¨tre temporaire du RPC et nâ€™est jamais persistÃ©e.

Le rÃ©sultat expose une tranche de distance, jamais latitude ou longitude. Les recherches sont limitÃ©es Ã  50 rÃ©sultats et 25 km, exclues du cache PWA, et actualisÃ©es par un abonnement Supabase nettoyÃ© au dÃ©montage. Le hook conserve la derniÃ¨re requÃªte dans une rÃ©fÃ©rence stable et bloque les exÃ©cutions concurrentes afin quâ€™un Ã©vÃ©nement Realtime ne crÃ©e ni abonnement en boucle ni rafale de scans. Le refus GPS conserve le mode de recherche par zone.

Le flux dâ€™accueil public utilise `list_public_flashes`, une projection SQL bornÃ©e accessible aux visiteurs. Cette frontiÃ¨re ne retourne ni corps dÃ©taillÃ©, ni auteur, ni quota de rÃ©ponses, ni coordonnÃ©es. En cas de perte rÃ©seau, lâ€™interface revient aux Flash actifs dÃ©jÃ  prÃ©sents dans IndexedDB et retente le flux public lorsque la connexion revient.