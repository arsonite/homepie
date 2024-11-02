/**
 * @license
 * Copyright (c) 2024-2024 Burak Günaydin
 * All Rights Reserved
 *
 * This software is the confidential and proprietary information of
 * Burak Günaydin. You may not use, modify, or distribute this
 * software (unless you have the permission of the copyright holder)
 * except in accordance with the terms of any applicable license agreement.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// React imports
import React from 'react';
import { Navigate } from 'react-router-dom';

// Components
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';

// Style
import './_style/Application.scss';

const Application: React.FC = (): JSX.Element => {
    return (
        <div id='homepie-application'>
            {/* <SoundControl /> */}

            {!login ? (
                <React.Fragment>
                    <Navigate to='/login' />

                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                    </Routes>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <RootPathProvider initial_root_path={pages_root_path}>
                        <Sidebar pages={pages} />
                    </RootPathProvider>

                    <div id='content_frame'>
                        <RootPathProvider initial_root_path={pages_root_path}>
                            <Taskbar />
                        </RootPathProvider>

                        <main>
                            <ErrorBoundary>
                                {enabled_pages.length > 0 && (
                                    <Routes>
                                        {/* Redirecting "/" to first entry in enabled-pages-array */}
                                        <Route
                                            path='/'
                                            element={
                                                <Navigate replace to={enabled_pages[0]['encoded_name'] as string} />
                                            }
                                            // TODO: Temporary redirection to respective role hubs until dashboard is ready
                                            // element={userSpecificRedirection(login, enabled_pages)}
                                        />

                                        {enabled_pages.map((enabled_page) => {
                                            const Component = enabled_page.component as React.FC;
                                            return (
                                                <Route
                                                    key={Page.name}
                                                    // Trailing '*' necessary to render nested routes
                                                    path={`${enabled_page.encoded_name}/*`}
                                                    element={<Component />}
                                                />
                                            );
                                        })}

                                        {/* Catching all manually typed non-matches and automatic miss-matches */}
                                        <Route path='*' element={<NoMatch />} />
                                    </Routes>
                                )}
                            </ErrorBoundary>
                        </main>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default Application;
