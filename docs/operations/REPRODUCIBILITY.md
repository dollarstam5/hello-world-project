# Reproductibilité P0.11.2

P0.11.2 vérifie que le build public de production est reproductible à partir du même commit, du même `bun.lock` et du même environnement CI.

Le contrôle `check:reproducibility` :

1. supprime le build précédent ;
2. exécute `build:check` ;
3. calcule un SHA-256 déterministe de `.output/public` en parcourant les fichiers dans un ordre stable ;
4. reconstruit depuis zéro ;
5. compare les deux empreintes.

Une différence bloque `check:release`. Le contrôle ne modifie pas l'authentification.
