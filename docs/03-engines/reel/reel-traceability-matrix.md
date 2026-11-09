# Réel V1 — matrice globale de traçabilité

**Projet :** Vitalis  
**Périmètre :** R-02 à R-06, A-01 à A-15, B-01 à B-03, C-01 à C-04 et P-01 à P-04.  
**Statut :** référence documentaire. Les exigences et scénarios sont définis ; implémentation et exécution des tests non vérifiées.  
**Référence normative :** [Spécification fonctionnelle Réel V1](./reel-engine.md) · [Roadmap V1–V3](./roadmap.md).

> **Complément normatif :** pour les bips, leur validité de 24 h, la reprise réseau et la clôture des mises en relation, consulter [Cycle de vie immédiat Réel V1](./reel-lifecycle-v1.md) et sa [traçabilité dédiée](./reel-lifecycle-traceability.md). Ces règles récentes prévalent sur toute formulation antérieure contradictoire, notamment les anciennes références à un historique de conversation conservé après clôture.

> Les scénarios ci-dessous sont des tests attendus, pas des tests dont l'existence ou l'exécution est attestée. Les chemins de tests réels restent à localiser ; aucun chemin n'est inventé.

## 1. Légende

| Statut | Sens |
| --- | --- |
| Décision validée | Règle produit explicitement approuvée. |
| Exigence à vérifier | Comportement technique nécessaire. |
| Test attendu | Scénario d'acceptation à localiser ou créer. |
| Non vérifié | Aucune preuve de code, de test ou de déploiement. |
| Ouvert | Détail technique restant à spécifier. |

