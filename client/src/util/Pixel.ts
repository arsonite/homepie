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

// Get the root font size from the computed styles of the document's root element (usually <html>)
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

/**
 * Class representing a pixel with x and y coordinates.
 */
class Pixel {
    // Declare private readonly properties for x and y coordinates
    declare private readonly x: number;
    declare private readonly y: number;

    /**
     * Create a Pixel.
     * @param {number} x - The x-coordinate of the pixel.
     * @param {number} y - The y-coordinate of the pixel.
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Check if this pixel is equal to another pixel.
     * @param {Pixel} p - The pixel to compare with.
     * @returns {boolean} True if the pixels are equal, false otherwise.
     */
    public equals(p: Pixel): boolean {
        return this.x === p.x && this.y === p.y;
    }

    /**
     * Create a clone of this pixel.
     * @returns {Pixel} A new Pixel instance with the same x and y coordinates.
     */
    public clone(): Pixel {
        return new Pixel(this.x, this.y);
    }

    /**
     * Convert a pixel value to rem units.
     * @param {number} pixels - The pixel value to convert.
     * @returns {number} The equivalent value in rem units.
     */
    public static readonly toREM = (pixels: number): number => {
        return pixels / rootFontSize;
    }

    /**
     * Convert a rem value to pixels.
     * @param {number} rem - The rem value to convert.
     * @returns {number} The equivalent value in pixels.
     */
    public static readonly fromREM = (rem: number): number => {
        return rem * rootFontSize;
    }
}

export default Pixel;