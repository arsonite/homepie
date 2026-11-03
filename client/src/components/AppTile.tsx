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

// Apps
import { ExternalApp, getExternalAppUrl } from '@/apps/registry.ts';

// Style
import './_style/AppTile.scss';

interface AppTileProps {
    app: ExternalApp;
}

/**
 * Clickable tile that navigates to an app on its own subdomain.
 */
const AppTile: React.FC<AppTileProps> = ({ app }: AppTileProps): JSX.Element => {
    return (
        <a className='app-tile' href={getExternalAppUrl(app)} title={app.description}>
            <span className='app-tile-icon'>{app.displayName.charAt(0)}</span>
            <span className='app-tile-name'>{app.displayName}</span>
        </a>
    );
};

export default AppTile;
