# Catalogue de communication Vitalis — V1

**Statut :** catalogue initial de référence ; textes à valider en contexte d'écran.  
**Règle :** les messages sont localisés et sélectionnés par le système central. Les composants ne réécrivent pas ces textes en dur.

## 1. Convention

Les règles complètes de déclenchement, de priorité, de fréquence, de sécurité, de maturité et d'évolution V1–V3 sont définies dans la [gouvernance du système de communication](./communication-system-governance-v1-v3.md). Le catalogue ne constitue jamais une source d'événements métier.

Chaque entrée possède une clé stable, une intention, une priorité, un contexte d'affichage et ses variantes FR/EN. Les exemples sont une base éditoriale : ils ne doivent être affichés que si l'événement ou l'état est réel.

Une variable absente déclenche une variante sans variable, jamais un texte incomplet.

## 2. Accueil et retour

| Clé | Contexte | FR | EN |
|---|---|---|---|
| welcome.first | Première ouverture | Bonjour ! Bienvenue chez Vitalis. | Hello! Welcome to Vitalis. |
| welcome.guest | Accueil invité | Bonjour ! Vous pouvez découvrir Vitalis tranquillement. | Hello! Take your time exploring Vitalis. |
| welcome.member | Nom d'affichage déjà disponible | Bonjour, {displayName}. Heureux de vous retrouver. | Hello, {displayName}. Good to see you again. |
| welcome.neutral | Accueil sans prénom | Bonjour ! Que souhaitez-vous faire aujourd'hui ? | Hello! What would you like to do today? |
| return.recent | Retour pertinent | Ravi de vous retrouver. On reprend quand vous voulez. | Good to see you again. Pick up whenever you're ready. |
| return.long | Durée écoulée réellement connue | Heureux de vous retrouver. Voici où reprendre. | Good to see you again. Here's where you can pick up. |

Ne pas afficher un message de retour si la durée écoulée n'est pas connue. Ne pas répéter l'accueil à chaque changement de route.

## 3. Salutations temporelles

| Clé | Période indicative | FR | EN |
|---|---|---|---|
| home.greeting.veryLate | 00:00–03:00 | Bonsoir{name}. Prenez votre temps. | Good evening{name}. Take your time. |
| home.greeting.earlyMorning | 03:00–05:00 | Bonjour{name} ! | Good morning{name}! |
| home.greeting.morning | 05:00–08:00 | Bonjour{name} ! Belle journée à vous. | Good morning{name}! Have a lovely day. |
| home.greeting.lateMorning | 08:00–11:00 | Bonjour{name} ! Que souhaitez-vous faire ? | Good morning{name}! What would you like to do? |
| home.greeting.midday | 11:00–14:00 | Bonjour{name} ! | Hello{name}! |
| home.greeting.afternoon | 14:00–17:00 | Bon après-midi{name} ! | Good afternoon{name}! |
| home.greeting.evening | 17:00–19:00 | Bonne fin de journée{name} ! | Enjoy the rest of your day{name}! |
| home.greeting.night | 19:00–22:00 | Bonsoir{name} ! | Good evening{name}! |
| home.greeting.late | 22:00–00:00 | Bonsoir{name}. | Good evening{name}. |

Ce sont des variantes possibles, pas des notifications automatiques. Le gestionnaire de fréquence peut choisir de ne rien afficher. Le paramètre `{name}` est remplacé uniquement par un nom d'affichage déjà disponible et autorisé ; sinon il est remplacé par une chaîne vide.

Les neuf clés `home.greeting.*` ci-dessus correspondent aux clés runtime ajoutées au catalogue i18n existant. Les autres clés de ce document restent des entrées éditoriales proposées à intégrer au fur et à mesure de l'adoption du système central.

## 4. Accompagnement et expressions simples

| Clé | Intention | FR | EN |
|---|---|---|---|
| companion.ready | Disponibilité sobre | Je suis là si vous avez besoin d'un coup de main. | I'm here if you need a hand. |
| companion.step | Étape suivante | On y va étape par étape. | Let's take it one step at a time. |
| companion.take_time | Pas d'urgence | Prenez votre temps. | Take your time. |
| companion.clear | Action claire | Vous pouvez continuer. | You're all set to continue. |
| companion.encourage | Progression réelle | Vous avancez bien. | You're making good progress. |

Les encouragements ne sont pas affichés sans progression réelle ni utilisés pour pousser à prolonger la session.

## 5. Confirmations et états

| Clé | État réel requis | FR | EN |
|---|---|---|---|
| action.saved_local | Enregistré sur l'appareil | C'est gardé sur cet appareil. | It's saved on this device. |
| action.sent | Envoi confirmé | C'est envoyé. | It's been sent. |
| action.confirmed | Confirmation métier reçue | C'est confirmé ! | It's confirmed! |
| action.pending_network | Réseau indisponible, reprise prévue | Le réseau est indisponible. Votre action sera envoyée dès qu'il revient. | The network is unavailable. Your action will be sent when it returns. |
| action.cancelled | Annulation confirmée | C'est annulé. | It's cancelled. |
| action.updated | Mise à jour confirmée | C'est mis à jour. | It's updated. |

Ne jamais utiliser « envoyé » ou « confirmé » à partir d'une simple réponse optimiste du client.

## 6. Erreurs et permissions

