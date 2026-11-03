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

// React imports
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// API
import * as AuthAPI from '@/api/auth.ts';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    status: AuthStatus;
    username: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Keeps track of the server-side session. The session cookie is HttpOnly, so the only way to know whether the user is
 * logged in is to ask the auth server.
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
    const [status, setStatus] = useState<AuthStatus>('loading');
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        AuthAPI.getSession().then((user) => {
            if (cancelled) {
                return;
            }
            setUsername(user);
            setStatus(user ? 'authenticated' : 'anonymous');
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (name: string, password: string): Promise<void> => {
        const user = await AuthAPI.login(name, password);
        setUsername(user);
        setStatus('authenticated');
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        await AuthAPI.logout();
        setUsername(null);
        setStatus('anonymous');
    }, []);

    const value = useMemo(() => ({ login, logout, status, username }), [login, logout, status, username]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };
