export interface ReelLocationFix {
  latitude: number;
  longitude: number;
  accuracy: number;
}

/**
 * Requests a one-shot location fix only after an explicit action inside Réel.
 * The coordinates are returned to the caller and are never persisted here.
 * No watch, background tracking, or cross-engine consent is used.
 */
export function requestReelLocation(): Promise<ReelLocationFix> {
  if (typeof window === "undefined" || !window.isSecureContext) {
    return Promise.reject(
      new Error(
        "La position nécessite une connexion sécurisée. Vous pouvez continuer sans la partager.",
      ),
    );
  }
  if (!("geolocation" in navigator)) {
    return Promise.reject(
      new Error(
        "La position n’est pas disponible sur cet appareil. Réel reste accessible en mode calme.",
      ),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        }),
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "L’accès à la position est désactivé dans les réglages de votre appareil. Vous pouvez continuer tranquillement sans l’activer."
            : error.code === error.TIMEOUT
              ? "La position met trop de temps à répondre. Vous pouvez réessayer ou continuer sans la partager."
              : "Nous n’arrivons pas à obtenir votre position pour le moment. Réel reste accessible en mode calme.";
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 12000,
      },
    );
  });
}