## 2. Règles de base et Groupe A

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| R-02 — durées fixes 30 min, 1 h, 2 h, 3 h, 6 h, 12 h, 24 h ; expiration sans historique visible | Liste fermée, échéance serveur fiable, retrait du statut expiré | T-R02-01 chaque durée donne l'échéance attendue ; T-R02-02 durée libre rejetée ; T-R02-03 statut expiré invisible | Validée ; runtime non vérifié |
| R-03 — modifier ne renouvelle pas l'échéance | Conserver l'échéance initiale lors d'une modification | T-R03-01 modification conserve échéance ; T-R03-02 modification avant expiration ne prolonge pas | Validée ; runtime non vérifié |
| R-04 — présence active jusqu'à désactivation manuelle, même app fermée/inactive | Séparer présence et statut ; ne pas désactiver sur fermeture/inactivité | T-R04-01 fermeture conserve présence ; T-R04-02 désactivation retire présence ; T-R04-03 présence sans statut ne rend pas visible | Validée ; runtime non vérifié |
| R-05 — retrait auteur, acceptation/refus destinataire ; refus sans chat ; demande en attente sans expiration | Valider transitions serveur ; aucun chat après refus ; pas d'expiration implicite | T-R05-01 retrait auteur ; T-R05-02 acceptation/refus destinataire ; T-R05-03 refus sans chat ; T-R05-04 demande pending conservée ; T-R05-05 refus rétroactif impossible après acceptation | Validée ; runtime non vérifié |
| R-06 — un statut actif ; remplacement après confirmation explicite | Vérifier confirmation, propriété, version courante et atomicité | T-R06-01 sans confirmation rejeté ; T-R06-02 remplacement confirmé ; T-R06-03 échec conserve ancien ; T-R06-04 concurrence rejetée | Validée ; runtime non vérifié |
| A-01 — présence sans statut visible : profil absent de la découverte | Éligibilité exige présence ET statut visible valide | T-A01-01 présence seule masquée ; T-A01-02 présence et statut valide visibles | Validée ; runtime non vérifié |
| A-02 — ancien statut supprimé après remplacement confirmé | Suppression et création dans une transaction unique | T-A02-01 succès ne laisse qu'un statut ; T-A02-02 échec conserve l'ancien | Validée ; runtime non vérifié |
| A-03 — dernière publication seulement après confirmation et contrôle concurrence | Comparer état courant à l'état confirmé ; rejeter état obsolète | T-A03-01 état courant accepté ; T-A03-02 état modifié entre-temps rejeté | Validée ; runtime non vérifié |
| A-04 — blocage interrompt chat et interactions ; historique conservé | Refuser écritures, demandes et découverte ; maintenir lecture historique | T-A04-01 message après blocage refusé ; T-A04-02 historique consultable ; T-A04-03 nouvelles interactions bloquées | Validée ; runtime non vérifié |
| A-05 — délai 24 h après refus ou retrait | Cooldown calculé depuis l'événement serveur pour le même couple orienté | T-A05-01 demande avant 24 h refusée ; T-A05-02 demande après délai permise ; T-A05-03 retrait et refus déclenchent délai | Validée ; runtime non vérifié |
| A-06 — connexion acceptée active jusqu'à suppression volontaire ou blocage | État de connexion indépendant de l'activité de l'app | T-A06-01 fermeture app ne ferme pas connexion ; T-A06-02 suppression volontaire clôture | Validée ; runtime non vérifié |
| A-07 — confirmation obligatoire ; serveur vérifie propriétaire et état inchangé | Contrôle d'autorisation et de concurrence côté serveur | T-A07-01 non-propriétaire rejeté ; T-A07-02 sans confirmation rejeté ; T-A07-03 état obsolète rejeté | Validée ; runtime non vérifié |
| A-08 — nouveau statut et suppression ancien atomiques | Transaction unique et rollback complet | T-A08-01 succès ne laisse que le nouveau ; T-A08-02 panne restaure état précédent ; T-A08-03 aucun double statut observable | Validée ; runtime non vérifié |
| A-09 — cooldown commence à l'enregistrement serveur | Timestamp serveur autoritatif ; ignorer horloge client | T-A09-01 horloge client décalée sans effet ; T-A09-02 départ au timestamp serveur | Validée ; runtime non vérifié |
| A-10 — cooldown unidirectionnel demandeur→destinataire | Évaluer paire ordonnée ; ne pas bloquer le sens inverse | T-A10-01 demandeur initial bloqué ; T-A10-02 destinataire peut initier en sens inverse | Validée ; runtime non vérifié |
| A-11 — après blocage, chat immédiatement read-only, historique conservé | Retirer droits d'écriture, conserver lecture pour les deux | T-A11-01 écriture immédiatement refusée ; T-A11-02 historique lisible ; T-A11-03 message neutre affiché | Validée ; runtime non vérifié |
| A-12 — chaque partie peut terminer définitivement la connexion | Transition unilatérale terminale ; nouveau cycle demande/acceptation | T-A12-01 chaque partie peut terminer ; T-A12-02 ancienne connexion non réactivable ; T-A12-03 nouveau cycle crée nouvelle connexion | Validée ; runtime non vérifié |
| A-13 — une demande pending maximum entre deux personnes, quel que soit le sens | Contrainte serveur sur paire non ordonnée ; contrôle transactionnel | T-A13-01 demande inverse rejetée ; T-A13-02 demandes concurrentes sans doublon ; T-A13-03 retrait libère la paire | Validée ; runtime non vérifié |
| A-14 — blocage annule immédiatement toutes demandes pending | Blocage et annulation cohérents/atomiques ; interdire acceptation ultérieure | T-A14-01 demandes entrante et sortante annulées ; T-A14-02 course acceptation/blocage sans connexion résiduelle | Validée ; runtime non vérifié |
| A-15 — déblocage ne restaure pas connexion ; nouvelle demande requise | État blocage distinct de connexion ; historique read-only ; cooldown restant maintenu | T-A15-01 déblocage ne réactive pas chat ; T-A15-02 historique lisible ; T-A15-03 nouveau cycle ; T-A15-04 cooldown restant appliqué | Validée ; runtime non vérifié |

