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
import './_style/Loading.scss';

/**
 * Interface for Loading component props.
 * @property {boolean} loading - Flag to indicate if the loading animation should be displayed.
 * @property {'absolute' | 'relative'} positioning - CSS positioning of the loading animation.
 * @property {'smooth-circle'} [type] - Type of loading animation to display.
 */
interface LoadingProps {
    loading: boolean;
    positioning: 'absolute' | 'relative';
    type?: 'smooth-circle';
}

/**
 * Loading component to display a loading animation based on the provided props.
 *
 * @param {LoadingProps} props - Props to configure the loading component.
 * @returns {JSX.Element | null} - Returns the loading animation or null if not loading.
 */
const Loading: React.FC<LoadingProps> = (props: LoadingProps): JSX.Element | null => {
    // If loading is false, do not render anything
    if (!props.loading) {
        return null;
    }

    // Determine the type of loading animation to use, defaulting to 'short-spin' if not provided
    const type = props.type ? props.type : 'short-spin';

    // Render the Icon component with the appropriate class and source based on the props
    return <Icon is_animation className={`loading ${props.positioning}`} src={[type]} />;
};

export default Loading;
