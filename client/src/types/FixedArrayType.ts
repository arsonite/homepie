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
 * A utility type to create a fixed-length array of a specified type.
 * 
 * @template Type - The type of elements in the array.
 * @template Length - The fixed length of the array.
 * @template Tuple - An internal tuple used to build the fixed-length array.
 * 
 * This type recursively builds a tuple of the specified length, where each element is of the specified type.
 * It uses TypeScript's conditional types and tuple manipulation to achieve this.
 */
type FixedArray<Type, Length extends number, Tuple extends unknown[] = []> =
    // Check if the current length of the tuple matches the desired length.
    Tuple['length'] extends Length
    // If the lengths match, return the tuple as the fixed-length array.
    ? Tuple
    // If the lengths do not match, recursively call FixedArray with an extended tuple.
    : FixedArray<Type, Length, [Type, ...Tuple]>;

export default FixedArray;