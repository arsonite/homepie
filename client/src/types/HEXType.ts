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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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