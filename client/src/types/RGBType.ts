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
// import FixedArrayType from '@/types/FixedArrayType.ts';

/**
 * RGB type represents an array of three numbers, each corresponding to the red, green, and blue components of a color.
 * The FixedArrayType ensures that the array always has exactly three elements.
 */
// type RGBType = FixedArrayType<number, 3>
type RGBType = [number, number, number];

export default RGBType;