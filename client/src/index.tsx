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
import React from 'react'; // Importing the React library
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'; // Importing the ReactDOM library for rendering the application

// Components
import Application from '@/Application.tsx'; // Importing the main Application component

// Utility
import { STRICT_MODE } from '@/const.ts';

// Style
import './_style/index.scss'; // Importing the global CSS file

/**
 * Function to conditionally wrap a component in React's StrictMode.
 * @param {boolean} strict_mode - A flag indicating whether to enable StrictMode.
 * @param {JSX.Element} component - The React component to be conditionally wrapped.
 * @returns {JSX.Element} The component wrapped in StrictMode if strict_mode is true, otherwise the component itself.
 */
const conditionalStrictMode = (strict_mode: boolean, component: JSX.Element): JSX.Element => {
    // Check if strict_mode is true
    return strict_mode ? (
        <React.StrictMode>{component}</React.StrictMode> // If true, wrap the component in React.StrictMode
    ) : (
        component
    ); // If false, return the component as is
};

/**
 * Function to define a prototype function 'capitalize' on the String object.
 * This function will capitalize the first letter of any string.
 */
const defineCapitalizePrototypeFunction = () => {
    // Adding a new property 'capitalize' to the String prototype
    Object.defineProperty(String.prototype, 'capitalize', {
        /**
         * The value of the 'capitalize' property is a function that capitalizes the first letter of the string.
         * @returns {string} The string with the first letter capitalized.
         */
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1); // Capitalize the first letter and concatenate with the rest of the string
        },
        enumerable: false, // The property will not be enumerable
    });
};

// Call the function to define the 'capitalize' prototype function
defineCapitalizePrototypeFunction();

/* createRoot(rootElement) is a React utility function used to create a react root element,
 * which is a DOM element in which UI components render themselves.
 * It takes as a parameter the root element that should be created.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
    /* StrictMode enables additional development behaviors and warnings for the component tree inside.
     * It triggers a lot of re-renders, but is disabled in production automatically.
     *
     * BrowserRouting is necessary for REST-conform routing.
     * Allows to apply routing, redirects and switches for dynamic rich-client changes in the front-end.
     */
    conditionalStrictMode(
        STRICT_MODE,
        <BrowserRouter>
            <Application />
        </BrowserRouter>
    ) // Render the Application component within React's StrictMode for highlighting potential problems
);
