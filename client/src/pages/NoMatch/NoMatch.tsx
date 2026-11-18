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
import Icon from '@/components/Icon.tsx';

// Style
import './_style/NoMatch.scss';

const NoMatch: React.FC = () => {
    const currentPath = window.location.pathname;

    return (
        <div id='no-match'>
            <p id='url'>{'>' + currentPath}</p>

            <Icon src={['pages', 'no-match']} />

            <p id='error-text'>This path does not exist.</p>
        </div>
    );
};

export default NoMatch;
