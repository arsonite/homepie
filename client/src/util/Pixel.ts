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