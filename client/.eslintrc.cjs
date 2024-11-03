/**
 * @license
 * Copyright (c) 2024-2025 Burak Günaydin
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
 * ESLint configuration file for the project.
 *
 * @file .eslintrc.cjs
 * @description This configuration sets up ESLint for a TypeScript and React project.
 * It includes recommended rules for ESLint, TypeScript, and React Hooks, and it uses
 * the `@typescript-eslint/parser` to parse TypeScript code.
 *
 * @property {boolean} root - Indicates that this is the root configuration file.
 * @property {Object} env - Specifies the environments for the code.
 * @property {boolean} env.browser - Enables browser global variables.
 * @property {boolean} env.es2020 - Enables ES2020 syntax.
 * @property {string[]} extends - Extends recommended ESLint, TypeScript, and React Hooks rules.
 * @property {string[]} ignorePatterns - Specifies files and directories to ignore.
 * @property {string} parser - Specifies the parser to use for TypeScript.
 * @property {string[]} plugins - Specifies additional plugins to use.
 * @property {Object} rules - Custom rules configuration.
 * @property {Array} rules['react-refresh/only-export-components'] - Warns if components are not exported correctly, allows constant exports.
 * @property {string} rules['no-unused-vars'] - Disables the default ESLint rule for unused variables.
 * @property {string} rules['@typescript-eslint/no-unused-vars'] - Warns about unused variables in TypeScript.
 */
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
    },
};
