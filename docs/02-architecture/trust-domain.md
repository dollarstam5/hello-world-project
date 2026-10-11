# Domaine Trust et Trust Engine

**Statut :** consolidation documentaire d'une architecture cible ; implémentation à vérifier.  
**Responsabilité principale :** produire des informations de confiance à partir de preuves validées, de façon traçable et explicable.

## 1. Frontière du domaine

Le domaine Trust est l'autorité métier pour les données de confiance. Les autres domaines peuvent fournir des événements ou des preuves, mais ne modifient jamais directement le score, le niveau ou l'historique Trust. L'interface et l'UDI ne font que présenter une vue produite par Trust.

Chaîne de responsabilité cible :

`Domaines métier → événements / preuves → Trust Engine → Trust View → UDI / API → interface`

Cette chaîne décrit la responsabilité attendue ; elle ne certifie pas que tous ces composants sont actuellement présents dans le dépôt.

## 2. Principes

Le Trust Engine doit être :

- **explicable** : une évolution possède une raison lisible ;
- **traçable** : les événements et décisions sont historisés ;
- **réversible** : une erreur peut être corrigée sans effacer l'audit ;
- **progressif et contextuel** : une action isolée ne définit pas toute la fiabilité ;
- **protecteur** : il contribue à la sécurité sans juger la valeur d'une personne ;
- **résistant aux abus** : les preuves et recommandations sont contrôlées ;
- **respectueux de la vie privée** : la visibilité dépend du rôle et du contexte.

Le Trust Engine n'est ni une note de popularité, ni un jugement moral, ni une décision automatique qui retire aux personnes tout choix.

## 3. Événements et preuves

Les sources historiques proposent plusieurs familles d'événements :

- vérification d'identité ;
- activité dans la plateforme ;
- collaboration ou mission terminée et confirmée ;
- qualité des interactions ;
- recommandations et validations communautaires ;
- signalements confirmés ;
- ancienneté et régularité.

Un événement de confiance devrait préciser au minimum son identifiant, sa source, sa catégorie, sa date, son objet métier de référence, son statut de validation, sa justification et sa traçabilité. Les poids et règles de calcul doivent être versionnés et testables. Les valeurs exactes ne sont pas définies par cette consolidation.

Un événement fourni par un autre domaine est une preuve candidate, pas une modification directe du Trust. Les signalements non confirmés ne doivent pas être traités comme des faits établis.

## 4. Calcul et évolution

Les sources historiques envisagent une pondération tenant compte de la nature, de la fiabilité, de la gravité, de l'ancienneté et du contexte. Elles évoquent aussi le vieillissement de certaines preuves et la possibilité de recalculer le résultat lorsque les règles évoluent.

Ces éléments restent des exigences de conception tant que les fonctions de calcul, les règles versionnées, les tests et les migrations correspondantes n'ont pas été vérifiés. Aucun poids numérique ni seuil métier n'est inventé ici.

## 5. Historique et correction

La cible conserve les événements originaux. En cas d'erreur, une correction ou une annulation liée à l'événement initial est ajoutée, puis le résultat courant est recalculé. L'historique ne doit pas être silencieusement réécrit.

Les personnes doivent disposer d'une explication adaptée et d'un mécanisme de contestation ou de correction proportionné à l'impact. Les détails qui révéleraient des informations sensibles de sécurité peuvent rester réservés aux services autorisés, selon une politique documentée.

## 6. Trust Profile et Trust View

Le **Trust Profile** est une synthèse interne du résultat et de son évolution. La **Trust View** est une projection destinée aux consommateurs autorisés ; elle peut inclure le niveau actuel, les badges, une progression synthétique et les facteurs explicables qui peuvent être divulgués.

La Trust View ne doit pas exposer par défaut les données brutes, les signalements sensibles, les pondérations internes ou les informations d'autres personnes. Les champs effectivement exposés doivent être spécifiés dans les contrats API et validés par les contrôles d'accès.

## 7. Consommateurs et producteurs

Les sources historiques citent Flash, Scan, Radar, Veille, Recommendation, les missions, la modération et l'UDI comme producteurs d'événements ou consommateurs de vues. Ces dépendances doivent respecter les frontières métier :

- les domaines sources publient des événements ou preuves ;
- Trust valide et décide de leur effet ;
- Trust publie les vues et changements pertinents ;
- l'UDI agrège la vue sans devenir propriétaire des données Trust ;
- l'interface présente les informations autorisées sans recalculer Trust.

Les noms d'événements et endpoints des documents API historiques sont des contrats proposés, pas des endpoints actifs confirmés par ce document.

## 8. État observé dans le dépôt

La migration `src/supabase/migrations/20260912000000_protect_identity_trust_system_fields.sql` borne `profiles.trust_score` entre 0 et 100 et limite `udi.level` à `guest`, `identified`, `verified` et `trusted`. Elle protège également certains champs système contre les modifications directes par les utilisateurs authentifiés.

Cette preuve confirme des champs et contraintes, mais pas l'implémentation complète du modèle historique. Avant de déclarer le Trust Engine opérationnel, il faut vérifier séparément :

- le stockage et l'historique des preuves ;
- le producteur et la version des règles de calcul ;
- les mécanismes de recalcul, d'expiration et de correction ;
- les endpoints réellement exposés ;
- les politiques RLS et la visibilité des vues ;
- les tests fonctionnels, de sécurité et d'audit.

## 9. Sécurité et gouvernance

Aucun client ne doit pouvoir écrire directement un Trust Score ou un niveau dérivé. Les changements doivent passer par les mécanismes autorisés du domaine Trust. Les permissions de lecture sont limitées au propriétaire, aux consommateurs explicitement autorisés et aux rôles d'administration prévus.

Les règles de pondération, les motifs sensibles et les décisions de modération nécessitent une gouvernance spécifique. Les changements de modèle doivent être versionnés, évalués contre des cas de test et auditables.

## 10. Sources historiques

Cette référence consolide la philosophie, le fonctionnement, le Trust Profile et les mises à jour d'intégration UDI présentes dans les fichiers historiques `03A-VITALA-TRUST-ENGINE-V1 Partie 1/2/3.md` et la mise à jour d'intégration UDI. Ces fichiers sont conservés pendant la migration ; aucune suppression n'est autorisée par cette consolidation.
