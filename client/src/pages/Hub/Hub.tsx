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
import React from 'react';

// Components
import CollisionParticles from '@/components/Particles/CollisionParticles.tsx';

const Hub: React.FC = () => {
    return (
        <div id='hub'>
            <CollisionParticles
                // mouseTracking
                effectGap={20}
                effectRadius={3000}
                particleEase={0.2}
                particleFriction={0.95}
            />
        </div>
    );
};

export default Hub;
