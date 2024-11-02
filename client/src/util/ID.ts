/**
 * @license
 * Copyright (c) 2024-2024 Burak Günaydin
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Package imports
import { v4 as uuidv4 } from 'uuid';

// Types
import IdentifierType from '@/types/IdentifierType.ts';

/**
 * Utility class for generating unique identifiers with customizable formats.
 * @class
 * 
 * @remarks
 * This class provides functionality to generate unique identifiers either in a short format
 * (UUID without hyphens) or a longer format that combines timestamp, datestamp and UUID information.
 * 
 * The long format ID is constructed as follows:
 * 1. First part combines:
 *    - Timestamp (milliseconds + seconds + minutes + hours) converted to hex
 *    - Datestamp (day + month + year) converted to hex
 *    - Raw datestamp
 * 2. Second part uses two UUIDs concatenated without hyphens
 * 3. Final ID is trimmed to exactly 60 characters
 * 
 * @example
 * // Generate a short ID
 * const shortId = ID.generate(true); // Returns: UUID without hyphens
 * 
 * // Generate a long ID
 * const longId = ID.generate(); // Returns: 60-character identifier
 * 
 * @throws {Error}
 * Throws an error if ID generation fails for any reason
 */
class ID {
    private static readonly HEX_BASE = 16;

    /**
     * Converts a numeric value to its hexadecimal string representation.
     * 
     * @private
     * @static
     * @param {number} value - The decimal number to convert to hexadecimal.
     * @returns {string} The hexadecimal representation as a string. Returns '0' if conversion fails.
     * 
     * @example
     * // Returns "A"
     * ID.convertToHex(10);
     * 
     * @throws {Error} If the conversion fails (caught internally)
     * @remarks
     * - Uses the toString() method with base 16 (HEX_BASE)
     * - Includes error handling that returns '0' if conversion fails
     * - Safe to use with any numeric input
     */
    private static readonly convertToHex = (value: number): string => {
        try {
            return value.toString(ID.HEX_BASE);
        } catch (error) {
            console.error('Error converting to hex:', error);
            return '0';
        }
    };

    /**
     * Generates a unique identifier based on timestamp and UUID.
     * 
     * The function can generate two types of identifiers:
     * 1. Short version: A simplified UUID without hyphens
     * 2. Long version (default): A complex 60-character identifier combining:
     *    - Timestamp components (milliseconds, seconds, minutes, hours)
     *    - Date components (day, month, year)
     *    - Multiple UUIDs
     * 
     * The long version algorithm:
     * 1. Creates date/time components from current timestamp
     * 2. Combines components into datestamp and timestamp strings
     * 3. Converts timestamp to hex and combines with datestamp for first part
     * 4. Generates second part from two UUIDs
     * 5. Combines both parts and trims to exactly 60 characters
     * 
     * @param {boolean} short - Optional flag to generate shortened UUID (default: false)
     * @returns {IdentifierType | string} Returns either:
     *   - A shortened UUID string (if short=true)
     *   - A 60-character complex identifier (if short=false)
     * @throws {Error} Throws error if ID generation fails
     * 
     * @example
     * // Generate long ID
     * const longId = ID.generate();
     * 
     * @example
     * // Generate short ID
     * const shortId = ID.generate(true);
     */
    public static readonly generate = (short: boolean = false): IdentifierType | string => {
        try {
            if (short) {
                return uuidv4().replace(/-/g, '');
            }

            const now = new Date();

            // Create date components
            const dateComponents = {
                day: now.getDay(),
                month: now.getMonth(),
                year: now.getFullYear()
            };

            // Create time components
            const timeComponents = {
                ms: now.getMilliseconds(),
                sec: now.getSeconds(),
                min: now.getMinutes(),
                hours: now.getHours()
            };

            const datestamp = `${dateComponents.day}${dateComponents.month}${dateComponents.year}`;
            const timestamp = `${timeComponents.ms}${timeComponents.sec}${timeComponents.min}${timeComponents.hours}`;

            // Generate first part of ID
            const firstPart = ID.convertToHex(parseInt(timestamp)) +
                ID.convertToHex(parseInt(datestamp)) +
                datestamp;

            // Generate second part using UUID
            const secondPart = `${uuidv4()}${uuidv4()}`.replace(/-/g, '');

            // Combine and trim to exact length
            const finalID = (firstPart + secondPart).substring(0, 60);

            return finalID as IdentifierType;
        } catch (error) {
            console.error('Error generating ID:', error);
            throw new Error('Failed to generate ID');
        }
    };
}

export default ID;