## 3. Groupe B — proximité, profil et localisation

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| B-01 — rayons 10, 25, 50, 100, 250, 500 m, 1 km max ; défaut 50 m ; mémoriser dernier choix ; aucun élargissement | Liste autorisée et plafond serveur ; préférence persistée | T-B01-01 valeurs permises ; T-B01-02 valeur inconnue ou >1 km rejetée ; T-B01-03 défaut 50 m ; T-B01-04 choix mémorisé ; T-B01-05 aucun élargissement | Validée ; runtime non vérifié |
| B-02 — profil intermédiaire ; visibilité indépendante des champs ; téléphone et GPS exact privés | Filtrage serveur champ par champ ; données privées absentes des payloads ; distance par plages | T-B02-01 toggles indépendants ; T-B02-02 téléphone absent ; T-B02-03 GPS exact absent ; T-B02-04 profil minimal utilisable | Validée ; runtime non vérifié |
| B-03.1 — GPS précis requis ; approximate-only ou refus masque profil mais conserve présence | Séparer présence et éligibilité localisation ; contrôler précision et permissions | T-B03-01 GPS précis rend éligible ; T-B03-02 approximate-only masque ; T-B03-03 refus GPS conserve présence | Validée ; runtime non vérifié |
| B-03.2 — arrière-plan selon capacités OS ; permission arrière-plan non obligatoire | Adaptation Android/iOS ; aucune promesse de suivi continu | T-B03-04 actualisation premier plan ; T-B03-05 refus arrière-plan n'empêche pas usage de base ; T-B03-06 restrictions OS respectées | Validée ; runtime non vérifié |
| B-03.3 — dernière position fiable tolérée 2 min max puis masquage | Cache éphémère TTL ≤120 s ; aucune persistance durable | T-B03-07 position avant 120 s acceptée ; T-B03-08 masquage après TTL ; T-B03-09 présence conservée ; T-B03-10 nouvelle position rétablit visibilité | Validée ; runtime non vérifié |
| B-03.4 — position exacte temporaire, sans historique | Minimiser stockage, logs et télémétrie ; ne pas journaliser coordonnées brutes | T-B03-11 inspection persistance ; T-B03-12 logs sans GPS exact ; T-B03-13 cache expiré inaccessible | Validée ; runtime non vérifié |

## 4. Groupe C — parcours utilisateur

### C-01 — consultation du profil

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| C-01.1 — nom, avatar, statut, champs facultatifs visibles et distance approximative | Réponse filtrée selon visibilité propriétaire ; distance arrondie | T-C01-01 champs principaux visibles ; T-C01-02 champ masqué non transmis ; T-C01-03 téléphone/GPS exact absents ; T-C01-04 distance approximative | Validée ; runtime non vérifié |
| C-01.2 — avant connexion, pas de chat direct ni accès privé | Autorisation serveur avant acceptation | T-C01-05 lecture conversation refusée ; T-C01-06 accès données privées refusé | Validée ; runtime non vérifié |

### C-02 — prise de contact

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| C-02.1 — bouton « Ça m'intéresse », sans message libre | Contrat de demande sans texte libre | T-C02-01 demande sans message ; T-C02-02 champ message non autorisé | Validée ; runtime non vérifié |
| C-02.2 — destinataire voit profil visible, statut, distance approximative | Réutiliser filtrage profil ; aucune donnée privée | T-C02-03 seuls champs autorisés transmis ; T-C02-04 distance non exacte | Validée ; runtime non vérifié |
| C-02.3 — in-app et push si autorisée ; pas de rappel ; pas d'expiration automatique | Respect préférences ; pas de job rappel/expiration | T-C02-05 notification in-app ; T-C02-06 push selon permission ; T-C02-07 aucun rappel ; T-C02-08 demande persistante | Validée ; runtime non vérifié |
| C-02.4 — pas de notification explicite de refus ; disparition UI et cooldown 24 h unidirectionnel | État refusé sans notification explicite ; cooldown serveur orienté | T-C02-09 demande disparaît ; T-C02-10 aucune notification de refus ; T-C02-11 cooldown dans le sens initial seulement | Validée ; runtime non vérifié |

