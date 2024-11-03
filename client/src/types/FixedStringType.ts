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
 * @template T - A string type that will be processed to ensure it is a fixed string.
 * 
 * The `FixedString` type recursively processes a string type `T` to ensure it is a fixed string.
 * 
 * The type uses TypeScript's template literal types and conditional types to achieve this.
 * 
 * - If `T` can be split into a head character `R` and a tail string `S`, it checks:
 *   - If `R` is an empty string, it returns `never` (indicating an invalid string).
 *   - If `S` is an empty string, it returns `T` (indicating a valid fixed string).
 *   - Otherwise, it recursively processes the tail string `S`.
 * - If `T` cannot be split, it returns `never`.
 * 
 * This ensures that `T` is a fixed string by recursively validating each character.
 * 
 * @example
 * type ValidString = FixedString<'Hello'>; // 'Hello'
 * type InvalidString = FixedString<''>; // never
 * 
 * @param T - The string type to be processed.
 * @returns The fixed string type if valid, otherwise `never`.
 */
type FixedString<T extends string> = T extends `${infer R}${infer S}` ? (R extends '' ? never : S extends '' ? T : FixedString<S>) : never;

export default FixedString;