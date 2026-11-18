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
import React, { useState } from 'react';

// API
import { useAuth } from '@/api/AuthContext.tsx';

// Apps
import { EXTERNAL_APPS, ExternalApp } from '@/apps/registry.ts';

// Components
import AppTile from '@/components/AppTile.tsx';
import CollisionParticles from '@/components/Particles/CollisionParticles.tsx';
import { ParticleFocus } from '@/components/Particles/Effect.tsx';

// Style
import './_style/Hub.scss';

const Hub: React.FC = () => {
    const { logout, username } = useAuth();
    const [hoveredApp, setHoveredApp] = useState<ExternalApp | null>(null);
    const [focus, setFocus] = useState<ParticleFocus | undefined>(undefined);

    const hover = (app: ExternalApp | null, where?: ParticleFocus) => {
        setHoveredApp(app);
        setFocus(where);
    };

    return (
        <div id='hub'>
            <div id='hub-backdrop'>
                {EXTERNAL_APPS.map((app) => (
                    <div
                        className={`hub-backdrop-layer${hoveredApp === app ? ' active' : ''}`}
                        key={app.name}
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${app.gradient[0]}, ${app.gradient[1]} 75%)`,
                        }}
                    />
                ))}
            </div>

            <CollisionParticles
                focus={focus}
                focusColors={hoveredApp?.gradient}
                mouseTracking
                effectGap={20}
                effectRadius={3000}
                particleEase={0.2}
                particleFriction={0.95}
            />

            <div id='hub-session'>
                <span id='hub-username'>{username}</span>
                <button id='hub-logout' onClick={() => void logout()} type='button'>
                    Log out
                </button>
            </div>

            <div id='hub-apps'>
                {EXTERNAL_APPS.map((app) => (
                    <AppTile key={app.name} app={app} onHover={hover} />
                ))}
            </div>
        </div>
    );
};

export default Hub;