### C-03 — conversation après acceptation

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| C-03.1 — conversation créée et accessible aux deux après acceptation ; aucun message automatique | Création idempotente liée à acceptation ; accès réservé aux deux | T-C03-01 conversation créée ; T-C03-02 deux participants autorisés ; T-C03-03 aucun message automatique | Validée ; runtime non vérifié |
| C-03.2 — chacun peut envoyer le premier message | Droits d'écriture symétriques tant que connexion active | T-C03-04 premier participant écrit ; T-C03-05 second participant écrit en premier | Validée ; runtime non vérifié |
| C-03.3 — texte seulement ; médias, fichiers et appels exclus en V1 | Validation serveur du type de contenu | T-C03-06 texte accepté ; T-C03-07 médias/fichiers/audio/vidéo/appels rejetés | Validée ; runtime non vérifié |
| C-03.4 — partage volontaire, ponctuel, confirmé, zone approximative ; pas de GPS exact ni live | Transformer en zone avant envoi ; pas de coordonnées brutes ou flux continu | T-C03-08 consentement requis ; T-C03-09 annulation n'envoie rien ; T-C03-10 zone approximative ; T-C03-11 GPS brut absent ; T-C03-12 pas d'update live | Validée ; runtime non vérifié |
| C-03.5 — notification in-app et push si autorisée ; aucun rappel | Respect préférences ; pas de relance périodique | T-C03-13 in-app ; T-C03-14 push autorisée ; T-C03-15 aucun rappel | Validée ; runtime non vérifié |
| C-03.6 — états envoyé/reçu/lu ; pas d'indicateur de saisie | États définis côté serveur ; aucun événement typing V1 | T-C03-16 envoyé après transmission ; T-C03-17 reçu quand disponible ; T-C03-18 lu après affichage ; T-C03-19 aucun indicateur de saisie | Validée ; runtime non vérifié |
| C-03.7 — message non modifiable ; auteur peut masquer chez lui ; copie destinataire conservée ; pas de suppression globale | Séparer masquage local et copie reçue ; politique de rétention distincte | T-C03-20 modification refusée ; T-C03-21 copie destinataire conservée ; T-C03-22 suppression globale impossible ; T-C03-23 rétention spécifiée avant livraison | Validée ; rétention ouverte |
| C-03.8 — max 1 000 caractères ; messages successifs ; seuils anti-spam ouverts | Validation longueur serveur ; limites de cadence à définir | T-C03-24 1 000 accepté ; T-C03-25 1 001 rejeté ; T-C03-26 messages successifs permis ; T-C03-27 seuils testés après arbitrage | Validée ; seuils ouverts |
| C-03.9 — signalement message/comportement, catégories prédéfinies ; pas de blocage automatique ; rapport privé | Endpoint protégé, accès modération contrôlé, séparation signalement/blocage | T-C03-28 signalement message ; T-C03-29 comportement ; T-C03-30 catégorie prédéfinie ; T-C03-31 pas de blocage automatique ; T-C03-32 rapport privé | Validée ; rétention/workflow ouverts |

### C-04 — fin d'interaction

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| C-04.1 — clôture commune ; retrait des deux emplacements ; communication désactivée ; aucun historique consultable | Transition terminale commune aux deux participants ; révocation des accès et traitement définitif du contenu conversationnel | T-C04-01 retrait Réel ; T-C04-02 retrait Notifications ; T-C04-03 messages refusés ; T-C04-04 historique non consultable | Décision produit validée ; runtime non vérifié |
| C-04.2 — clôture après confirmation explicite ; action commune et définitive | Confirmation avant clôture ; transition atomique et idempotente | T-C04-05 annulation conserve la relation ; T-C04-06 confirmation clôture pour les deux ; T-C04-07 aucune réactivation | Décision produit validée ; runtime non vérifié |
| C-04.3 — blocage confirmé ; demandes en attente annulées ; aucune nouvelle interaction | Blocage et clôture cohérents ; accès et communication révoqués | T-C04-08 confirmation requise ; T-C04-09 demandes annulées ; T-C04-10 communication refusée ; T-C04-11 aucune interaction permise | Décision produit validée ; runtime non vérifié |
| C-04.4 — déblocage sans restauration de l'ancienne mise en relation ; nouveau cycle requis | Séparer blocage, visibilité et nouvelle mise en relation ; aucune conversation antérieure restaurée | T-C04-12 déblocage depuis liste ; T-C04-13 ancienne relation absente ; T-C04-14 nouvelle demande/acceptation ; T-C04-15 cooldown restant | Décision produit validée ; runtime non vérifié |
| C-04.5 — clôture retire la relation active ; blocage empêche découverte et interaction réciproques | Séparer clôture, visibilité Réel et blocage ; aucun accès à l'ancienne relation | T-C04-16 relation retirée ; T-C04-17 accès ancien statut refusé ; T-C04-18 redécouverte après clôture seulement si éligible ; T-C04-19 blocage masque mutuellement | Décision produit validée ; runtime non vérifié |

## 5. Décisions transversales P-01 à P-04

