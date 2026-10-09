15-VITALA-DATABASE-V1.md

Version : V1

Statut : Référence officielle de la base de données Vitala

Type : Architecture Data Model

1. Objectif

Ce document définit la structure complète de la base de données de Vitala.

Il sert de pont entre :

•

le Domain Model

•

les API Contracts

•

l’architecture système

Il garantit une cohérence totale entre les domaines métier et leur persistance.

2. Principes fondamentaux

La base de données Vitala repose sur les principes suivants :

2.1 Domain First

Chaque domaine possède ses propres données.

Aucune table ne doit être partagée sans raison explicite.

2.2 Single Source of Truth

Chaque donnée a un propriétaire unique.

Aucune duplication de vérité entre domaines.

2.3 Offline First Compatibility

Le modèle doit supporter :

•

synchronisation différée

•

conflits potentiels

•

opérations locales (via client)

1

2.4 Security by Design (RLS)

Toutes les tables sont protégées par des politiques RLS strictes.

2.5 Event Ready

Les modifications doivent pouvoir être traduites en événements exploitables par les moteurs (Radar,

Trust, Recommendation).

3. Architecture globale

                    Unified Digital Identity (UDI)

                                │

 ┌──────────────┬───────────────┼───────────────┬──────────────┐

 │              │               │               │              │
Flash         Mission         Trust          Media        Settings

 │              │               │               │              │

 └──────────────┴───────────────┴───────────────┴──────────────┘

                                │
                Intelligence Layer (Read-Only)

        ┌──────────────┬──────────────┬──────────────┐

        │              │              │              │
     Radar         Veille     Recommendation     Search

                                │
                        Infrastructure

     Auth | Sync | Audit | Notifications | System Events

4. DOMAINES MÉTIER

4.1 UDI (Unified Digital Identity)

Tables

•

udi_profile

•

udi_identity

•

udi_capabilities

•

udi_preferences

•

udi_privacy

•

udi_activity

•

udi_projection

2

Rôle

Cœur du système d’identité utilisateur.

4.2 Flash Domain

Tables

•

flash

•

flash_attachment

•

flash_tag

•

flash_visibility

•

flash_reaction

•

flash_comment

Rôle

Contenu rapide et contextuel utilisateur.

4.3 Mission Domain

Tables

•

mission

•

mission_application

•

mission_member

•

mission_stage

•

mission_activity

•

mission_message

Rôle

Gestion des objectifs et collaborations.

4.4 Trust Domain

Tables

•

trust_score

•

trust_event

•

trust_evidence

•

trust_history

•

trust_model_version

Rôle

Évaluation dynamique de la confiance.

3

5. DOMAINES D’INTELLIGENCE (READ-ONLY)

5.1 Radar

•

radar_detection

•

radar_match

•

radar_signal

5.2 Veille

•

veille_signal

•

veille_subscription

•

veille_digest

5.3 Recommendation

•

recommendation

•

recommendation_feedback

•

recommendation_context

5.4 Search

•

search_query

•
•

search_result
search_projection

6. SHARED SERVICES

6.1 Media

•

media_file

•

media_variant

•

media_metadata

•

media_access_log

4

6.2 Notifications

•

notification

•
•

notification_delivery
notification_preference

•

notification_template

6.3 Settings

•

setting

•

setting_value

•

setting_audit

7. INFRASTRUCTURE

7.1 Auth

(Géré par Supabase Auth)

•

auth.users (externe)

7.2 Sync System

•

sync_operation

•
•

sync_checkpoint
sync_conflict

7.3 Audit & System

•

audit_log

•

system_event

•

api_request_log

8. OFFLINE FIRST ARCHITECTURE

Le système Offline repose sur :

5

Côté client uniquement :

•

Local Workspace

•
•

Drafts
Outbox

•

Cache

•

Pending Operations

Côté serveur :

•

sync_operation

•

sync_checkpoint

•

sync_conflict

9. SECURITY (RLS)

Toutes les tables respectent :

•

ownership par user_id (via UDI)

•

isolation stricte des données

•

accès contrôlé par domaine

Chaque domaine définit ses propres règles RLS.

10. PERFORMANCE

La base doit supporter :

•

index sur user_id

•

index sur created_at

•

index sur domain

•

index sur status (sync)

•

full-text search sur contenu Flash et Mission

11. NAMING CONVENTION

Toutes les tables respectent :

•

prefix domaine (udi_, flash_, mission_, etc.)

•

snake_case uniquement

•

timestamps obligatoires :

•

created_at

6

•

updated_at

12. MIGRATION STRATEGY

•

migrations versionnées

•

backward compatible

•

jamais de breaking change direct

•

extension progressive des tables

13. DATABASE GOVERNANCE

Chaque table doit avoir :

•

un domaine propriétaire

•

une API associée

•

une règle RLS définie

•

une logique métier claire

Aucune table ne peut exister sans propriétaire métier.

14. EVOLUTION FUTURE

Prévu pour V2 :

•

Event Sourcing avancé

•

Materialized Views pour intelligence engines

•

Partitioning par domaine

•

Multi-region scaling

•

Read replicas pour Search et Recommendation

15. CONCLUSION

Cette base de données constitue la fondation persistante de Vitala.

Elle garantit :

•

cohérence des domaines

•

sécurité des données

•

compatibilité Offline First

•

évolutivité long terme

7

