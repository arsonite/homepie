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
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

// API
import { EXTERNAL_APPS, getExternalAppUrl } from '@/apps/registry.ts';
import { useAuth } from '@/api/AuthContext.tsx';

// Pages
import Hub from '@/pages/Hub/Hub.tsx';
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';
import NoMatch from '@/pages/NoMatch/NoMatch.tsx';

// Style
import './_style/Platform.scss';

/**
 * Where an authenticated user ends up on /login: back at the app that sent them here (`?app=<name>`, set by nginx
 * for unauthenticated requests to an app path) or else on the hub. Only apps from the registry are accepted, so
 * that /login cannot be abused as an open redirect.
 */
const PostLoginRedirect: React.FC = (): JSX.Element => {
    const [searchParams] = useSearchParams();
    const app = EXTERNAL_APPS.find((candidate) => candidate.name === searchParams.get('app'));

    useEffect(() => {
        if (app) {
            window.location.replace(getExternalAppUrl(app));
        }
    }, [app]);

    return app ? <React.Fragment /> : <Navigate replace to='/hub' />;
};

const Platform: React.FC = (): JSX.Element => {
    const { status } = useAuth();

    const login: boolean = status === 'authenticated';

    return (
        <div id='homepie-platform'>
            {status === 'loading' ? null : !login ? (
                <Routes>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='*' element={<Navigate replace to='/login' />} />
                </Routes>
            ) : (
                <React.Fragment>
                    {/* <SoundControl /> */}

                    {/* <Sidebar /> */}

                    {/* <Taskbar /> */}

                    {/* <ErrorBoundary></ErrorBoundary> */}

                    <main>
                        <Routes>
                            <Route path='/' element={<Navigate replace to='hub' />} />

                            <Route path='/login' element={<PostLoginRedirect />} />

                            <Route key='hub' path='/hub' element={<Hub />} />

                            {/* Catching all manually typed non-matches and automatic miss-matches */}
                            <Route path='*' element={<NoMatch />} />
                        </Routes>
                    </main>
                </React.Fragment>
            )}
        </div>
    );
};

export default Platform;
