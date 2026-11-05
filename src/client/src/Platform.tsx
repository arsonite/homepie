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
import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

// API
import { EXTERNAL_APPS, getExternalAppUrl } from '@/apps/registry.ts';
import { useAuth } from '@/api/AuthContext.tsx';

// Pages
import Hub from '@/pages/Hub/Hub.tsx';
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';
import NoMatch from '@/pages/NoMatch/NoMatch.tsx';

// Classes
import { AppClass } from '@/classes/AppClass.ts';

// Utility
import Path from '@/util/Path.ts';

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

    const [apps, setApps] = useState<AppClass[]>([]);

    const login: boolean = status === 'authenticated';

    const appsPath: string = Path.getAbsolutePath(import.meta.url) + 'apps';
    const appsWhitelist: string[] = useMemo(
        () => [
            // 'behance',
            // 'clover',
            // 'crastinathor',
            'fingerwarmer',
            // 'lockkliye',
            'namegen',
            'quickquill',
            // 'scrumbag',
            // 'tickfit',
            // 'timely',
        ],
        []
    );

    useEffect(() => {
        if (!login) {
            return;
        }

        async function importComponents() {
            const importedApps = await Promise.all(
                appsWhitelist.map(async (page_name) => {
                    const component_name = page_name;
                    const imported_component = await import(`./${appsPath}/${component_name}/App.tsx`);
                    const component_meta = imported_component.meta;
                    return new AppClass({ ...component_meta, component: imported_component.default });
                })
            );
            setApps(importedApps);
        }

        importComponents();
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [login]);

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

                            {/* {apps.map((app) => {
                                const Component = app.component as React.FC;
                                return (
                                    <Route
                                        key={app.name}
                                        // Trailing '*' necessary to render nested routes
                                        path={`${app.encodedName}/*`}
                                        element={<Component />}
                                    />
                                );
                            })} */}

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
