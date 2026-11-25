# Mission

Documentation autonome du moteur Mission.

## Lire dans cet ordre

1. [Guide complet](ENGINE_GUIDE.md) — rôle, parcours, machine d'état et limites.
2. [Spécification fonctionnelle](FUNCTIONAL_SPEC.md) — acteurs, règles, parcours et critères d'acceptation.
3. [Architecture technique](TECHNICAL_ARCHITECTURE.md) — contrats TypeScript, repository, Dexie, outbox, Supabase et sécurité.
4. [Contrat API et synchronisation](API_AND_SYNC_CONTRACT.md) — surface réellement disponible et proposition REST historique.
5. [Tests et sécurité](TESTING_AND_SECURITY.md) — couverture actuelle, matrice de tests et points ouverts.
6. [API historique](7.%20Mission%20API.md) — conservée comme référence d'intention, non comme preuve d'endpoints actifs.

## Statut en bref

Le dépôt contient le modèle, les transitions métier, le repository local, l'outbox et une protection PostgreSQL des transitions. Une API REST et une interface Mission dédiées ne sont pas établies par l'inventaire de cette branche. Les documents distinguent donc explicitement implémentation, contrat historique et travaux restant à vérifier.
