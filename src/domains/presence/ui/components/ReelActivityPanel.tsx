import { Bell, CircleUserRound, RadioTower, UsersRound } from "lucide-react";
import { haptic } from "@/platform/device/haptics";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useReelProximityController } from "@/domains/presence/model/useReelProximityController";

type ReelController = ReturnType<typeof useReelProximityController>;

export function ReelActivityPanel({ controller }: { controller: ReelController }) {
  const { t } = useI18n();
  const { activityTab, setActivityTab, activityEnabled } = controller;
  const { currentPresence, guestPresence, bipsLoading } = controller;
  const { canUseMemberReel, access, receivedBips } = controller;
  const { receivedGuestBips, resolveReceivedBip, resolveGuestBip } = controller;
  const { bipsMessage, connectionsLoading, guestConnections } = controller;
  const { connections, endConnection, endGuestConnection } = controller;
  const { connectionsMessage } = controller;
  const pendingBipsCount = receivedBips.length + receivedGuestBips.length;
  const activeConnectionsCount =
    connections.filter((c) => c.status === "active").length +
    guestConnections.filter((c) => c.status === "active").length;
  const handleTabChange = (tab: typeof activityTab) => {
    haptic.tap();
    setActivityTab(tab);
  };
  return (
    <>
      <div className="reel-panel__eyebrow">
        <Bell aria-hidden="true" /> {t("reel.ui.activity")}
      </div>
      <h2 id="reel-panel-title">{t("reel.ui.activityHeading")}</h2>
      <div className="reel-panel__tabs" role="tablist" aria-label={t("reel.ui.activity")}>
        <button type="button" role="tab" aria-selected={activityTab === "notifications"} aria-disabled={!activityEnabled} disabled={!activityEnabled} className={activityTab === "notifications" ? "is-active" : ""} onClick={() => handleTabChange("notifications")}>
          <span>Alertes</span>
        </button>
        <button type="button" role="tab" aria-selected={activityTab === "bips"} aria-disabled={!currentPresence && !guestPresence} disabled={!currentPresence && !guestPresence} className={activityTab === "bips" ? "is-active" : ""} onClick={() => handleTabChange("bips")}>
          <span>{t("reel.ui.receivedBips")}</span>
          {pendingBipsCount > 0 && <span className="reel-panel__tab-badge">{pendingBipsCount}</span>}
        </button>
        <button type="button" role="tab" aria-selected={activityTab === "connections"} className={activityTab === "connections" ? "is-active" : ""} onClick={() => handleTabChange("connections")}>
          <span>{t("reel.ui.connectionsTab")}</span>
          {activeConnectionsCount > 0 && <span className="reel-panel__tab-badge reel-panel__tab-badge--green">{activeConnectionsCount}</span>}
        </button>
      </div>
      {activityTab === "bips" ? (
        <div className="reel-people-list" aria-live="polite">
          {bipsLoading && <p className="reel-panel__note">{t("reel.ui.bipsLoading")}</p>}
          {!canUseMemberReel && access.mode !== "guest" && (
            <p className="reel-panel__note">{t("reel.ui.publishToReceive")}</p>
          )}
          {(canUseMemberReel || access.mode === "guest") &&
            !bipsLoading &&
            receivedBips.length === 0 &&
            receivedGuestBips.length === 0 && (
              <div className="reel-panel__empty">
                <RadioTower aria-hidden="true" />
                <strong>{t("reel.ui.noBips")}</strong>
                <span>{t("reel.ui.noBipsHint")}</span>
              </div>
            )}
          {receivedBips.map((bip) => (
            <div className="reel-people-list__item" key={bip.id}>
              <span className="reel-avatar reel-avatar--small">
                <CircleUserRound aria-hidden="true" />
              </span>
              <span>
                <strong>{t("reel.ui.someoneSignaled")}</strong>
                <small>{t("reel.ui.acceptOrDecline")}</small>
              </span>
              <button type="button" onClick={() => void resolveReceivedBip(bip, "accept")}>
                {t("reel.ui.accept")}
              </button>
              <button type="button" onClick={() => void resolveReceivedBip(bip, "decline")}>
                {t("reel.ui.decline")}
              </button>
            </div>
          ))}
          {receivedGuestBips.map((bip) => (
            <div className="reel-people-list__item" key={bip.id}>
              <span className="reel-avatar reel-avatar--small">
                <CircleUserRound aria-hidden="true" />
              </span>
              <span>
                <strong>{t("reel.ui.someoneSignaled")}</strong>
                <small>{t("reel.ui.acceptOrDecline")}</small>
              </span>
              <button type="button" onClick={() => void resolveGuestBip(bip, "accept")}>
                {t("reel.ui.accept")}
              </button>
              <button type="button" onClick={() => void resolveGuestBip(bip, "decline")}>
                {t("reel.ui.decline")}
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
            <p className="reel-panel__note">{t("reel.ui.connectionsLoading")}</p>
          )}
          {access.mode === "visitor" && (
            <p className="reel-panel__note">{t("reel.ui.connectToView")}</p>
          )}
          {access.mode === "member" && !canUseMemberReel && (
            <p className="reel-panel__note">{t("reel.ui.memberNotActive")}</p>
          )}
          {access.mode === "guest" && !connectionsLoading && guestConnections.length === 0 && (
            <div className="reel-panel__empty">
              <UsersRound aria-hidden="true" />
              <strong>{t("reel.ui.guestNoConnections")}</strong>
              <span>{t("reel.ui.guestConnectionsHint")}</span>
            </div>
          )}
          {canUseMemberReel &&
            !connectionsLoading &&
            connections.length === 0 &&
            guestConnections.length === 0 && (
              <div className="reel-panel__empty">
                <UsersRound aria-hidden="true" />
                <strong>{t("reel.ui.noConnections")}</strong>
                <span>{t("reel.ui.noConnectionsHint")}</span>
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
                    ? t("reel.ui.activeConnection")
                    : t("reel.ui.endedConnection")}
                </small>
              </span>
              {connection.status === "active" && (
                <button type="button" onClick={() => void endConnection(connection)}>
                  {t("reel.ui.end")}
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
                  {connection.partner_display_name || t("reel.ui.temporaryConnection")}
                </strong>
                <small>
                  {connection.status === "active"
                    ? t("reel.ui.guestConnectionActive")
                    : t("reel.ui.connectionEnded")}
                </small>
              </span>
              {connection.status === "active" && (
                <button type="button" onClick={() => void endGuestConnection(connection)}>
                  {t("reel.ui.end")}
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
        <div className="reel-people-list" aria-live="polite">
          {(bipsLoading || connectionsLoading) && (
            <p className="reel-panel__note">{t("reel.ui.bipsLoading")}</p>
          )}
          {access.mode === "visitor" && (
            <p className="reel-panel__note">{t("reel.ui.connectToView")}</p>
          )}
          {access.mode === "member" && !canUseMemberReel && (
            <p className="reel-panel__note">{t("reel.ui.memberNotActive")}</p>
          )}
          {receivedBips.map((bip) => (
            <div className="reel-people-list__item" key={`member-bip-${bip.id}`}>
              <span className="reel-avatar reel-avatar--small">
                <RadioTower aria-hidden="true" />
              </span>
              <span>
                <strong>{t("reel.ui.someoneSignaled")}</strong>
                <small>{t("reel.ui.acceptOrDecline")}</small>
              </span>
            </div>
          ))}
          {receivedGuestBips.map((bip) => (
            <div className="reel-people-list__item" key={`guest-bip-${bip.id}`}>
              <span className="reel-avatar reel-avatar--small">
                <RadioTower aria-hidden="true" />
              </span>
              <span>
                <strong>{t("reel.ui.someoneSignaled")}</strong>
                <small>{t("reel.ui.acceptOrDecline")}</small>
              </span>
            </div>
          ))}
          {connections
            .filter((connection) => connection.status === "active")
            .map((connection) => (
              <div
                className="reel-people-list__item"
                key={`member-connection-${connection.connection_id}`}
              >
                <span className="reel-avatar reel-avatar--small">
                  <UsersRound aria-hidden="true" />
                </span>
                <span>
                  <strong>{connection.partner_display_name}</strong>
                  <small>{t("reel.ui.activeConnection")}</small>
                </span>
              </div>
            ))}
          {guestConnections
            .filter((connection) => connection.status === "active")
            .map((connection) => (
              <div
                className="reel-people-list__item"
                key={`guest-connection-${connection.connection_id}`}
              >
                <span className="reel-avatar reel-avatar--small">
                  <UsersRound aria-hidden="true" />
                </span>
                <span>
                  <strong>
                    {connection.partner_display_name || t("reel.ui.temporaryConnection")}
                  </strong>
                  <small>{t("reel.ui.guestConnectionActive")}</small>
                </span>
              </div>
            ))}
          {!bipsLoading &&
            !connectionsLoading &&
            receivedBips.length === 0 &&
            receivedGuestBips.length === 0 &&
            !connections.some((connection) => connection.status === "active") &&
            !guestConnections.some((connection) => connection.status === "active") && (
              <div className="reel-panel__empty">
                <Bell aria-hidden="true" />
                <strong>{t("reel.ui.noNotifications")}</strong>
                <span>{t("reel.ui.notificationsHint")}</span>
              </div>
            )}
          {bipsMessage && (
            <p className="reel-panel__note" role="status">
              {bipsMessage}
            </p>
          )}
          {connectionsMessage && (
            <p className="reel-panel__note" role="status">
              {connectionsMessage}
            </p>
          )}
        </div>
      )}
      {!activityEnabled && activityTab === "notifications" && (
        <p className="reel-panel__note">{t("reel.ui.calmNotifications")}</p>
      )}
    </>
  );
}
