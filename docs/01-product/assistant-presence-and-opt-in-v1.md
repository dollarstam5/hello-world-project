# Présence et activation volontaire de l’assistant Vitalis

**Statut :** décision produit validée le 13 novembre 2026.  
**Portée :** expérience de l’assistant dans l’application Vitalis.  
**Principe directeur :** l’assistant est un service facultatif, jamais un élément permanent de l’interface.

## 1. Décision

L’utilisateur doit pouvoir ignorer complètement l’assistant. Il n’est pas imposé et ne doit pas occuper durablement l’écran.

- L’assistant est **désactivé par défaut**.
- Son activation est un choix explicite dans **Paramètres de l’application**.
- L’utilisateur peut le désactiver à tout moment depuis ces mêmes paramètres.
- Aucun bouton flottant, icône fixe, bulle persistante ou raccourci superposé aux pages ne doit être ajouté pour le rendre constamment visible.
- Lorsqu’il est désactivé, son onglet et ses surfaces d’interface sont masqués.
- Lorsqu’il est activé, ses interventions doivent rester ponctuelles et liées à un message réellement utile : accueil, information nécessaire ou aide contextuelle pertinente.
- Les messages doivent être courts, chaleureux, naturels et non répétitifs. Exemple : « Bonjour, je suis là si vous avez besoin d’aide ou si vous avez une question. »
- Aucune sollicitation sans raison, répétition insistante ou interruption d’une action en cours.
- L’utilisateur conserve le contrôle : il peut ignorer un message, le fermer et désactiver l’assistant.

## 2. Distinction entre activation et apparition

L’activation autorise l’assistant à intervenir ; elle ne justifie pas à elle seule une apparition permanente.

L’affichage d’un message doit dépendre d’un événement ou d’un besoin identifié. En l’absence de message utile, l’assistant ne s’affiche pas. Un message d’accueil peut être présenté à un moment pertinent, sans devenir une bannière permanente ni être répété à chaque navigation.

L’accès conversationnel manuel, lorsqu’il est proposé, doit rester discret et disponible uniquement après activation volontaire. Il ne doit pas réintroduire une icône flottante permanente.

## 3. Comportements interdits

- Icône ou bouton assistant fixe sur Home ou les pages des moteurs.
- Ouverture automatique et répétée de la conversation.
- Message d’accueil à chaque changement de page ou à chaque lancement.
- Messages promotionnels ou sollicitations sans utilité immédiate.
- Désactivation difficile à trouver ou préférence réactivée sans consentement.

## 4. Fonctionnement technique mis en place

- Une préférence locale persistante, désactivée par défaut, contrôle l’activation.
- Le réglage est accessible dans les paramètres de l’application.
- L’entrée flottante globale est retirée ; l’onglet de conversation n’est visible qu’après activation.
- Un canal applicatif permet de publier un message ponctuel par événement (fonction `publishAssistantNotice`). Il refuse les messages lorsque l’assistant est désactivé.
- Une première intervention de bienvenue est déclenchée une seule fois lors de la première activation volontaire.
- Le message est affiché dans une notification temporaire, fermable, annoncée aux lecteurs d’écran et automatiquement retirée après neuf secondes. La désactivation masque immédiatement cette notification.

**Limite à ne pas masquer :** le canal événementiel et le message de bienvenue sont raccordés, mais les événements métier supplémentaires ne sont pas encore branchés. Il ne faut pas déclencher de messages automatiques pour Flash, Scan, Réel, Radar ou les notifications tant que leurs événements réels et leurs règles de fréquence n’ont pas été définis et reliés. Aucun événement fictif ne doit être inventé.

## 5. Critères d’acceptation

1. Une nouvelle installation présente l’assistant comme désactivé.
2. Aucune icône ou commande flottante assistant n’est visible dans les pages.
3. L’utilisateur peut activer puis désactiver l’assistant dans les paramètres de l’application.
4. La préférence reste enregistrée après rechargement sur le même navigateur/appareil.
5. L’onglet Assistant n’est visible dans les communications que lorsque l’utilisateur l’a activé.
6. La désactivation masque immédiatement l’accès conversationnel facultatif.
7. Les pages Home, Flash, Scan, Réel et Radar ne reçoivent aucun élément assistant permanent.
8. Les messages ponctuels futurs ne s’affichent que sur événement utile et respectent la possibilité d’ignorer ou de fermer.

## 6. Hors périmètre de cette décision

Cette règle ne modifie pas les fournisseurs IA, les API, les quotas, les données conversationnelles, l’authentification, les règles de sécurité ni les autres moteurs Vitalis.