| Décision | Exigence technique | Tests attendus | État |
| --- | --- | --- | --- |
| P-01 — information neutre après clôture ; aucun historique de conversation conservé ; motif de blocage non révélé | Informer de l'indisponibilité sans exposer les motifs internes ; aucun accès au contenu après clôture | T-P01-01 information cohérente ; T-P01-02 aucune révélation du motif ; T-P01-03 historique non consultable | Décision produit validée ; runtime non vérifié |
| P-02 — localisation partagée volontairement et ponctuellement sous forme approximative, jamais GPS exact | Conversion en zone avant transmission ; confirmation ; aucun suivi | T-P02-01 partage volontaire ; T-P02-02 zone seulement ; T-P02-03 coordonnées exactes absentes ; T-P02-04 aucun suivi | Validée ; runtime non vérifié |
| P-03 — auteur masque message chez lui ; copie destinataire conservée ; pas de suppression globale | Visibilité auteur distincte de la copie destinataire ; rétention serveur documentée séparément | T-P03-01 copie destinataire inchangée ; T-P03-02 suppression globale impossible ; T-P03-03 rétention documentée | Validée ; rétention ouverte |
| P-04 — statut expiré disparaît ; aucun historique visible ; traces techniques séparées | Expiration contenu ; journaux minimisés et rétention distincte | T-P04-01 statut expiré invisible ; T-P04-02 pas de réactivation ; T-P04-03 logs séparés ; T-P04-04 rétention documentée | Validée ; runtime non vérifié |

## 6. Exigences techniques transversales

| ID | Exigence | Décisions concernées | Contrôle attendu |
| --- | --- | --- | --- |
| T-API | Contrats explicites, validation serveur, transitions idempotentes | R/A/C | Revue contrats et tests d'intégration ; endpoints à localiser |
| T-DATA | Modèle cohérent présence/statut/demande/connexion/conversation/message/blocage/signalement | R/A/C | Revue schéma et migrations ; aucune table présumée |
| T-SEC | Autorisations serveur et RLS pour lecture/écriture | A/B/C/P | Tests positifs/négatifs par participant, tiers et bloqué |
| T-PRIV | GPS exact, téléphone, champs privés et rapports non exposés ; anti-triangulation | B/C/P | Inspection payloads, logs et RLS |
| T-RET | Rétention statut, messages, signalements et journaux définie | R-02/P-03/P-04/C-03.7/C-03.9 | Politique écrite et tests ; messages/signalements ouverts |
| T-MOD | Modération et protection anti-abus | C-03.8/C-03.9 | Seuils et workflow à spécifier |
| T-MOB | Permissions et limites Android/iOS | B-03 | Tests appareils réels ; pas de suivi continu promis |
| T-OFF | Reprise réseau, idempotence et conflits offline | C-03 et actions concernées | Tests réseau interrompu, reprise et doublons |
| T-COST | Limites requêtes, volume, localisation, push et messages | Tous | Mesures et plafonds V1 ; coûts non supposés |
| T-OBS | Observabilité sans données privées ni coordonnées brutes | B/C/P | Revue logs et tests de non-divulgation |

## 7. Registre des points ouverts et preuves manquantes

| ID | Sujet | Manque à résoudre | Liens |
| --- | --- | --- | --- |
| OUV-01 | Contrats API | Endpoints, payloads, erreurs, idempotence et autorisations | R/A/B/C |
| OUV-02 | Modèle de données | Tables, contraintes, index, relations et migrations réels | R/A/C |
| OUV-03 | RLS et sécurité | Politiques et tests négatifs d'isolation | A/B/C/P |
| OUV-04 | Expiration statut | Purge réelle et traces techniques associées | R-02/P-04 |
| OUV-05 | Rétention messages | Durée, sauvegardes, suppression ; aucun effacement serveur promis | C-03.7/P-03 |
| OUV-06 | Rétention signalements | Durée et accès modération | C-03.9 |
| OUV-07 | Anti-spam | Seuils de cadence, fenêtres et réponses | C-03.8 |
| OUV-08 | Anti-triangulation | Granularité, fréquence et requêtes répétées | B-02/B-03 |
| OUV-09 | Payload localisation partagée | Définition zone, précision maximale et disponibilité | C-03.4/P-02 |
| OUV-10 | Localisation mobile | Comportement Android/iOS, permissions, batterie et arrière-plan | B-03 |
| OUV-11 | TTL 120 secondes | Cache éphémère, invalidation et non-persistance | B-03.3 |
| OUV-12 | Offline et reprise | Mise en attente, idempotence, conflits et synchronisation | C-03/T-OFF |
| OUV-13 | Coûts V1 | Mesures requêtes, stockage, push, localisation et plafonds | T-COST |
| OUV-14 | Preuve d'implémentation | Localiser code, tests, CI et preuve de déploiement | Toutes |
| OUV-15 | Modération | Catégories, workflow, accès et délais de revue | C-03.9/T-MOD |

