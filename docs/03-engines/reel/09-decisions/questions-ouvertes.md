# Questions ouvertes — Réel

## Priorité 1 — cycle de vie
1. Quel événement démarre les 24 h d'un bip ?
2. L'émetteur peut-il annuler un bip ?
3. Quel est le comportement exact d'un refus ?
4. Une mise en relation acceptée expire-t-elle si elle n'est pas clôturée ?
5. Que se passe-t-il si la présence est désactivée pendant une mise en relation ?
6. Que se passe-t-il si le statut expire pendant une mise en relation ?

## Priorité 2 — intention et découverte
7. Longueur maximale et formats de l'intention ?
8. Catégories structurées ?
9. Rayon par défaut et paliers entre 100 m et 1 km ?
10. Règles de chevauchement et seuil de regroupement ?
11. La prévisualisation de trois avatars maximum est-elle confirmée ?

## Priorité 3 — sécurité
12. Limites anti-spam pour les bips ?
13. Blocage, signalement et effets sur les relations existantes ?
14. Règles de modération ?
15. Informations de profil visibles avant/après acceptation ?

## Priorité 4 — communication
16. Types de communication autorisés ?
17. Le texte seul est-il confirmé en V1 ?
18. Catalogue des notifications ?
19. Parcours de clôture si l'autre participant est hors ligne ?

## Priorité 5 — historique, archivage et stockage

Décisions déjà validées :
- Conversation archivée après 3 mois ou dès dépassement du plafond de 50 conversations conservées (la plus ancienne est archivée).
- Archive inaccessible à l'utilisateur sauf autorisation administrateur sur demande, pendant 24 h.
- Archive conservée 6 mois à compter de son archivage, puis suppression définitive prévue.
- L'utilisateur peut supprimer son historique ; aucun export.
- Aucun paiement en V1 ; extensions et micro-paiements réservés à V2.

Propositions à valider :
1. Quotas logiques par compte : Profil/avatar 2 Mo (avatar ≤ 500 Ko), Réel 5 Mo, Flash 3 Mo, Scan 1 Mo, Radar 1 Mo, Notifications 1 Mo, données communes 2 Mo ; total 15 Mo.
2. Garde-fous globaux Supabase Free : DB 350 Mo/500 Mo ; fichiers 700 Mo/1 Go ; egress cache et non-cache 3,5 Go/5 Go chacun ; Realtime 1,4 M/2 M messages ; 140/200 connexions.
3. Alertes à 50 %, limitation des opérations non essentielles à 65 %, arrêt des nouvelles écritures non indispensables à 70 %.
4. Confirmer si le budget logique par compte doit être identique pour tous les utilisateurs ou ajusté selon les besoins d'accessibilité et d'usage.

Points techniques à préciser :
- Mesure exacte du stockage attribuable à chaque compte/espace (données, index, médias, métadonnées).
- Effacement effectif des archives et délais éventuels des sauvegardes.
- Comportement en cas de plafond global atteint : protection des données, mode lecture seule ciblé, reprise au prochain cycle.
- Vérification périodique des quotas, tarifs et règles de pause du plan Supabase Free.

## Priorité 6 — technique et données
24. Durée de conservation des traces techniques minimales ?
25. Rôles autorisés à consulter les traces ?
26. Précision et fréquence de localisation ?
27. Comportement en cas de perte de permission ?
28. Contrats API, tables, index et règles d'accès ?
29. Stratégie d'idempotence et autorité serveur en cas de conflit ?

## Priorité 7 — UX et validation
30. Libellés définitifs des deux emplacements et de l'historique ?
31. États/animations d'acceptation ?
32. États vides, chargement, erreur et hors ligne ?
33. Scénarios constituant le seuil d'acceptation V1 ?

Chaque réponse doit être enregistrée avec ID de décision, statut, date, exigences et tests impactés. Aucune question ouverte ne doit être résolue par supposition.

## Priorité 5 — archivage, suppression et coûts (décisions déjà validées, détails ouverts)

- Les conversations sont archivées après 3 mois ou dès dépassement du plafond de 50 (la plus ancienne est archivée).
- Une archive est inaccessible à l'utilisateur, sauf accès exceptionnel autorisé par un administrateur pour 24 h après demande.
- L'utilisateur peut supprimer son historique ; aucun export n'est proposé.
- En V1, chaque espace a un plafond gratuit ; à saturation, l'utilisateur choisit de supprimer des données ou de limiter les nouveaux usages/enregistrements.
- Aucun paiement ni extension payante en V1 ; micro-paiements et stockage supplémentaire réservés à V2.

Questions restant à trancher :
1. Combien de temps conserver une archive après son archivage ?
2. Quel délai appliquer à l'effacement définitif après suppression par l'utilisateur ?
3. Quels quotas chiffrés gratuits attribuer à chaque espace et quels seuils d'avertissement afficher ?
4. Quel plafond global et quelle marge de sécurité définir pour Supabase Cloud ?
5. Quelle procédure d'autorisation administrateur, avec journalisation et contrôle d'accès, mettre en place ?


