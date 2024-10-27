/* Copyright (c) 2024-2024 Burak Günaydin
* All Rights Reserved
* 
* This software is the confidential and proprietary information of
* Burak Günaydin.You may not use, modify, or distribute this
* software(unless you have the permission of the copyright holder)
* except in accordance with the terms of any applicable license agreement.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
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