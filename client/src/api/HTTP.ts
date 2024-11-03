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

// Package imports
import axios from 'axios';

// Constants
import { API_ROUTE, HTTP_ENCODING } from '@/const.ts';

/**
 * Builds the request URL based on the API_ROUTE constants.
 * @returns {string} The constructed URL.
 */
const buildRequestURL = (): string => {
    /**
     * Returns the default value if the provided value is truthy, otherwise returns an empty string.
     * @param {string} value - The value to check.
     * @param {string} defaultValue - The default value to return if the value is truthy.
     * @returns {string} The default value or an empty string.
     */
    const getValue = (value: string, defaultValue: string): string => {
        return value ? defaultValue : '';
    };

    // Initialize URL with subdomain if available
    let url = getValue(API_ROUTE.sub, `${API_ROUTE.sub}.`);
    // Append protocol (e.g., 'https://')
    url += API_ROUTE.protocol;
    // Append base URL
    url += API_ROUTE.url;
    // Append top-level domain if available
    url += getValue(API_ROUTE.tld, `.${API_ROUTE.tld}`);
    // Append port if specified
    url += getValue(API_ROUTE.port.toString(), `:${API_ROUTE.port}`);
    // Ensure URL ends with a slash
    url += '/';
    // Append root path if available
    url += getValue(API_ROUTE.root, `${API_ROUTE.root}/`);
    return url;
};

// The base request URL constructed using the buildRequestURL function
const requestURL = buildRequestURL();

/**
 * Creates a closure that constructs a URL with the given URIs and parameters.
 * @param {...string} uris - The URIs to append to the base URL.
 * @returns {function(...string): string} A function that takes parameters and returns the full URL.
 */
const createRequestClosure = (...uris: string[]): (...params: string[]) => string => {
    return (...params: string[]): string => {
        // Start with the base request URL and append joined URIs
        let url = `${requestURL}${uris.join('/')}`;
        // If there are parameters, append them as additional path segments
        if (params.length > 0) {
            url += '/' + params.join('/');
        }
        return url;
    };
};

/**
 * Encodes the given arguments into a URL-friendly format.
 * @param {...string} args - The arguments to encode.
 * @returns {string} The encoded URL.
 */
const encodeURL = (...args: string[]): string => {
    return args.join('/')
        .replace(/\s+/g, HTTP_ENCODING.SPACE) // Replace spaces with the encoding for space
        .replace(/\./g, HTTP_ENCODING.DOT) // Replace dots with the encoding for dot
        .toLowerCase(); // Convert the entire string to lowercase
};

/**
 * Decodes the given URL from the encoded format.
 * @param {string} url - The encoded URL to decode.
 * @returns {string} The decoded URL.
 */
const decodeURL = (url: string): string => {
    // Create a regular expression to match encoded spaces
    const spaceRegex = new RegExp(`\\${HTTP_ENCODING.SPACE}`, 'g');
    return url.split('-') // Split the URL by hyphens
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' ') // Join the words with spaces
        .replace(spaceRegex, ' '); // Replace encoded spaces with actual spaces
};

/**
 * Handles errors by checking the response and status properties.
 * @param {object} error - The error object.
 * @param {unknown} [error.response] - The response property of the error.
 * @param {unknown} [error.status] - The status property of the error.
 * @returns {object} The error response or a default error object.
 */
const handleError = (error: { response?: unknown; status?: unknown; }) => {
    // Check if the error has response and status properties
    if (!error.response || !error.status) {
        return error.response;
    }
    // Return a default error object with a 408 status code
    return { code: 408, message: 'Server not reachable.' };
};

// Exporting axios methods and utility functions
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    patch: axios.patch,
};

export {
    HTTP_ENCODING,
    decodeURL,
    encodeURL,
    createRequestClosure as requestClosure,
    handleError as throwError
};