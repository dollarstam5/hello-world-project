import type { PullRequest, PullResult, PushRequest, PushResult } from "@eco/core-contracts";

/** Network side of the engine. One implementation per runtime. */
export interface SyncTransport {
  pull(request: PullRequest): Promise<PullResult>;
  push(request: PushRequest): Promise<PushResult>;
}

/** Thrown when the backend refused the credentials — retrying will not help. */
export class SyncAuthError extends Error {
  constructor(message = "unauthorized") {
    super(message);
    this.name = "SyncAuthError";
  }
}

/** Thrown when the network is unreachable — retrying later will help. */
export class SyncNetworkError extends Error {
  constructor(message = "offline") {
    super(message);
    this.name = "SyncNetworkError";
  }
}

export interface HttpTransportOptions {
  /** Absolute or same-origin base path of the sync endpoints. */
  baseUrl: string;
  /** Returns the current access token, or null when signed out. */
  getAccessToken: () => string | null;
  fetchImpl?: typeof fetch;
}

/** Transport talking to the backend sync endpoints over plain HTTP. */
export function createHttpTransport(options: HttpTransportOptions): SyncTransport {
  const doFetch = options.fetchImpl ?? fetch;

  async function call<TBody, TResult>(path: string, body: TBody): Promise<TResult> {
    const token = options.getAccessToken();
    if (!token) throw new SyncAuthError("no_session");

    let response: Response;
    try {
      response = await doFetch(`${options.baseUrl}${path}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw new SyncNetworkError(error instanceof Error ? error.message : "network");
    }

    if (response.status === 401 || response.status === 403) {
      throw new SyncAuthError();
    }
    if (!response.ok) {
      throw new SyncNetworkError(`http_${response.status}`);
    }
    return (await response.json()) as TResult;
  }

  return {
    pull: (request: PullRequest) => call<PullRequest, PullResult>("/pull", request),
    push: (request: PushRequest) => call<PushRequest, PushResult>("/push", request),
  };
}