| Clé | Contexte | FR | EN |
|---|---|---|---|
| error.generic | Échec non détaillé | Nous n'avons pas pu terminer. Vous pouvez réessayer. | We couldn't complete that. You can try again. |
| error.network | Réseau indisponible | La connexion ne répond pas pour le moment. | The connection isn't responding right now. |
| error.permission_location | Permission refusée | Nous n'avons pas accès à votre position. Vous pouvez nous l'autoriser si vous le souhaitez. | We can't access your location. You can allow it if you'd like. |
| error.unavailable | Fonction indisponible | Ce service n'est pas disponible pour le moment. | This service isn't available right now. |
| error.try_again | Action récupérable | Réessayons. | Let's try again. |
| permission.explain | Avant demande de permission | Cette autorisation nous aide à vous montrer ce qui se passe autour de vous. | This permission helps us show what's happening around you. |

Le texte doit correspondre à la permission réellement demandée. Ne jamais affirmer qu'une position n'est pas transmise ou traitée sans preuve technique.

## 7. Suggestions contextuelles

| Clé | Condition métier | FR | EN |
|---|---|---|---|
| suggestion.explore | Accueil et découverte disponible | Vous pouvez découvrir les espaces de Vitalis à votre rythme. | Explore Vitalis at your own pace. |
| suggestion.resume | Reprise réellement possible | Vous pouvez reprendre là où vous en étiez. | You can pick up where you left off. |
| suggestion.nearby | Données de proximité réelles et permission accordée | Voici ce qui se passe autour de vous. | Here's what's happening around you. |
| suggestion.none | Aucun résultat réel | Rien à afficher pour le moment. | Nothing to show here yet. |

## 7 bis. Suggestions de découverte réellement disponibles en V1

Ces suggestions sont des conseils d'exploration affichables dans l'accueil ou au moment opportun. Elles ne sont pas des notifications d'activité et ne doivent pas être comptées comme des événements non lus.

| Moteur | Capacité vérifiée dans le dépôt | Suggestion de découverte possible | Condition et limite à respecter |
|---|---|---|---|
| Flash | Composer et enregistrer un Flash avec texte, type, catégorie, durée, portée et urgence ; saisie vocale si le navigateur la prend en charge ; localisation facultative. | « Vous pouvez publier un besoin ou une proposition pour une durée limitée. Je peux vous montrer comment préparer votre premier Flash. » | L'enregistrement exige un compte connecté et les champs requis. Ne pas annoncer une publication avant confirmation de `createFlash`. |
| Scan | Lancer volontairement une recherche de proximité avec position temporaire, rayon sélectionnable (1, 5, 10 ou 20 km), résultats publics et historique local consultable/effaçable. | « Vous pouvez lancer un Scan quand vous souhaitez voir les possibilités publiques autour de vous. » | Demander la position au moment du Scan. Ne pas lancer de recherche en arrière-plan ni annoncer de résultat avant réponse réelle. |
| En direct | Consulter les bips reçus et les mises en relation ; accepter/refuser un bip et terminer une relation, avec parcours invité et membre distincts. | « En direct sert à voir les personnes présentes à proximité et à échanger un signal si votre présence est activée. » | N'afficher que si le mode d'accès et les permissions permettent réellement l'action. Aucun bip, présence ou contact ne doit être simulé. |
| Radar | Créer, modifier et annuler une intention de recherche privée enregistrée hors ligne en priorité. | « Vous pouvez noter ce que vous recherchez et la zone qui vous intéresse pour le retrouver facilement. » | La mise en correspondance automatique et les alertes Radar ne sont pas raccordées ; ne jamais promettre qu'une personne ou une offre sera trouvée ou signalée. |

Les exemples ci-dessus sont des formulations de découverte à valider dans les écrans. Ils ne deviennent pas des messages runtime tant que leur point d'affichage, leur disponibilité et leur anti-répétition ne sont pas raccordés. En phase de lancement (0–500 comptes inscrits), proposer ces aides progressivement et généreusement, mais une à la fois et seulement dans le moteur concerné. Ne pas empiler plusieurs conseils sur un même écran. Après 500 utilisateurs, réduire graduellement la fréquence selon la posture définie dans la spécification.

## 8. Notifications métier

Les notifications de bip, mise en relation, mission, Scan ou Flash proviennent des événements réels des domaines. Le catalogue fournit les formulations ; il ne crée pas les événements.

| Clé indicative | Événement à confirmer dans le domaine | FR | EN |
|---|---|---|---|
| event.bip_received | Bip reçu | Vous avez reçu un bip. | You received a ping. |
| event.relation_established | Mise en relation confirmée | La mise en relation est établie. | The connection is established. |
| event.mission_update | Changement de statut confirmé | Votre mission a été mise à jour. | Your mission has been updated. |
| event.flash_available | Nouveau Flash accessible | Un nouveau Flash est disponible autour de vous. | A new Flash is available nearby. |

Ces clés ne sont pas des noms d'événements runtime validés. Le domaine propriétaire fournit la destination et les variables. Aucun identifiant temporaire invité n'apparaît dans le texte ou les métadonnées.

## 9. Contrôle éditorial

- [ ] Clé stable, nommée selon une intention.
- [ ] Français et anglais naturels et équivalents.
- [ ] Message court et compréhensible dès la première lecture.
- [ ] État déclencheur réel et vérifié.
- [ ] Aucune capacité, réussite ou proximité inventée.
- [ ] Variables avec fallback.
- [ ] Priorité et fréquence définies.
- [ ] Mode invité et permissions respectés.
- [ ] Aucun message qui pousse à revenir sans raison utile.

## Références

- [Système de communication humaine V1 à V3](./communication-system-v1-v3.md)
- [Langage humain et communication Vitalis](./communication-language.md)
- [Audit du langage humain — V1](./language-audit-v1.md)
