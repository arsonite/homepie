/**
 * @license
 * Copyright (C) 2024-2025 Burak Günaydin
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Client for the homepie auth server (src/server/homepie_auth).
 *
 * All requests are relative to the current origin: nginx proxies /api/auth to the auth server in production and the
 * vite dev server does the same in development, so that the session cookie always belongs to the page's own origin.
 */

const AUTH_API_ROUTE = '/api/auth';

type AuthFailure = 'invalid' | 'rate-limited' | 'unreachable';

class AuthError extends Error {
    public readonly attemptsLeft: number | null;
    public readonly failure: AuthFailure;

    public constructor(failure: AuthFailure, attemptsLeft: number | null = null) {
        super(failure);
        this.attemptsLeft = attemptsLeft;
        this.failure = failure;
    }
}

/**
 * Asks the server whether the browser holds a valid session.
 *
 * @returns The name of the logged-in user, or null if there is no valid session.
 */
const getSession = async (): Promise<string | null> => {
    try {
        const response = await fetch(`${AUTH_API_ROUTE}/session`, { credentials: 'same-origin' });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json()) as { username?: string };
        return data.username ?? null;
    } catch {
        return null;
    }
};

/**
 * Logs in and thereby sets the session cookie (valid for all of homepie.net).
 *
 * @throws {AuthError} If the credentials are wrong, there were too many attempts or the server cannot be reached.
 * @returns The name of the logged-in user.
 */
const login = async (username: string, password: string): Promise<string> => {
    let response: Response;
    try {
        response = await fetch(`${AUTH_API_ROUTE}/login`, {
            body: JSON.stringify({ password, username }),
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });
    } catch {
        throw new AuthError('unreachable');
    }

    if (response.status === 429) {
        throw new AuthError('rate-limited');
    }
    if (response.status === 401) {
        const data = (await response.json().catch(() => ({}))) as { attempts_left?: number };
        throw new AuthError('invalid', data.attempts_left ?? null);
    }
    if (!response.ok) {
        throw new AuthError('unreachable');
    }
    const data = (await response.json()) as { username?: string };
    return data.username ?? username;
};

const logout = async (): Promise<void> => {
    try {
        await fetch(`${AUTH_API_ROUTE}/logout`, { credentials: 'same-origin', method: 'POST' });
    } catch {
        // The session expires on its own, nothing else to do on the client
    }
};

export { AuthError, getSession, login, logout };
export type { AuthFailure };
