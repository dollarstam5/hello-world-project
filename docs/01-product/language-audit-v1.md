# Audit du langage humain — V1

**Statut :** premier relevé d'audit — documentation de travail, non exhaustive.  
**Périmètre de cette passe :** accueil, onboarding, navigation, centre de communication, catalogue FR/EN, Flash, Scan et Assistant.  
**Règle :** aucun texte ne doit promettre une capacité qui n'est pas réellement disponible.

## 1. Référence éditoriale

Le document canonique reste [Langage humain et communication Vitalis](./communication-language.md). Cet audit le traduit en contrôles concrets sur les textes réellement présents dans le dépôt.

Chaque texte doit :

- être compris immédiatement, sans jargon inutile ;
- expliquer la situation et la prochaine étape lorsqu'il y en a une ;
- respecter la personne, sans ton infantilisant ni enthousiasme forcé ;
- rester exact par rapport à l'état réel de l'action et aux capacités V1 ;
- être rédigé naturellement dans les deux langues, sans traduction mot à mot ;
- être géré par le catalogue i18n, jamais écrit en dur dans un composant.

## 2. Constats prioritaires

| Priorité | Emplacement / clé                                                              | Constat                                                                                                                                                                 | Orientation proposée                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1       | `common.empty.desc`                                                            | « Cet espace est encore calme. Revenez bientôt. » / “This space is still quiet. Come back soon.” est artificiel et pousse à revenir sans raison utile.                  | « Rien à afficher pour le moment. » / “Nothing to show here yet.”                                                                                                                                      |
| P1       | `common.error`, `common.error.desc`                                            | « Une pause inattendue » et « Réessayez doucement » ne disent pas clairement ce qui s'est passé. L'anglais “An unexpected pause” / “Try again gently” a le même défaut. | Titre : « Un problème est survenu. » / “Something went wrong.” Description : « Nous n'avons pas pu terminer. Vous pouvez réessayer. » / “We couldn't complete that. You can try again.”                |
| P1       | `flash.composer.publish`, `flash.composer.signIn`                              | « Diffuser » / “Broadcast” décrit le mécanisme plutôt que le geste attendu.                                                                                             | Préférer « Publier » / “Post” (à confirmer avec le vocabulaire produit Flash).                                                                                                                         |
| P1       | `flash.feed.error`                                                             | « Flux distant indisponible » expose une notion technique et ne guide pas la personne.                                                                                  | « Nous n'avons pas pu actualiser les Flash. Voici ceux déjà disponibles. » / “We couldn't refresh Flash. Here's what is already available.”                                                            |
| P1       | `assistant.signInRequired`                                                     | « Je vous répondrai en direct » / “I will answer you live” promet un mode de réponse qui peut être compris comme une disponibilité ou une capacité garantie.            | « Connectez-vous pour poser votre question à Vita. » / “Sign in to ask Vita a question.”                                                                                                               |
| P1       | `communication.title`, `communication.open`                                    | « Communications » / “Communications” et « Ouvrir les communications » sont froids et institutionnels.                                                                  | Rechercher un titre court qui couvre les quatre onglets sans laisser croire à une messagerie libre. Proposition de travail : « Votre espace de suivi » / “Your updates”. À valider avant remplacement. |
| P2       | `home.engine.reel.desc`, `home.engine.radar.desc`                              | « Cet espace se prépare » / “This space is taking shape” est vague alors que les cartes sont cliquables.                                                                | Vérifier d'abord l'état fonctionnel réel de chaque espace. Ne pas annoncer une capacité disponible ni masquer une page encore en construction.                                                         |
| P2       | `onboarding.intro.title`, `onboarding.intro.moreBody`, `onboarding.ready.body` | Quelques formulations sont génériques (« tout un monde à découvrir », « une expérience qui vous ressemble », « toute l'expérience vous attend ») et se répètent.        | Raccourcir et expliquer concrètement ce que la personne peut faire dès maintenant.                                                                                                                     |
| P2       | `scan.privacy` et erreurs de position                                          | Le texte est rassurant, mais toute promesse sur la durée ou l'affichage de la position doit être vérifiée contre le comportement réel et les permissions.               | Audit fonctionnel nécessaire avant reformulation.                                                                                                                                                      |
| P2       | `offline.banner.desc`, clés `sync.*`                                           | « synchronisées », « synchronisation » et « en attente du réseau » sont compréhensibles mais techniques selon le contexte.                                              | Préférer « gardées sur cet appareil » et « envoyées dès que le réseau revient », uniquement lorsque cela décrit exactement l'état.                                                                     |

## 3. Vérifications de cohérence déjà faites

- Le composant d'onboarding présente bien cinq étapes et utilise le catalogue i18n.
- L'accueil présente quatre cartes de moteurs et le menu 2×2 ; les textes de Réel et Radar doivent être confrontés à leur état d'implémentation.
- Le centre de communication affiche les quatre onglets dans l'ordre prévu : Notifications, Assistant, Messages, Réel/Live.
- Les textes d'erreur Flash affichent actuellement la valeur d'erreur renvoyée par le hook ; le message est localisé dans le hook, mais le composant ne doit jamais exposer une erreur technique brute.
- Le composant Scan présente des erreurs distinctes pour permission refusée, position indisponible, délai dépassé et erreur inconnue. Les messages doivent rester explicatifs et proposer une action adaptée.
- L'écran de secours `src/lib/error-page.ts` est actuellement rédigé uniquement en anglais et fixe `lang="en"`. Il échappe au catalogue i18n normal et doit être traité comme un cas spécifique.
- Le catalogue central contient des libellés d'administration. Ils doivent aussi être audités, même s'ils ne font pas partie du parcours principal.

## 4. Points à ne pas modifier sans vérification métier

1. Ne pas remplacer « Réel » par « Live » en français. En anglais, le nom produit prévu est « Live ».
2. Ne pas remplacer automatiquement « En attente » : ce libellé peut être exact pour un état métier, mais trop vague pour une action utilisateur. Le contexte détermine le choix.
3. Ne pas affirmer qu'une action est envoyée, enregistrée ou confirmée tant que le système n'a pas confirmé cet état.
4. Ne pas annoncer une intelligence conversationnelle adaptative en V1. Les dialogues V1 restent courts et déterministes ; l'adaptation libre et la voix restent V2/V3.
5. Ne pas inventer de notifications, de compteurs, de conversations ou de présences pour rendre les écrans plus vivants.

## 5. Prochaine passe d'audit

Poursuivre le relevé sur :

- Réel, Radar, 2×2, profil et identité ;
- notifications, messages, permissions et états de connexion ;
- états de chargement, vide, erreur, réussite, attente et reprise hors ligne ;
- parcours d'inscription, connexion et récupération du compte ;
- interface d'administration visible ;
- cohérence complète des clés et du sens FR/EN.

Chaque correction sera reliée à une clé i18n et à son écran. Les textes dont la justesse dépend d'une règle métier seront marqués « à confirmer » plutôt que modifiés sur une supposition.

## 6. Limites de cette livraison

Cette passe est un audit éditorial et de cohérence, pas une preuve de conformité fonctionnelle. Aucun composant, comportement applicatif, contrat de données ou texte de production n'est modifié par ce document. Les propositions sont des pistes de rédaction à valider avant leur application au code.

## 7. Correction importante — formulation de confidentialité de Scan

L'inspection du contrat Scan confirme que l'écran obtient la latitude et la longitude de l'appareil, puis les transmet au serveur dans ScanQuery pour rechercher des Flash publics dans un rayon donné. Les résultats publics ne renvoient pas les coordonnées précises de leurs auteurs, mais le service reçoit bien la position temporaire de la personne qui lance la recherche.

Les formulations actuelles « sans partager votre position » dans les descriptions Scan sont donc trop absolues et peuvent induire en erreur. Préférer, après validation du traitement serveur :

- FR : « Utilisez votre position pour trouver les Flash actifs autour de vous. Votre position précise n'est pas affichée aux autres personnes. »
- EN : « Use your location to find active Flash nearby. Your precise location is not shown to other people. »

Ne pas remplacer ces textes dans le code tant que le traitement serveur complet et la durée de conservation éventuelle n'ont pas été vérifiés. En particulier, ne pas promettre que la position n'est jamais transmise ou conservée sans preuve technique.
