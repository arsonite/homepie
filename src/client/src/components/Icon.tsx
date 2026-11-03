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
import React, { useEffect, useState } from 'react';

// Package imports
import SVG, { LoadCallback, ErrorCallback } from 'react-inlinesvg';

// Utility
import Path from '@/util/Path.ts';

// Styles
import './_style/Icon.scss';

/**
 * Interface for Icon component props.
 */
interface IconProps {
    alternative_src?: string[]; // Alternative sources for the SVG
    className?: string; // CSS class for the icon
    id?: string; // ID for the icon element
    is_animation?: true; // Flag to determine if the icon is an animation
    is_image?: true; // Flag to determine if the icon is an animation
    positioning?: 'absolute' | 'relative';
    style?: React.CSSProperties; // CSS style for the icon
    src: string[]; // Source paths for the SVG
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Click event handler
    onError?: () => ErrorCallback | undefined; // Error event handler
    onLoad?: () => LoadCallback | undefined; // Load event handler
    onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Mouse enter event handler
    onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Mouse leave event handler
    onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void; // Touch start event handler
    onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void; // Touch end event handler
}

/**
 * Icon component to render SVG icons with optional animation and error handling.
 *
 * @param {IconProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered Icon component
 */
const Icon: React.FC<IconProps> = (props: IconProps): JSX.Element => {
    // State to manage alternative sources for the SVG
    const [alternative_src, setAlternativeSrc] = useState<string[]>([]);
    // State to track the error loop count
    const [error_loop, setErrorLoop] = useState<number>(0);
    const [src, setSrc] = useState<string>(Path.getIconPath(...props.src));
    // State to determine if alternative sources should be used
    const [use_alternative_src, setUseAlternativeSrc] = useState<boolean>(false);

    // TODO: Find a way to surpress the 404 not found svg spam
    /**
     * Default error handler to manage SVG loading errors.
     *
     * This function attempts to load alternative sources if the primary source fails.
     */
    const defaultErrorHandler = () => {
        if (error_loop === 0) {
            // If this is the first error, duplicate the last source and set it as alternative
            const deeper_duplicate_node: string[] = props.src;
            deeper_duplicate_node.push(props.src[props.src.length - 1]);
            setAlternativeSrc(deeper_duplicate_node);
            setErrorLoop(1);
            setUseAlternativeSrc(true);
        } else if (error_loop === 1) {
            // If this is the second error, set a common fallback source
            setAlternativeSrc(['common', '']);
        }

        return () => {};
    };

    useEffect(() => {
        let path_src;
        if (props.is_image) {
            path_src = Path.getImagePath(...props.src);
        } else if (props.is_animation) {
            path_src = Path.getAnimationPath(...props.src);
        } else if (use_alternative_src) {
            path_src = Path.getIconPath(...alternative_src); // Use alternative source if set
        } else {
            path_src = Path.getIconPath(...props.src); // Use primary source
        }
        setSrc(path_src);
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alternative_src, src]);

    let class_name = 'icon';
    class_name += props.className ? ' ' + props.className : '';
    class_name += props.positioning ? ' ' + props.positioning : ' relative';

    return (
        <picture
            className={class_name}
            id={props.id}
            style={props.style}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
            onTouchEnd={props.onTouchEnd}
        >
            {props.is_image ? (
                <img src={src} />
            ) : (
                <SVG
                    cacheRequests
                    uniquifyIDs
                    // loader={<div>Loading...</div>}
                    src={src}
                    onError={props.onError ? props.onError : defaultErrorHandler} // Use custom error handler if provided, otherwise use default
                    onLoad={props.onLoad} // Use custom load handler if provided
                />
            )}
        </picture>
    );
};

export default Icon;
