# Recommendation — tests, sécurité et gouvernance

## 1. État des tests

Aucun test dédié Recommendation n'a été identifié dans l'arborescence de la branche. Les scénarios suivants constituent la base d'acceptation avant mise en service.

## 2. Tests fonctionnels

- Une recommandation est créée uniquement pour un destinataire déterminé.
- Une proposition sans justification ou provenance suffisante est écartée.
- Les doublons d'une même ressource sont fusionnés ou supprimés selon une règle documentée.
- L'ordre de classement est stable pour un même jeu de données et une même version de règle.
- La diversité et les plafonds de fréquence sont appliqués.
- Les recommandations expirées ne sont plus visibles.
- Une réaction ne modifie pas la ressource source.
- Une acceptation n'exécute pas automatiquement l'action proposée.
- Un signalement est conservé et accessible au processus de revue prévu.

## 3. Tests d'autorisation et de confidentialité

Créer des utilisateurs A et B, ainsi qu'un opérateur autorisé/non autorisé.

- A ne peut pas lister ni lire les recommandations de B.
- A ne peut pas réagir à une recommandation de B.
- Une référence source privée ou révoquée est retirée avant affichage.
- Les explications ne divulguent pas les attributs sensibles de tiers.
- Les données Trust ou autres données sensibles ne sont pas consommées sans finalité/autorisation documentée.
- Les accès administratifs sont limités, justifiés et audités.
- Les identifiants opaques ne permettent pas d'énumérer les ressources source.

## 4. Tests de fraîcheur et de robustesse

- Signal source en retard ou hors ordre.
- Signal source dupliqué.
- Signal source supprimé ou expiré.
- Échec partiel d'un connecteur.
- Source indisponible.
- Rejeu d'un événement.
- Recalcul avec une nouvelle version de classement.
- Ressource source modifiée entre calcul et affichage.
- Ressource source révoquée entre affichage et action.
- Recommandations concurrentes pour la même cible.

Un échec de connecteur ne doit pas être présenté comme une absence d'opportunité : le statut de couverture doit être explicite.

## 5. Tests d'idempotence et de cycle de réaction

- Double save ne crée pas deux enregistrements actifs.
- Double accept ne déclenche pas deux fois une action aval.
- Dismiss répétée reste idempotente.
- Report répété est dédupliqué selon une clé et une fenêtre définies.
- Une réaction d'un autre utilisateur est rejetée.
- La règle d'annulation/réversibilité des réactions est définie et testée.

## 6. Gouvernance du classement

Avant d'activer un score :
- documenter son échelle et sa signification ;
- publier les familles de signaux et leur finalité ;
- versionner les poids/règles ;
- vérifier calibration et dérive ;
- analyser les biais et effets d'exclusion ;
- contrôler la diversité et la concentration d'exposition ;
- offrir une explication intelligible ;
- permettre la correction ou le signalement d'une proposition inadaptée.

Ne pas optimiser uniquement les clics, l'acceptation ou le temps passé. Une recommandation peut être utile sans être cliquée ; une forte interaction ne prouve pas sa pertinence.

## 7. Mesures opérationnelles

Suivre : volume de candidats, taux d'éligibilité, filtrage permission, doublons, latence pipeline, erreurs de source, taux d'expiration, exposition par source/type, fréquence par utilisateur, sauvegardes, acceptations, masquages, signalements et délai de retrait.

Les métriques doivent être agrégées et minimisées. Les dashboards ne doivent pas devenir un moyen de reconstituer les préférences sensibles d'une personne.

## 8. Checklist avant activation

- [ ] Domaine, modèle et tables créés et revus.
- [ ] Contrat d'API versionné et réellement déployé.
- [ ] RLS testée avec plusieurs destinataires.
- [ ] Connecteurs sources explicitement autorisés et versionnés.
- [ ] Règles de classement et de diversité documentées.
- [ ] Explication et provenance présentes pour chaque résultat.
- [ ] Révocation de permission propagée.
- [ ] Réactions idempotentes et sans mutation source implicite.
- [ ] Tests fonctionnels, sécurité, charge et reprise exécutés.
- [ ] Politique de rétention, suppression et gouvernance publiée.
- [ ] Outils de supervision et de signalement opérationnels.
