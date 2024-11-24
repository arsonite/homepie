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
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

// Pages
import Hub from '@/pages/Hub/Hub.tsx';
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';
import NoMatch from '@/pages/NoMatch/NoMatch.tsx';

// Classes
import { AppClass } from '@/classes/AppClass.ts';

// Utility
import Path from '@/util/Path.ts';
import Storage from '@/util/Storage.ts';

// Style
import './_style/Platform.scss';

const Platform: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const [apps, setApps] = useState<AppClass[]>([]);

    const login: string = Storage.get('login', true) as string;
    if (login && window.location.pathname === '/login') {
        navigate('/');
    }

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
            {!login ? (
                <React.Fragment>
                    <Navigate to='/login' />

                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                    </Routes>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {/* <SoundControl /> */}

                    {/* <Sidebar /> */}

                    {/* <Taskbar /> */}

                    {/* <ErrorBoundary></ErrorBoundary> */}

                    <main>
                        <Routes>
                            <Route path='/' element={<Navigate replace to='hub' />} />

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
