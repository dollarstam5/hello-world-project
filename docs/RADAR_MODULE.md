# Moteur Radar

Radar porte les recherches programmÃ©es qui durent plus de deux jours. Une veille possÃ¨de une durÃ©e minimale de 3 jours et une durÃ©e maximale de 90 jours. Elle est privÃ©e : seul son propriÃ©taire peut lire ses critÃ¨res et exÃ©cuter ses commandes.

## FrontiÃ¨re avec les missions

Un Radar est une veille susceptible de produire plusieurs correspondances. Une mission est un engagement entre un auteur et un intervenant, avec attribution, rÃ©alisation et validation. Les deux entitÃ©s restent sÃ©parÃ©es. Une correspondance Radar pourra crÃ©er une mission dans une phase ultÃ©rieure, aprÃ¨s une action explicite du membre.

## Cycle de vie

| Ã‰tat | Signification | Sorties autorisÃ©es |
| --- | --- | --- |
| `draft` | CritÃ¨res modifiables, veille inactive | activation, annulation |
| `active` | Veille activÃ©e et planifiÃ©e | surveillance, pause, revalidation, expiration, annulation |
| `watching` | Moteur en recherche | correspondance, pause, revalidation, expiration, annulation |
| `matched` | Au moins une correspondance disponible | pause, revalidation, expiration, annulation |
| `paused` | Veille suspendue par le membre | reprise, expiration, annulation |
| `expired` | Ã‰chÃ©ance atteinte | terminal |
| `cancelled` | ArrÃªt volontaire | terminal |

Lâ€™activation et la reprise calculent `next_review_at` Ã  sept jours au maximum, sans dÃ©passer lâ€™expiration. La revalidation renseigne `last_reviewed_at` et programme la suivante.

## SÃ©curitÃ©

- RLS limite la lecture et la crÃ©ation au propriÃ©taire.
- Les critÃ¨res ne sont modifiables directement quâ€™Ã  lâ€™Ã©tat `draft`.
- `status`, les Ã©chÃ©ances de revue, lâ€™identitÃ© du propriÃ©taire, la rÃ©vision et les dates systÃ¨me sont protÃ©gÃ©s.
- `command_radar` verrouille la ligne et applique les commandes propriÃ©taire cÃ´tÃ© PostgreSQL.
- Les visiteurs anonymes ne peuvent ni lire ni commander une veille.
- La migration ne stocke aucune latitude ou longitude prÃ©cise.

## Ã‰tapes suivantes

P1.5.2 ajoutera le dÃ©pÃ´t IndexedDB, lâ€™outbox, lâ€™API authentifiÃ©e, les hooks et le formulaire mobile-first. Les coordonnÃ©es Ã©ventuelles resteront dans une table privÃ©e sÃ©parÃ©e. P1.5.3 ajoutera le moteur de correspondances, le traitement planifiÃ© et les notifications.