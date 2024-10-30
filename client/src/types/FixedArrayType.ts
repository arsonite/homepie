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