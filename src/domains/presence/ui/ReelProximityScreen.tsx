import type { CSSProperties } from "react";
import {
  ArrowLeft,
  Bell,
  Bluetooth,
  Check,
  ChevronDown,
  CircleUserRound,
  Globe,
  History,
  MapPin,
  RadioTower,
  Settings2,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import {
  useReelProximityController,
  type Person,
} from "@/domains/presence/model/useReelProximityController";
import "./reel-proximity.css";

const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];
const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];

function PersonAvatar({
  person,
  size = "person",
}: {
  person: Person;
  size?: "person" | "small" | "me";
}) {
  return (
    <span
      className={`reel-avatar reel-avatar--${size} ${person.avatarKey ? `reel-avatar--${person.avatarKey}` : ""}`}
      aria-label={person.name}
    >
      {person.avatarUrl ? (
        <img
          src={person.avatarUrl}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.parentElement?.classList.add("reel-avatar--failed");
          }}
        />
      ) : person.initials ? (
        <span className="reel-avatar__initials" aria-hidden="true">
          {person.initials}
        </span>
      ) : (
        <CircleUserRound className="reel-avatar__silhouette" aria-hidden="true" />
      )}
    </span>
  );
}

function RingPerson({ person, onSelect }: { person: Person; onSelect: (person: Person) => void }) {
  const radians = ((Number.isFinite(person.angle) ? person.angle : 0) * Math.PI) / 180;
  const orbit = 39;
  const position = {
    left: `${50 + orbit * Math.cos(radians)}%`,
    top: `${50 + orbit * Math.sin(radians)}%`,
  } satisfies CSSProperties;

  return (
    <button
      type="button"
      className="reel-ring-person"
      style={position}
      onClick={() => onSelect(person)}
      aria-label={`Voir le profil de ${person.name}`}
    >
      <PersonAvatar person={person} />
      <span className="reel-ring-person__name">{person.name}</span>
    </button>
  );
}

