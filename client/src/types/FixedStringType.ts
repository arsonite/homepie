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