/**
 * @license
 * Copyright (c) 2024-2024 Burak Günaydin
 * All Rights Reserved
 * 
 * This software is the confidential and proprietary information of
 * Burak Günaydin. You may not use, modify, or distribute this
 * software (unless you have the permission of the copyright holder)
 * except in accordance with the terms of any applicable license agreement.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

// React imports
import React, { useState } from 'react';

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
    is_animation?: true | false; // Flag to determine if the icon is an animation
    src: string[]; // Source paths for the SVG
    style?: React.CSSProperties; // Inline styles for the icon
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Click event handler
    onError?: () => ErrorCallback | undefined; // Error event handler
    onLoad?: () => LoadCallback | undefined; // Load event handler
}

/**
 * Icon component to render SVG icons with optional animation and error handling.
 * 
 * @param {IconProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered Icon component
 */
const Icon: React.FC<IconProps> = (props) => {
    // State to manage alternative sources for the SVG
    const [alternative_src, setAlternativeSrc] = useState<string[]>([]);
    // State to track the error loop count
    const [error_loop, setErrorLoop] = useState<number>(0);
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

    return (
        <picture id={props.id} className={`icon ${props.className ? props.className : ''}`} onClick={props.onClick}>
            <SVG
                cacheRequests
                src={
                    props.is_animation
                        ? Path.getAnimationPath(...props.src) // Use animation path if is_animation is true
                        : use_alternative_src
                        ? Path.getIconPath(...alternative_src) // Use alternative source if set
                        : Path.getIconPath(...props.src) // Use primary source
                }
                style={props.style}
                onError={props.onError ? props.onError : defaultErrorHandler} // Use custom error handler if provided, otherwise use default
                onLoad={props.onLoad} // Use custom load handler if provided
            />
        </picture>
    );
};

export default Icon;