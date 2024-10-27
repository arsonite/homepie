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
import React from 'react'; // Importing the React library
import ReactDOM from 'react-dom/client'; // Importing the ReactDOM library for rendering the application

// Components
import Application from '@/Application.tsx'; // Importing the main Application component

// Utility
import { STRICT_MODE } from '@/const.ts'

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
    return strict_mode 
        ? <React.StrictMode>{component}</React.StrictMode> // If true, wrap the component in React.StrictMode
        : component; // If false, return the component as is
}

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

// Render the main Application component into the root element of the HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
    conditionalStrictMode(STRICT_MODE, <Application />) // Render the Application component within React's StrictMode for highlighting potential problems
);
