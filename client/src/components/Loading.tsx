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
