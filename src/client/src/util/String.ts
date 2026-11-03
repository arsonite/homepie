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

// Utility
import { HTTP_ENCODING } from '@/const.ts';

/**
 * Class providing utility methods for string manipulation.
 */
class String {
    /**
     * Encodes the input string by replacing whitespace with a defined encoding and converting to lowercase.
     * @param input - The string to be encoded.
     * @returns The encoded string.
     */
    public static readonly encode = (input: string): string => {
        try {
            // Replace all whitespace characters with the defined HTTP_ENCODING.SPACE and convert to lowercase
            return input.replace(/\s+/g, HTTP_ENCODING.SPACE).toLowerCase();
        } catch (error) {
            console.error('Error encoding string:', error);
            return input;
        }
    }

    /**
     * Decodes the input string by splitting it using the defined encoding, capitalizing each word, and joining with spaces.
     * @param input - The string to be decoded.
     * @returns The decoded string.
     */
    public static readonly decode = (input: string): string => {
        try {
            // Split the input string by the defined encoding
            return input.split(HTTP_ENCODING.SPACE)
                // Capitalize the first letter of each word
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                // Join the words back with spaces
                .join(' ');
        } catch (error) {
            console.error('Error decoding string:', error);
            return input;
        }
    }

    /**
     * Inserts spaces before uppercase letters in the input string.
     * @param input - The string to modify.
     * @returns The modified string with spaces inserted.
     */
    public static readonly insertSpaces = (input: string): string => {
        try {
            // Insert a space between a lowercase letter followed by an uppercase letter
            return input.replace(/([a-z])([A-Z])/g, '$1 $2');
        } catch (error) {
            console.error('Error inserting spaces:', error);
            return input;
        }
    }
}

export default String;