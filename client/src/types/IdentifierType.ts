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