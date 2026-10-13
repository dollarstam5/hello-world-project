# Opérations et santé du service Vitala

Ce document définit les seuils opérationnels utilisés pour diagnostiquer la santé du service et du mode offline. Il ne contient aucun secret ni identifiant utilisateur.

## 1. Niveaux de santé

| Niveau | Condition principale | Action |
| --- | --- | --- |
| healthy | HTTP 2xx/3xx, latence < 500 ms, offline healthy | fonctionnement normal |
| warning | latence >= 500 ms et < 2 s, ou HTTP 4xx, ou offline warning | surveiller et diagnostiquer |
| critical | latence >= 2 s, HTTP 5xx, ou offline critical | intervention prioritaire |

Les seuils sont alignés avec `src/lib/observability/health-policy.ts`.

## 2. Santé offline

| Niveau | Condition |
| --- | --- |
| healthy | aucune mutation en attente ni quarantaine |
| warning | travail en attente, ou mutation la plus ancienne >= 15 min |
| critical | mutation en quarantaine, ou mutation la plus ancienne >= 24 h |

Les seuils offline sont définis dans `src/platform/offline/diagnostics.ts`.

## 3. Endpoint health

`GET /api/health` est un contrôle de disponibilité minimal et sans dépendance externe.

Contrat attendu :
- HTTP 200 ;
- réponse JSON ;
- `cache-control: no-store` ;
- champ `status: "ok"` ;
- champ `service: "vitala"` ;
- horodatage ISO-8601 valide.

Un health 200 ne signifie pas à lui seul que toutes les dépendances métier sont opérationnelles.

## 4. Diagnostic

Pour diagnostiquer un incident, utiliser dans cet ordre :

1. vérifier `GET /api/health` ;
2. vérifier le `x-request-id` de la requête ;
3. consulter le niveau health calculé ;
4. consulter les diagnostics offline (pending/quarantine/âge) ;
5. vérifier les logs structurés sans données sensibles ;
6. vérifier les changements récents avant toute modification.

Les logs ne doivent jamais contenir de token, secret, mot de passe, clé API ou contenu utilisateur sensible.

## 5. Objectifs de service

Les seuils de santé servent au triage opérationnel et ne constituent pas une promesse de disponibilité publique.

Pour une préproduction ou une production, toute définition formelle de SLO doit préciser :
- fenêtre d'observation ;
- disponibilité cible ;
- latence cible ;
- budget d'erreur ;
- procédure d'escalade ;
- procédure de rollback.

Tant que ces éléments ne sont pas validés en préproduction, le projet reste « candidat Go » et non « Go production ».

## 6. Authentification

Ce contrat opérationnel ne modifie ni le mécanisme d'authentification, ni les tokens, ni les redirections d'authentification.