## 8. Familles de tests à localiser ou créer

| Famille | Couverture |
| --- | --- |
| Unitaires | Durées, transitions, cooldown, distance, validation messages |
| Intégration/API | Statut, demande, acceptation/refus/retrait, chat, partage zone |
| Concurrence | Remplacement atomique, demande bidirectionnelle, blocage vs acceptation |
| RLS/sécurité | Isolation utilisateurs, historique, interdiction d'écriture |
| Confidentialité | Payloads, logs, GPS, téléphone, champs privés, anti-triangulation |
| Mobile | Permissions, arrière-plan, perte signal, TTL 120 s |
| Offline/sync | Reprise, doublons, idempotence, conflits |
| Modération/anti-abus | Signalement, confidentialité rapport, cadence |
| Coûts/observabilité | Requêtes, volume, logs sans données sensibles |

Les identifiants de scénarios sont uniques et stables. Quand un test sera localisé, ajouter son chemin réel et le lien CI/rapport. Un test écrit mais non exécuté reste « à exécuter » ; un résultat sans preuve accessible reste « à confirmer ».

## 9. Parcours d'entrée Home et navigation

Cette famille complète la matrice Réel pour couvrir le point d'entrée global de Vitalis. Elle ne modifie pas les règles métier Réel.

| ID exigence | Règle / exigence | Scénarios de test attendus | État |
| --- | --- | --- | --- |
| HOME-01 | Première utilisation : onboarding avant Home explicative | T-HOME-01 première ouverture affiche onboarding ; T-HOME-02 onboarding non terminé reste prioritaire au retour | Décision produit clarifiée ; runtime non vérifié |
| HOME-02 | Home explicative après onboarding | T-HOME-03 fin d'onboarding affiche Home explicative | Décision produit clarifiée ; runtime non vérifié |
| HOME-03 | L'action de poursuite ouvre l'identification existante | T-HOME-04 CTA ouvre le parcours existant ; T-HOME-05 annulation/échec ne simule pas une identification réussie | À vérifier sans modifier Auth |
| HOME-04 | Succès d'identification redirige vers Home interactive | T-HOME-06 succès confirmé ouvre Home interactive ; T-HOME-07 état incomplet ou refusé ne l'ouvre pas | Décision produit clarifiée ; runtime non vérifié |
| HOME-05 | L'icône de l'application ramène à Home selon l'état | T-HOME-08 utilisateur non identifié revient à Home explicative ; T-HOME-09 utilisateur identifié revient à Home interactive | Décision produit clarifiée ; runtime non vérifié |
| HOME-06 | Home interactive expose les accès Réel, Flash, Scan, Radar et catégories | T-HOME-10 chaque accès ouvre sa destination prévue ; menu 2x2 ouvre les espaces secondaires | Câblage runtime non vérifié |
| HOME-07 | Home et Réel restent distincts | T-HOME-11 route `/` ne rend pas le moteur Réel ; accès Réel ouvre sa destination dédiée | Route Réel à confirmer ; runtime non vérifié |

**Règles de preuve :** ces identifiants sont des scénarios attendus. Ils ne signifient pas que les tests existent, qu'ils ont été exécutés ou que les parcours sont livrés. Le parcours d'identification demeure celui déjà défini dans le produit ; cette matrice ne crée aucune exigence d'authentification supplémentaire.

## 10. Conditions de clôture

- [x] Décisions R/A/B/C/P connues représentées.
- [x] Exigences techniques séparées des décisions produit.
- [x] Scénarios dotés d'identifiants uniques.
- [x] Sujets ouverts et preuves manquantes explicités.
- [ ] Contrats API, données et RLS rapprochés du runtime.
- [ ] Fichiers de tests réels localisés et liés.
- [ ] Scénarios exécutés et résultats vérifiés.
- [ ] Contraintes mobiles, offline, confidentialité et coûts vérifiées.

**Conclusion :** la couverture documentaire est consolidée. La conformité du runtime et l'exécution des tests restent à démontrer. Cette matrice ne ferme aucun ticket TECH et ne vaut pas validation de livraison.
