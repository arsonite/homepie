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
 * An app that is reverse-proxied by nginx under https://homepie.net/<name>/, so it stays on the same origin as the
 * hub (a subdomain would leave the fullscreen home screen app on iOS).
 * Every app listed here also needs a line in src/nginx/conf.d/00-homepie-apps.conf.
 */
interface ExternalApp {
    readonly description: string;
    readonly displayName: string;
    /** 6-digit hex color of the tile: border, letter and the fill while hovered. */
    readonly color: string;
    /** Two 6-digit hex colors, used for the bulge behind the tile and the Hub background while it is hovered. */
    readonly gradient: readonly [string, string];
    /** Path segment of the app, the same as in 00-homepie-apps.conf. */
    readonly name: string;
}

const EXTERNAL_APPS: readonly ExternalApp[] = [
    {
        description: 'A powerful and convenient web text editor',
        displayName: 'Lockkliye',
        // The accent of Lockkliye (light orange) and its lighter hover shade
        color: '#ff9500',
        gradient: ['#ffaa33', '#ff9500'],
        name: 'lockkliye',
    },
];

const getExternalAppUrl = (app: ExternalApp): string => `/${app.name}/`;

export { EXTERNAL_APPS, getExternalAppUrl };
export type { ExternalApp };
