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
 * Declares a module 'require-context' which provides a function to require 
 * modules within a specified directory.
 * 
 * @module 'require-context'
 */

/**
 * Function to require modules within a specified directory.
 * 
 * @param directory - The path to the directory containing the modules.
 * @param useSubdirectories - A boolean indicating whether to include subdirectories.
 * @param regExp - A regular expression to match files against.
 * 
 * @returns An object with the following properties:
 * - `keys`: A function that returns an array of matched file paths.
 * - `resolve`: A function that takes a key (file path) and returns the resolved path.
 * - `id`: A string identifier for the context.
 * - `<T>`: A generic function that takes a key (file path) and returns the required module.
 */
declare module 'require-context' {
    function requireContext(
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp
    ): {
        keys: () => string[];
        resolve: (key: string) => string;
        id: string;
        <T>(key: string): T;
    }
    export = requireContext;
}