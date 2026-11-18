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
 * Represents a 60-character string identifier type.
 * 
 * This type uses TypeScript's template literal type with an intersection type
 * to ensure the string is exactly 60 characters long. The type is useful for
 * representing fixed-length identifiers, such as certain types of hashes,
 * UUIDs, or other standardized identifiers.
 * 
 * @example
 * const validId: IdentifierType = "123456789012345678901234567890123456789012345678901234567890"; // Exactly 60 chars
 * const invalidId: IdentifierType = "123"; // Type error: Too short
 * 
 * @typedef {string} IdentifierType
 */
type IdentifierType = `${string & { length: 60 }}`;

export default IdentifierType;