API-ERROR-CATALOG.md

Version : V1

Statut : Référentiel officiel des codes d'erreur des API de Vitala

1. Objectif

Le présent document constitue le catalogue officiel des erreurs retournées par les API de Vitala.

Il centralise l'ensemble des codes d'erreur métier, de validation, de sécurité et des erreurs techniques

afin de garantir une gestion uniforme sur toutes les applications de la plateforme.

Ce document complète la section Gestion des erreurs de BUILD-API.md.

2. Principes

Chaque erreur doit posséder :

•

un identifiant unique ;

•

une catégorie ;

•

un code HTTP associé ;

•

une description claire ;

•

une action corrective recommandée.

Les codes d'erreur sont stables dans le temps et ne doivent jamais être réutilisés pour une autre

signification.

3. Structure d'une fiche d'erreur

Chaque erreur est documentée selon le modèle suivant :

•

Code métier

•

Catégorie

•

Code HTTP

•

Description

•

Cause probable

•

Action recommandée côté client

•

Journalisation requise

•

Domaines concernés

1

4. Organisation du catalogue

Les erreurs sont regroupées par domaine fonctionnel.

A. Erreurs communes

Préfixe :

•

COMMON_

Exemples :

•

COMMON_INTERNAL_ERROR

•

COMMON_INVALID_REQUEST

•

COMMON_RESOURCE_NOT_FOUND

B. Authentification

Préfixe :

•

AUTH_

Exemples :

•

AUTH_INVALID_TOKEN

•

AUTH_SESSION_EXPIRED

•

AUTH_LOGIN_REQUIRED

C. Autorisation

Préfixe :

•

PERMISSION_

Exemples :

•

PERMISSION_DENIED

•

PERMISSION_INSUFFICIENT_ROLE

•

PERMISSION_RLS_DENIED

D. Identity

Préfixe :

•

USER_

2

Exemples :

•

USER_NOT_FOUND

•

USER_ALREADY_EXISTS

•

USER_ACCOUNT_DISABLED

E. Flash

Préfixe :

•

FLASH_

Exemples :

•

FLASH_NOT_FOUND

•

FLASH_ALREADY_PUBLISHED

•

FLASH_ARCHIVED

F. Mission

Préfixe :

•

MISSION_

Exemples :

•

MISSION_NOT_FOUND

•

MISSION_ALREADY_COMPLETED

•

MISSION_ALREADY_ASSIGNED

G. Social

Préfixe :

•

SOCIAL_

H. Trust

Préfixe :

•

TRUST_

3

I. Media

Préfixe :

•

MEDIA_

J. Notification

Préfixe :

•

NOTIFICATION_

K. Sync

Préfixe :

•

SYNC_

L. Intelligence

Préfixe :

•

AI_

M. Administration

Préfixe :

•

ADMIN_

N. Audit

Préfixe :

•

AUDIT_

4

O. Configuration

Préfixe :

•

SETTINGS_

P. Infrastructure

Préfixe :

•

INFRA_

5. Règles de nommage

Tous les codes doivent :

•

•

être écrits en majuscules ;
utiliser le séparateur  _  ;

•

commencer par le préfixe du domaine ;

•

rester explicites et stables.

Exemple :

FLASH_ALREADY_PUBLISHED

6. Références

Ce catalogue est lié à :

•

BUILD-API.md

•

BUILD-SECURITY.md

•

DATABASE-RLS-MATRIX.md

•

DATABASE-DICTIONARY.md

•

Domain Model

7. Maintenance

Toute nouvelle erreur introduite dans une API doit être ajoutée à ce catalogue avant sa mise en

production.

Les erreurs obsolètes doivent être conservées comme historiques et ne jamais être réutilisées.

5

8. Conclusion

Le API-ERROR-CATALOG constitue le référentiel officiel des codes d'erreur de Vitala.

Il garantit une gestion uniforme des erreurs, facilite le développement des applications clientes,

améliore le diagnostic des incidents et assure une cohérence durable entre tous les services de la

plateforme.

6

