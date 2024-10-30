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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALI* NGS IN THE
 * SOFTWARE.
 */

/**
 * @constant {boolean} DEBUG_FLAG
 * @description This constant is used to determine if the application is running in development mode.
 * It leverages the `import.meta.env.DEV` property provided by the build tool (e.g., Vite) to check the environment.
 * When `import.meta.env.DEV` is `true`, the application is in development mode; otherwise, it is in production mode.
 */
const DEBUG_FLAG: boolean = import.meta.env.DEV;

/**
 * @constant
 * @name API_ROUTE
 * @description Configuration object for API routing.
 * 
 * This object contains the necessary configuration for constructing the API endpoint URL.
 * It dynamically adjusts based on the `DEBUG_FLAG` to switch between development and production environments.
 * 
 * @property {string} sub - Subdomain, e.g. 'api.', 'services.', etc.
 * @property {string} protocol - Internet-protocol used (either HTTP or HTTPS). Uses 'http://' if `DEBUG_FLAG` is true, otherwise uses the current window's protocol.
 * @property {string} url - Host URL. Uses '0.0.0.0' if `DEBUG_FLAG` is true, otherwise uses the current window's host.
 * @property {string} tld - Top-level domain, e.g. '.de', '.com', '.org', '.net'.
 * @property {number} port - Exposed port of the API server for access through the internet. Uses port 8888 if `DEBUG_FLAG` is true, otherwise uses port 443.
 * @property {string} root - Root path of the API.
 */
const API_ROUTE = {
    sub: '', // Subdomain, e.g. 'api.', 'services.', etc.
    protocol: DEBUG_FLAG ? 'http://' : window.location.protocol + '//', // Internet-protocol used (either HTTP or HTTPS)
    url: DEBUG_FLAG ? '0.0.0.0' : window.location.host, // Host-url
    tld: '', // Top-level-domain, e.g. '.de', '.com', '.org', '.net'
    port: DEBUG_FLAG ? 8888 : 443, // Exposed port of API-server for access through internet
    root: 'api',
};

// Current version of the frontend, necessary to empty cache upon crucial changes in storage structure
/**
 * The current version of the client application.
 * 
 * This constant holds the version number of the client application as a string.
 * It is used to track the version of the client that is running, which can be
 * useful for debugging, logging, and ensuring compatibility with other parts
 * of the system.
 * 
 * @constant {string}
 */
const CLIENT_VERSION: string = "0.0.1";

/**
 * @constant
 * @name HTTP_ENCODING
 * @description
 * An object that maps special characters to their corresponding HTTP encoding representations.
 * This can be used to encode characters in URLs or other HTTP-related contexts where certain characters
 * need to be replaced with specific encoded values.
 * 
 * @property {string} DOT - Represents the encoding for a dot ('.') character.
 * @property {string} SPACE - Represents the encoding for a space (' ') character.
 * @property {string} TAB - Represents the encoding for a tab ('\t') character.
 */
const HTTP_ENCODING = {
    DOT: '_',
    SPACE: '-',
    TAB: '+'
};

// TODO: Future kiosk mode implementation
/**
 * @constant {boolean} KIOSK_FLAG
 * @description A flag indicating whether the application is running in kiosk mode.
 * @default false
 */
const KIOSK_FLAG: boolean = false;

/**
 * @constant
 * @name RGB
 * @description
 * An object representing the minimum and maximum values for RGB color components.
 * 
 * @property {number} MAX - The maximum value for an RGB color component (255).
 * @property {number} MIN - The minimum value for an RGB color component (0).
 */
const RGB = {
    MAX: 255,
    MIN: 0
}

/**
 * @constant {string} SECRET_KEY
 * @description
 * A constant string that holds a secret key used for authentication or encryption purposes.
 * 
 * @note
 * Ensure that this key is kept secure and not exposed in public repositories or logs.
 * 
 * @example
 * // Usage example
 * const encryptedData = encryptData(data, SECRET_KEY);
 * 
 * @warning
 * Hardcoding secret keys in the source code is not recommended for production environments.
 * Consider using environment variables or secure vaults to manage sensitive information.
 */
const SECRET_KEY: string = 'secret-debug-key';

/**
 * @constant {boolean} STRICT_MODE
 * @description
 * This constant is used to enable or disable strict mode throughout the application.
 * When set to `true`, the application will enforce stricter rules and validations,
 * potentially catching more errors and enforcing best practices.
 * 
 * @example
 * if (STRICT_MODE) {
 *   // Perform strict mode specific operations
 * }
 */
const STRICT_MODE: boolean = false;

/**
 * A constant boolean flag used to enable or disable verbose logging throughout the application.
 * 
 * When `VERBOSE_FLAG` is set to `true`, the application will output detailed log messages
 * for debugging and monitoring purposes. If set to `false`, the application will suppress
 * these detailed logs, potentially improving performance but reducing the amount of runtime
 * information available.
 */
const VERBOSE_FLAG: boolean = true;

/**
 * @file /usr/local/src/homepie/src/client/src/const.ts
 * @description This module exports several constants used throughout the client application.
 * 
 * @exports DEBUG_FLAG - A flag indicating whether the application is in debug mode.
 * @exports API_ROUTE - The base route for the API endpoints.
 * @exports CLIENT_VERSION - The current version of the client application.
 * @exports HTTP_ENCODING - The encoding type used for HTTP requests.
 * @exports KIOSK_FLAG - A flag indicating whether the application is running in kiosk mode.
 * @exports SECRET_KEY - A secret key used for encryption or authentication purposes.
 * @exports VERBOSE_FLAG - A flag indicating whether verbose logging is enabled.
 */
export {
    DEBUG_FLAG,
    API_ROUTE,
    CLIENT_VERSION,
    HTTP_ENCODING,
    KIOSK_FLAG,
    RGB,
    SECRET_KEY,
    STRICT_MODE,
    VERBOSE_FLAG,
}