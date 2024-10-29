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

class Path {
    /**
     * Parses a path using the root and arguments provided.
     * @param root The root path.
     * @param args An array of path arguments.
     * @returns The assembled path.
     */
    public static readonly parsePath = (args: string[]): string => {
        // Initialize the URI with the root path prefixed by a slash
        let uri = '';
        // Iterate over each argument and append it to the URI, prefixed by a slash
        args.forEach((arg, index) => {
            uri += arg;
            if (index > 0) {
                uri += '/';
            }
        });
        // Return the assembled URI
        return uri;
    };

    /**
     * Gets the absolute path based on the meta URL.
     * @param meta_url The meta URL.
     * @returns The absolute path.
     */
    public static readonly getAbsolutePath = (meta_url: string): string => {
        // Extracts the absolute path from a meta URL
        const path: string = meta_url
            // Removes the origin part of the URL, leaving only the path
            .replace(window.location.origin, '')
            // Removes any query parameters from the URL
            .replace(/\?.*/, '')
            // Removes any double backslashes from the URL
            .replace('\\\\', '');

        // Splits the path into an array of segments using '/' as the delimiter
        const pathArray: string[] = path.split('/');

        // Removes the first two segments (usually empty strings or 'http:' or 'https:')
        // and the last segment (usually the filename), then joins the remaining segments back into a string
        const absolutePath: string = pathArray
            // Skips the first two segments and the last segment
            .slice(2, pathArray.length - 1)
            // Joins the remaining segments back into a string to form the absolute path
            .join('/');

        // Returns the absolute path
        return absolutePath;
    };

    /**
     * Gets the component path based on the meta URL.
     * @param meta_url The meta URL containing the path to the component file.
     * @returns The component path extracted from the meta URL.
     */
    public static readonly getComponentPath = (meta_url: string): string => {
        // Remove the origin part of the URL, leaving only the path
        let componentPath: string = meta_url.replace(window.location.origin, '');

        // Remove any query parameters from the URL
        componentPath = componentPath.replace(/\?.*/, '');

        // Replace any double backslashes in the URL with single backslashes
        componentPath = componentPath.replace('\\\\', '');

        // Return the extracted component path
        return componentPath;
    };

    /**
     * Returns the root path for assets.
     *
     * This method provides a consistent way to reference the root directory
     * for assets within the application. It helps in maintaining a single
     * point of truth for asset paths, making it easier to manage and update
     * asset locations if needed.
     *
     * @returns {string} The root path for assets, which is '@/assets'.
     */
    public static readonly getAssetRootPath = (): string => {
        return '/src/assets';
    }

    /**
     * Generates the path for an animation.
     * @param args An array of arguments for the animation path.
     * @returns The animation path.
     */
    public static readonly getAnimationPath = (...args: string[]): string => {
        // Use the parsePath method to generate the path for the animation
        // and append the '.svg' extension
        return `${Path.getAssetRootPath()}/anim/${Path.parsePath(args)}.svg`;
    };

    /**
     * Generates the path for an icon.
     * @param args An array of arguments for the icon path.
     * @returns The icon path.
     */
    public static readonly getIconPath = (...args: string[]): string => {
        // Use the parsePath method to generate the path for the icon
        // and append the '.svg' extension
        return `${Path.getAssetRootPath()}/icon/${Path.parsePath(args)}.svg`;
    };

    /**
     * Generates the path for an image.
     * @param args An array of arguments for the image path.
     * @returns The image path.
     */
    public static readonly getImagePath = (...args: string[]): string => {
        // Use the parsePath method to generate the path for the image
        // and append the specified file extension
        return `${Path.getAssetRootPath()}/img/${Path.parsePath(args)}.png`;
    };

    /**
     * Generates the path for a sound effect (SFX) file.
     * @param args An array of arguments for the SFX path.
     * @returns The SFX path.
     */
    public static readonly getSFXPath = (...args: string[]): string => {
        // Use the parsePath method to generate the path for the SFX
        // and append the specified file extension
        return `${Path.getAssetRootPath()}/sfx/${Path.parsePath(args)}.mp3`;
    };
}

export default Path;