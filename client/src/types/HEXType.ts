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

// Types
// import FixedString from '@/types/FixedStringType.ts';

/**
 * @typedef {HEX}
 * 
 * Represents a fixed-length hexadecimal string type.
 * 
 * This type alias uses a template literal type to enforce that the string
 * must be exactly 6 characters long, which is typical for hexadecimal color codes.
 * 
 * @example
 * // Valid HEX type
 * const color: HEX = "a1b2c3";
 * 
 * @example
 * // Invalid HEX type (too short)
 * const color: HEX = "a1b2"; // Error: Type '"a1b2"' is not assignable to type 'HEX'.
 * 
 * @example
 * // Invalid HEX type (too long)
 * const color: HEX = "a1b2c3d4"; // Error: Type '"a1b2c3d4"' is not assignable to type 'HEX'.
 */
// type HEX = FixedString<`${string}${string}${string}${string}${string}${string}`>;
type HEXType = `#${string}${string}${string}${string}${string}${string}`;

export default HEXType;