export function ReelProximityScreen() {
  const {
    access,
    discoveryAccess,
    locationMessage,
    guestSessionLoading,
    guestSessionMessage,
    selectedPerson,
    showFullProfile,
    panel,
    setPanel,
    activityTab,
    setActivityTab,
    radius,
    setRadius,
    duration,
    setDuration,
    presenceConsent,
    setPresenceConsent,
    guestPresenceConsent,
    setGuestPresenceConsent,
    guestDisplayName,
    setGuestDisplayName,
    guestAreaLabel,
    setGuestAreaLabel,
    guestAvatarKey,
    setGuestAvatarKey,
    guestPresence,
    presenceDescription,
    setPresenceDescription,
    presenceLoading,
    presenceMessage,
    receivedBips,
    receivedGuestBips,
    bipsLoading,
    bipsMessage,
    connections,
    guestConnections,
    connectionsLoading,
    connectionsMessage,
    currentPresence,
    canUseMemberReel,
    discoveryEnabled,
    activityEnabled,
    availablePeople,
    visiblePeople,
    nearbyPeople,
    additionalCount,
    refreshBips,
    refreshConnections,
    endConnection,
    sendBipToSelectedPerson,
    resolveReceivedBip,
    resolveGuestBip,
    endGuestConnection,
    pendingConnectionEnd,
    confirmEndConnection,
    cancelEndConnection,
    activatePresence,
    activateGuestPresence,
    stopGuestPresence,
    stopPresence,
    beginGuestSession,
    requestDiscovery,
    ignoreLocation,
    openProfile,
    closeProfile,
    openActivity,
  } = useReelProximityController();

  return (
    <section className="reel-proximity" aria-label="Temps Réel de proximité">
      <header className="reel-proximity__header">
        <button
          type="button"
          className="reel-proximity__header-action"
          onClick={() => setPanel("settings")}
          aria-label="Personnaliser mes préférences"
          title="Mes préférences"
        >
          <SlidersHorizontal aria-hidden="true" />
        </button>
        <div className="reel-proximity__heading">
          <div className="reel-proximity__heading-copy">
            <h1>RÉEL</h1>
            <p>Les personnes présentes autour de vous</p>
          </div>
        </div>
        <button
          type="button"
          className="reel-proximity__header-action reel-proximity__notification"
          onClick={() => openActivity("notifications")}
          disabled={!activityEnabled}
          aria-label={
            activityEnabled
              ? "Notifications, bips et mises en relation"
              : "Les notifications Réel sont en pause sans autorisation de proximité"
          }
          title={activityEnabled ? "Activité" : "Notifications en pause"}
        >
          <Bell aria-hidden="true" />
        </button>
      </header>

      {!discoveryEnabled && (
        <section
          className={`reel-location-card reel-location-card--${discoveryAccess}`}
          aria-label="Accès à la position"
        >
          <div className="reel-location-card__icon">
            <MapPin aria-hidden="true" />
          </div>
          <div className="reel-location-card__copy">
            <strong>
              {discoveryAccess === "prompt" && !canUseMemberReel
                ? access.mode === "guest"
                  ? "Vous découvrez Réel en invité"
                  : access.mode === "visitor"
                    ? "Découvrez Réel sans créer de compte"
                    : "Votre compte n’a pas encore accès à Réel"
                : discoveryAccess === "prompt"
                  ? "Envie de découvrir ce qui se passe près de vous ?"
                  : discoveryAccess === "requesting"
                    ? "Nous vérifions votre position…"
                    : discoveryAccess === "denied"
                      ? "Votre position reste privée"
                      : "Vous découvrez Réel à votre rythme"}
            </strong>
            <p>
              {discoveryAccess === "prompt" && !canUseMemberReel
                ? access.mode === "guest"
                  ? "Votre session est temporaire. Vous pouvez découvrir les présences autour de vous sans créer de compte."
                  : access.mode === "visitor"
                    ? "Commencez avec une session temporaire. Elle ne crée pas de compte ni de profil permanent."
                    : "L’accès à Réel sera disponible lorsque votre profil Vitalis sera actif."
                : discoveryAccess === "prompt"
                  ? "Autorisez Réel à utiliser votre position pour observer les personnes et les activités autour de vous. Votre choix reste libre."
                  : discoveryAccess === "requesting"
                    ? "Cela ne prend que quelques instants."
                    : locationMessage ||
                      "Vous pouvez parcourir Réel sans localisation. Les découvertes proches, les bips et les réactions resteront en pause."}
            </p>
            <div className="reel-location-card__actions">
              {(canUseMemberReel || access.mode === "guest") &&
                (discoveryAccess === "prompt" ||
                  discoveryAccess === "ignored" ||
                  discoveryAccess === "denied") && (
                  <button
                    type="button"
                    className="reel-location-card__primary"
                    onClick={() => void requestDiscovery()}
                  >
                    {discoveryAccess === "prompt"
                      ? "Voir les personnes autour de moi"
                      : "Réessayer"}
                  </button>
                )}
              {access.mode === "visitor" && (
                <button
                  type="button"
                  className="reel-location-card__primary"
                  disabled={guestSessionLoading}
                  onClick={() => void beginGuestSession()}
                >
                  {guestSessionLoading ? "Ouverture de votre accès…" : "Continuer en invité"}
                </button>
              )}
              {guestSessionMessage && <p role="status">{guestSessionMessage}</p>}
              {discoveryAccess === "prompt" && (
                <button
                  type="button"
                  className="reel-location-card__secondary"
                  onClick={ignoreLocation}
                >
                  Pas maintenant
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <div
        className={`reel-proximity__radar${discoveryEnabled ? "" : " reel-proximity__radar--calm"}`}
      >
        <div className="reel-radar__outer-halo" aria-hidden="true" />
        <div className="reel-radar__outer-ring" aria-hidden="true" />
        <div className="reel-radar__inner-ring" aria-hidden="true" />
        <div className="reel-radar__core">
          <button
            type="button"
            className="reel-radar__me"
            onClick={() => setPanel("settings")}
            aria-label="Gérer ma présence"
          >
            <span className="reel-radar__me-avatar">
              <CircleUserRound aria-hidden="true" />
            </span>
            <span className="reel-radar__me-label">Moi</span>
            <span className="reel-radar__me-hint">Ma présence</span>
          </button>
        </div>
        {visiblePeople.map((person) => (
          <RingPerson key={person.id} person={person} onSelect={openProfile} />
        ))}
      </div>

      <div className="reel-nearby">
        <p className="reel-nearby__title">
          {!discoveryEnabled
            ? "La découverte à proximité est en pause"
            : availablePeople.length === 0
              ? "Aucune présence réelle ne se trouve dans votre rayon pour le moment"
              : `${availablePeople.length} personne${availablePeople.length > 1 ? "s" : ""} à proximité`}
        </p>
        <div className="reel-nearby__row">
          <div className="reel-nearby__avatars">
            {nearbyPeople.map((person) => (
              <button
                key={person.id}
                type="button"
                className="reel-nearby__profile"
                onClick={() => openProfile(person)}
                aria-label={`Voir le profil de ${person.name}`}
              >
                <PersonAvatar person={person} size="small" />
              </button>
            ))}
            {additionalCount > 0 && (
              <button
                type="button"
                className="reel-nearby__count"
                onClick={() => setPanel("people")}
                aria-label={`Afficher les ${additionalCount} autres personnes`}
              >
                +{additionalCount}
              </button>
            )}
          </div>
          <button
            className="reel-nearby__bluetooth"
            type="button"
            disabled
            aria-label="Bluetooth — prévu en version 3"
            title="Bluetooth — sera développé en version 3"
          >
            <Bluetooth aria-hidden="true" />
          </button>
        </div>
        {discoveryEnabled && availablePeople.length > 3 && (
          <button type="button" className="reel-nearby__all" onClick={() => setPanel("people")}>
            Voir toutes les personnes
            <ChevronDown aria-hidden="true" />
          </button>
        )}
      </div>

      {!discoveryEnabled && discoveryAccess !== "prompt" && discoveryAccess !== "requesting" && (
        <div className="reel-calm-shortcuts" aria-label="Autres façons de découvrir Réel">
          <button type="button" onClick={() => setPanel("global")}>
            <Globe aria-hidden="true" />
            <span>
              <strong>Propositions globales</strong>
              <small>Découvrir sans partager votre position</small>
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
          <button type="button" onClick={() => openActivity("connections")}>
            <History aria-hidden="true" />
            <span>
              <strong>Mon activité passée</strong>
              <small>Retrouver les informations déjà disponibles</small>
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      )}

      {panel && (
        <div
          className="reel-panel-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPanel(null);
          }}
        >
          <section
            className="reel-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-panel-title"
          >
            <button
              type="button"
              className="reel-panel__close"
              onClick={() => setPanel(null)}
              aria-label="Fermer"
            >
              <X aria-hidden="true" />
            </button>

            {panel === "settings" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Settings2 aria-hidden="true" /> Personnalisation
                </div>
                <h2 id="reel-panel-title">Ma présence et mes préférences</h2>
                <p className="reel-panel__intro">
                  Choisissez comment vous souhaitez rencontrer les personnes autour de vous.
                </p>

                <div className="reel-panel__section">
                  <h3>Découverte à proximité</h3>
                  <p className="reel-panel__note">
                    {discoveryEnabled
                      ? "La découverte est active pour cette visite. Elle vous permet d’observer les activités autour de vous, sans publier votre propre présence."
                      : "Vous pouvez activer la découverte pour observer les activités autour de vous. Cela ne rend pas votre propre présence visible."}
                  </p>
                  {!discoveryEnabled && (
                    <button
                      type="button"
                      className="reel-panel__primary"
                      onClick={() => void requestDiscovery()}
                    >
                      Activer la découverte
                    </button>
                  )}
                </div>

                <div className="reel-panel__section">
                  <h3>Rayon de proximité</h3>
                  <div className="reel-choice-grid">
                    {RADII.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={radius === value ? "is-selected" : ""}
                        onClick={() => setRadius(value)}
                      >
                        {value}
                        {radius === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="reel-panel__note">
                  Le rayon choisi est appliqué côté serveur en mètres. Les positions précises
                  restent privées et temporaires ; aucune distance exacte n’est affichée. La
                  précision dépend aussi du GPS de votre appareil.
                </p>
                {currentPresence && (
                  <p className="reel-panel__note">
                    Votre présence est déjà active : les changements de rayon ou de durée
                    s’appliqueront à la prochaine activation, pas à celle-ci.
                  </p>
                )}

                <div className="reel-panel__section">
                  <h3>Durée souhaitée</h3>
                  {access.mode === "guest" && (
                    <p className="reel-panel__note">
                      Votre accès invité dure au maximum une heure. Votre présence s’arrêtera
                      automatiquement avec votre session.
                    </p>
                  )}
                  <div className="reel-choice-grid reel-choice-grid--duration">
                    {DURATIONS.filter(
                      (value) => access.mode !== "guest" || value === "30 min" || value === "1 h",
                    ).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={duration === value ? "is-selected" : ""}
                        onClick={() => setDuration(value)}
                      >
                        {value}
                        {duration === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="reel-panel__section">
                  <h3>Ma visibilité</h3>
                  <p className="reel-panel__note">
                    La découverte vous permet d’observer les activités autour de vous. Activer votre
                    présence est un choix séparé : les autres personnes pourront alors vous voir
                    dans votre secteur approximatif, pendant la durée choisie.
                  </p>
                  {access.mode === "guest" ? (
                    guestPresence ? (
                      <>
                        <p className="reel-panel__status">
                          Votre présence est visible sous le nom {guestPresence.display_name}, dans
                          le secteur « {guestPresence.area_label} », jusqu’à la fin de votre session
                          invitée.
                        </p>
                        <button
                          type="button"
                          className="reel-panel__secondary"
                          disabled={presenceLoading}
                          onClick={() => void stopGuestPresence()}
                        >
                          Arrêter ma présence
                        </button>
                      </>
                    ) : (
                      <>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Le prénom à afficher</strong>
                            <small>Un prénom ou un nom court, sans créer de compte.</small>
                          </span>
                          <input
                            type="text"
                            autoComplete="nickname"
                            maxLength={40}
                            value={guestDisplayName}
                            onChange={(event) => setGuestDisplayName(event.target.value)}
                            placeholder="Ex. Awa"
                          />
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Mon secteur</strong>
                            <small>Un repère général, jamais votre adresse exacte.</small>
                          </span>
                          <input
                            type="text"
                            maxLength={80}
                            value={guestAreaLabel}
                            onChange={(event) => setGuestAreaLabel(event.target.value)}
                            placeholder="Ex. Bonamoussadi"
                          />
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Mon avatar</strong>
                            <small>Choisissez une couleur pour vous reconnaître.</small>
                          </span>
                          <select
                            value={guestAvatarKey}
                            onChange={(event) => setGuestAvatarKey(event.target.value)}
                          >
                            <option value="avatar-blue">Bleu</option>
                            <option value="avatar-violet">Violet</option>
                            <option value="avatar-green">Vert</option>
                            <option value="avatar-orange">Orange</option>
                          </select>
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Ce que les autres verront</strong>
                            <small>Une phrase courte pour expliquer votre présence.</small>
                          </span>
                          <textarea
                            maxLength={180}
                            value={presenceDescription}
                            onChange={(event) => setPresenceDescription(event.target.value)}
                            rows={2}
                          />
                        </label>
                        <label className="reel-setting-row">
                          <span>
                            <strong>Je souhaite être visible</strong>
                            <small>
                              Ma position précise reste privée. Seule ma présence dans le rayon
                              choisi sera proposée aux personnes proches.
                            </small>
                          </span>
                          <input
                            type="checkbox"
                            checked={guestPresenceConsent}
                            onChange={(event) => setGuestPresenceConsent(event.target.checked)}
                          />
                        </label>
                        <button
                          type="button"
                          className="reel-panel__primary"
                          disabled={
                            presenceLoading ||
                            !guestPresenceConsent ||
                            !guestDisplayName.trim() ||
                            !guestAreaLabel.trim() ||
                            !presenceDescription.trim()
                          }
                          onClick={() => void activateGuestPresence()}
                        >
                          {presenceLoading ? "Activation…" : "Rendre ma présence visible"}
                        </button>
                      </>
                    )
                  ) : !canUseMemberReel ? (
                    <p className="reel-panel__note">
                      Pour publier votre présence, commencez par ouvrir une session invitée ou
                      utilisez votre compte Vitalis.
                    </p>
                  ) : currentPresence ? (
                    <>
                      <p className="reel-panel__status">
                        Votre présence est active jusqu’à la fin de la durée choisie.
                      </p>
                      <button
                        type="button"
                        className="reel-panel__secondary"
                        disabled={presenceLoading}
                        onClick={() => void stopPresence()}
                      >
                        Arrêter ma présence
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="reel-setting-row reel-setting-row--stacked">
                        <span>
                          <strong>Ce que les autres verront</strong>
                          <small>Une courte description de votre présence.</small>
                        </span>
                        <textarea
                          maxLength={180}
                          value={presenceDescription}
                          onChange={(event) => setPresenceDescription(event.target.value)}
                          rows={2}
                        />
                      </label>
                      <label className="reel-setting-row">
                        <span>
                          <strong>Je souhaite être visible</strong>
                          <small>
                            Ma position sera indiquée de façon approximative, jamais sous forme de
                            coordonnées GPS exactes.
                          </small>
                        </span>
                        <input
                          type="checkbox"
                          checked={presenceConsent}
                          onChange={(event) => setPresenceConsent(event.target.checked)}
                        />
                      </label>
                      <button
                        type="button"
                        className="reel-panel__primary"
                        disabled={
                          presenceLoading || !presenceConsent || !presenceDescription.trim()
                        }
                        onClick={() => void activatePresence()}
                      >
                        {presenceLoading ? "Activation…" : "Activer ma présence"}
                      </button>
                    </>
                  )}
                  {presenceMessage && (
                    <p className="reel-panel__note" role="status">
                      {presenceMessage}
                    </p>
                  )}
                </div>

                <p className="reel-panel__note">
                  Les réglages de visibilité sont appliqués uniquement lorsqu’ils sont confirmés par
                  Vitalis. Vous gardez le contrôle sur l’activation et l’arrêt de votre présence.
                </p>
                <button
                  type="button"
                  className="reel-panel__primary"
                  onClick={() => setPanel(null)}
                >
                  Terminé
                </button>
              </>
            )}

            {panel === "global" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Globe aria-hidden="true" /> Découvrir autrement
                </div>
                <h2 id="reel-panel-title">Propositions globales</h2>
                <div className="reel-panel__empty">
                  <Globe aria-hidden="true" />
                  <strong>Les découvertes générales arrivent ici</strong>
                  <span>
                    Aucune activité proche n’est chargée lorsque vous gardez votre position privée.
                    Les propositions globales seront affichées dès que leur source sera disponible.
                  </span>
                </div>
              </>
            )}

            {panel === "activity" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Bell aria-hidden="true" /> Votre activité
                </div>
                <h2 id="reel-panel-title">Notifications et rencontres</h2>
                <div className="reel-panel__tabs" role="tablist" aria-label="Activité">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "notifications"}
                    aria-disabled={!activityEnabled}
                    disabled={!activityEnabled}
                    className={activityTab === "notifications" ? "is-active" : ""}
                    onClick={() => setActivityTab("notifications")}
                  >
                    Alertes
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "bips"}
                    aria-disabled={!currentPresence && !guestPresence}
                    disabled={!currentPresence && !guestPresence}
                    className={activityTab === "bips" ? "is-active" : ""}
                    onClick={() => setActivityTab("bips")}
                  >
                    Bips reçus
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "connections"}
                    className={activityTab === "connections" ? "is-active" : ""}
                    onClick={() => setActivityTab("connections")}
                  >
                    Rencontres
                  </button>
                </div>
                {activityTab === "bips" ? (
                  <div className="reel-people-list" aria-live="polite">
                    {bipsLoading && <p className="reel-panel__note">Chargement de vos bips…</p>}
                    {!canUseMemberReel && access.mode !== "guest" && (
                      <p className="reel-panel__note">
                        Publiez votre présence pour recevoir les signes des personnes proches.
                      </p>
                    )}
                    {(canUseMemberReel || access.mode === "guest") &&
                      !bipsLoading &&
                      receivedBips.length === 0 &&
                      receivedGuestBips.length === 0 && (
                        <div className="reel-panel__empty">
                          <RadioTower aria-hidden="true" />
                          <strong>Aucun bip reçu pour le moment</strong>
                          <span>Les signes reçus pendant votre présence apparaîtront ici.</span>
                        </div>
                      )}
                    {receivedBips.map((bip) => (
                      <div className="reel-people-list__item" key={bip.id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>Une personne vous a fait signe</strong>
                          <small>Vous pouvez accepter ou refuser cette mise en relation.</small>
                        </span>
                        <button
                          type="button"
                          onClick={() => void resolveReceivedBip(bip, "accept")}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => void resolveReceivedBip(bip, "decline")}
                        >
                          Refuser
                        </button>
                      </div>
                    ))}
                    {receivedGuestBips.map((bip) => (
                      <div className="reel-people-list__item" key={bip.id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>Une personne vous a fait signe</strong>
                          <small>Vous pouvez accepter ou refuser cette mise en relation.</small>
                        </span>
                        <button type="button" onClick={() => void resolveGuestBip(bip, "accept")}>
                          Accepter
                        </button>
                        <button type="button" onClick={() => void resolveGuestBip(bip, "decline")}>
                          Refuser
                        </button>
                      </div>
                    ))}
                    {bipsMessage && (
                      <p className="reel-panel__note" role="status">
                        {bipsMessage}
                      </p>
                    )}
                  </div>
                ) : activityTab === "connections" ? (
                  <div className="reel-people-list" aria-live="polite">
                    {connectionsLoading && (
                      <p className="reel-panel__note">Chargement de vos rencontres…</p>
                    )}
                    {access.mode === "visitor" && (
                      <p className="reel-panel__note">
                        Ouvrez une session invitée ou connectez-vous pour accéder à vos mises en
                        relation.
                      </p>
                    )}
                    {access.mode === "member" && !canUseMemberReel && (
                      <p className="reel-panel__note">
                        Vos mises en relation seront accessibles lorsque votre profil Vitalis sera
                        actif.
                      </p>
                    )}
                    {access.mode === "guest" &&
                      !connectionsLoading &&
                      guestConnections.length === 0 && (
                        <div className="reel-panel__empty">
                          <UsersRound aria-hidden="true" />
                          <strong>Aucune rencontre pour le moment</strong>
                          <span>
                            Les personnes qui acceptent votre signe apparaîtront ici pendant votre
                            session invitée.
                          </span>
                        </div>
                      )}
                    {canUseMemberReel &&
                      !connectionsLoading &&
                      connections.length === 0 &&
                      guestConnections.length === 0 && (
                        <div className="reel-panel__empty">
                          <UsersRound aria-hidden="true" />
                          <strong>Vous n’avez pas encore de mise en relation</strong>
                          <span>Les personnes qui acceptent votre signe apparaîtront ici.</span>
                        </div>
                      )}
                    {connections.map((connection) => (
                      <div className="reel-people-list__item" key={connection.connection_id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{connection.partner_display_name}</strong>
                          <small>
                            {connection.status === "active"
                              ? "Mise en relation active"
                              : "Mise en relation terminée"}
                          </small>
                        </span>
                        {connection.status === "active" && (
                          <button type="button" onClick={() => void endConnection(connection)}>
                            Terminer
                          </button>
                        )}
                      </div>
                    ))}
                    {guestConnections.map((connection) => (
                      <div className="reel-people-list__item" key={connection.connection_id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>
                            {connection.partner_display_name || "Mise en relation temporaire"}
                          </strong>
                          <small>
                            {connection.status === "active"
                              ? "Votre rencontre est active pendant la session invitée."
                              : "Cette mise en relation est terminée."}
                          </small>
                        </span>
                        {connection.status === "active" && (
                          <button type="button" onClick={() => void endGuestConnection(connection)}>
                            Terminer
                          </button>
                        )}
                      </div>
                    ))}
                    {connectionsMessage && (
                      <p className="reel-panel__note" role="status">
                        {connectionsMessage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="reel-panel__empty">
                    <Bell aria-hidden="true" />
                    <strong>Tout est calme pour le moment</strong>
                    <span>
                      Les notifications liées à Réel apparaîtront ici lorsqu’un événement réel sera
                      disponible.
                    </span>
                  </div>
                )}
                {!activityEnabled && activityTab === "notifications" && (
                  <p className="reel-panel__note">
                    En mode calme, les alertes sont suspendues. Vos mises en relation restent
                    consultables.
                  </p>
                )}
              </>
            )}

            {panel === "people" && (
              <>
                <div className="reel-panel__eyebrow">
                  <UsersRound aria-hidden="true" /> À proximité
                </div>
                <h2 id="reel-panel-title">Toutes les personnes proches</h2>
                {discoveryEnabled && availablePeople.length ? (
                  <div className="reel-people-list">
                    {availablePeople.map((person) => (
                      <button
                        type="button"
                        className="reel-people-list__item"
                        key={person.id}
                        onClick={() => openProfile(person)}
                      >
                        <PersonAvatar person={person} size="small" />
                        <span>
                          <strong>{person.name}</strong>
                          <small>
                            {person.description || person.category || "Profil à proximité"}
                          </small>
                        </span>
                        {person.distanceLabel && (
                          <small className="reel-people-list__distance">
                            {person.distanceLabel}
                          </small>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="reel-panel__empty">
                    <UsersRound aria-hidden="true" />
                    <strong>Personne à afficher pour le moment</strong>
                    <span>Les profils disponibles apparaîtront ici au fur et à mesure.</span>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {pendingConnectionEnd && (
        <div
          className="reel-panel-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cancelEndConnection();
          }}
        >
          <section
            className="reel-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-close-connection-title"
          >
            <h2 id="reel-close-connection-title">Terminer cette mise en relation ?</h2>
            <p className="reel-panel__intro">
              Elle sera fermée pour vous deux et ne sera plus active dans Réel.
            </p>
            <div className="reel-panel__actions">
              <button
                type="button"
                className="reel-panel__secondary"
                onClick={cancelEndConnection}
              >
                Garder la relation
              </button>
              <button
                type="button"
                className="reel-panel__primary"
                onClick={() => void confirmEndConnection()}
              >
                Terminer
              </button>
            </div>
          </section>
        </div>
      )}

      {selectedPerson && (
        <div
          className="reel-profile-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProfile();
          }}
        >
          <section
            className="reel-profile-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-profile-title"
          >
            <button
              type="button"
              className="reel-profile-sheet__close"
              onClick={closeProfile}
              aria-label="Fermer le profil"
            >
              <X aria-hidden="true" />
            </button>
            {showFullProfile && (
              <button
                type="button"
                className="reel-profile-sheet__back"
                onClick={() => setShowFullProfile(false)}
              >
                <ArrowLeft aria-hidden="true" /> Retour à l’aperçu
              </button>
            )}
            <PersonAvatar person={selectedPerson} size="me" />
            <h2 id="reel-profile-title">{selectedPerson.name}</h2>
            {selectedPerson.category && (
              <p className="reel-profile-sheet__category">{selectedPerson.category}</p>
            )}
            {selectedPerson.distanceLabel && (
              <p className="reel-profile-sheet__distance">{selectedPerson.distanceLabel}</p>
            )}
            {showFullProfile ? (
              <>
                {selectedPerson.description && (
                  <p className="reel-profile-sheet__description">{selectedPerson.description}</p>
                )}
                {(selectedPerson.locationLabel || selectedPerson.distanceLabel) && (
                  <div className="reel-profile-sheet__details">
                    {selectedPerson.locationLabel && <span>{selectedPerson.locationLabel}</span>}
                    {selectedPerson.distanceLabel && <span>{selectedPerson.distanceLabel}</span>}
                  </div>
                )}
                {!selectedPerson.description && !selectedPerson.locationLabel && (
                  <p className="reel-profile-sheet__empty">
                    Cette personne n’a pas encore ajouté d’autres informations à son profil.
                  </p>
                )}
              </>
            ) : (
              <p className="reel-profile-sheet__description">
                {selectedPerson.description ||
                  "Consultez les informations disponibles sur ce profil."}
              </p>
            )}
            {(currentPresence || guestPresence) && !showFullProfile && (
              <button
                type="button"
                className="reel-profile-sheet__primary"
                onClick={() => void sendBipToSelectedPerson()}
              >
                <RadioTower aria-hidden="true" /> Faire signe
              </button>
            )}
            <button
              type="button"
              className="reel-profile-sheet__primary"
              onClick={() => {
                if (showFullProfile) closeProfile();
                else setShowFullProfile(true);
              }}
            >
              {showFullProfile ? "Fermer" : "Voir la fiche complète"}
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
