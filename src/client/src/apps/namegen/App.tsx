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

// Classes
import { AppClass } from '@/classes/AppClass.ts';

// eslint-disable-next-line react-refresh/only-export-components
export const meta: AppClass = {
    name: 'NameGen',
};

const App: React.FC = () => {
    return (
        <div id='namegen-app'>
            <p>namegen</p>
        </div>
    );
};

export default App;
