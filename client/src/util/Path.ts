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

/**
 * Class providing utility methods for handling and constructing file paths.
 */
class Path {
    /**
     * Parses an array of string arguments into a single URI string.
     * 
     * @param args - An array of string segments to be joined into a URI.
     * @returns A string representing the constructed URI.
     */
    public static readonly parsePath = (args: string[]): string => {
        let uri = '';
        // Iterate over each argument to build the URI
        args.forEach((arg) => {
            uri += '/' + arg;
        });
        return uri;
    };

    /**
     * Extracts the absolute path from a given metadata URL.
     * 
     * @param meta_url - The metadata URL from which to extract the absolute path.
     * @returns A string representing the absolute path.
     */
    public static readonly getAbsolutePath = (meta_url: string): string => {
        // Remove the origin part of the URL to get the path
        const path: string = meta_url
            .replace(window.location.origin, '')
            .replace(/\?.*/, '') // Remove query parameters
            .replace('\\\\', ''); // Replace double backslashes

        // Split the path into segments based on '/'
        const pathArray: string[] = path.split('/');

        // Extract the relevant segments for the absolute path
        const absolutePath: string = pathArray
            .slice(2, pathArray.length - 1)
            .join('/');

        return absolutePath;
    };

    /**
     * Retrieves the component-specific path from a given metadata URL.
     * 
     * @param meta_url - The metadata URL from which to extract the component path.
     * @returns A string representing the component path.
     */
    public static readonly getComponentPath = (meta_url: string): string => {
        let componentPath: string = meta_url.replace(window.location.origin, '');

        // Remove query parameters from the URL
        componentPath = componentPath.replace(/\?.*/, '');

        // Replace double backslashes with single ones
        componentPath = componentPath.replace('\\\\', '');

        return componentPath;
    };

    /**
     * Retrieves the root path for assets.
     * 
     * @returns A string representing the asset root path.
     */
    public static readonly getAssetRootPath = (): string => {
        return '/src/assets';
    }

    /**
     * Constructs the path for animation assets based on provided arguments.
     * 
     * @param args - Variable number of string segments to be included in the animation path.
     * @returns A string representing the complete path to the animation SVG.
     */
    public static readonly getAnimationPath = (...args: string[]): string => {
        return `${Path.getAssetRootPath()}/anim${Path.parsePath(args)}.svg`;
    };

    /**
     * Constructs the path for icon assets based on provided arguments.
     * 
     * @param args - Variable number of string segments to be included in the icon path.
     * @returns A string representing the complete path to the icon SVG.
     */
    public static readonly getIconPath = (...args: string[]): string => {
        return `${Path.getAssetRootPath()}/icon${Path.parsePath(args)}.svg`;
    };

    /**
     * Constructs the path for image assets based on provided arguments.
     * 
     * @param args - Variable number of string segments to be included in the image path.
     * @returns A string representing the complete path to the image PNG.
     */
    public static readonly getImagePath = (...args: string[]): string => {
        return `${Path.getAssetRootPath()}/img${Path.parsePath(args)}.png`;
    };

    /**
     * Constructs the path for sound effect (SFX) assets based on provided arguments.
     * 
     * @param args - Variable number of string segments to be included in the SFX path.
     * @returns A string representing the complete path to the SFX MP3.
     */
    public static readonly getSFXPath = (...args: string[]): string => {
        return `${Path.getAssetRootPath()}/sfx${Path.parsePath(args)}.mp3`;
    };
}

export default Path;