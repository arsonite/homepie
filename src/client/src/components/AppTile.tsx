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
import React, { useRef } from 'react';

// Apps
import { ExternalApp, getExternalAppUrl } from '@/apps/registry.ts';

// Components
import { ParticleFocus } from '@/components/Particles/Effect.tsx';

// Style
import './_style/AppTile.scss';

interface AppTileProps {
    app: ExternalApp;
    /** Called with the app and where the grid should bulge (behind the icon), or with null when the tile is left. */
    onHover?: (app: ExternalApp | null, focus?: ParticleFocus) => void;
}

/**
 * Clickable tile that navigates to an app under /<name>/.
 */
const AppTile: React.FC<AppTileProps> = ({ app, onHover }: AppTileProps): JSX.Element => {
    const iconRef = useRef<HTMLSpanElement>(null);
    const style = { '--app-color': app.color } as React.CSSProperties;

    const hover = () => {
        const rect = iconRef.current?.getBoundingClientRect();
        if (!rect) return onHover?.(app);
        onHover?.(app, {
            radius: rect.width * 2.8, // Wider than the bulge around the cursor (110px)
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
    };

    return (
        <a
            className='app-tile'
            href={getExternalAppUrl(app)}
            onBlur={() => onHover?.(null)}
            onFocus={hover}
            onMouseEnter={hover}
            onMouseLeave={() => onHover?.(null)}
            style={style}
            title={app.description}
        >
            <span className='app-tile-icon' ref={iconRef}>{app.displayName.charAt(0)}</span>
            <span className='app-tile-name'>{app.displayName}</span>
        </a>
    );
};

export default AppTile;
