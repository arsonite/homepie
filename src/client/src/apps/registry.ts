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
 * Base domain that all apps are published under, e.g. https://lockkliye.homepie.net
 */
const BASE_DOMAIN = 'homepie.net';

/**
 * An app that runs on its own subdomain and is reverse-proxied by nginx.
 * Every app listed here also needs a line in src/nginx/conf.d/00-homepie-apps.conf.
 */
interface ExternalApp {
    readonly description: string;
    readonly displayName: string;
    /** Two 6-digit hex colors, used for the tile, the hover letter and the Hub background. */
    readonly gradient: readonly [string, string];
    readonly name: string;
    readonly subdomain: string;
}

const EXTERNAL_APPS: readonly ExternalApp[] = [
    {
        description: 'A powerful and convenient web text editor',
        displayName: 'Lockkliye',
        gradient: ['#7a5cff', '#2fc4ff'],
        name: 'lockkliye',
        subdomain: 'lockkliye',
    },
];

const getExternalAppUrl = (app: ExternalApp): string => `https://${app.subdomain}.${BASE_DOMAIN}`;

export { EXTERNAL_APPS, getExternalAppUrl };
export type { ExternalApp };
