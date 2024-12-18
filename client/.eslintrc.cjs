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
