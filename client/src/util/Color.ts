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
import HEXType from '@/types/HEXType.ts';
import RGBType from '@/types/RGBType.ts';

// Utility
import { RGB as RGB_CONSTANT } from '@/const';


class Color {
    /**
     * Class representing RGB color utilities.
     */
    public static RGB = class {
        /**
         * Converts an RGB array to a HEX string.
         * @param rgbArray - The RGB array to convert.
         * @returns The HEX string representation of the RGB color.
         */
        public static toHEX(rgbArray: RGBType): HEXType {
            try {
                // Reduce the RGB array to a HEX string
                return rgbArray.reduce((hex, value) => {
                    // Convert each RGB value to a HEX string and pad with zero if necessary
                    const hexValue = value.toString(16).padStart(2, '0');
                    return hex + hexValue;
                }, '#') as unknown as HEXType;
            } catch (error) {
                console.error('Error converting RGB to HEX:', error);
                throw error;
            }
        }

        /**
         * Interpolates between two RGB colors.
         * @param a - The starting RGB color.
         * @param b - The ending RGB color.
         * @param t - The interpolation factor (0 to 1).
         * @returns The interpolated RGB color.
         */
        public static interpolate(a: RGBType, b: RGBType, t: number): RGBType {
            try {
                const invT = 1 - t; // Inverse of the interpolation factor
                // Calculate the interpolated RGB values
                return [
                    invT * a[0] + t * b[0],
                    invT * a[1] + t * b[1],
                    invT * a[2] + t * b[2],
                ];
            } catch (error) {
                console.error('Error interpolating RGB colors:', error);
                throw error;
            }
        }

        /**
         * Generates a random RGB color.
         * @returns A random RGB color.
         */
        public static random(): RGBType {
            try {
                // Generate random RGB values within the range [0, RGB_CONSTANT.MAX)
                return [
                    Math.floor(Math.random() * RGB_CONSTANT.MAX),
                    Math.floor(Math.random() * RGB_CONSTANT.MAX),
                    Math.floor(Math.random() * RGB_CONSTANT.MAX),
                ];
            } catch (error) {
                console.error('Error generating random RGB color:', error);
                throw error;
            }
        }
    }

    /**
     * Class representing HEX color utilities.
     */
    public static HEX = class {
        /**
         * Checks if a string is a valid HEX color.
         * @param color - The HEX color string to check.
         * @returns True if the string is a valid HEX color, false otherwise.
         */
        public static isHex(color: HEXType): boolean {
            // Check if the color is a string and matches the HEX color pattern
            return typeof color === 'string' && /^#?[0-9A-Fa-f]{6}$/.test(color);
        }

        /**
         * Converts a HEX string to an RGB array.
         * @param color - The HEX string to convert.
         * @returns The RGB array representation of the HEX color.
         */
        public static toRGB(color: HEXType): RGBType {
            try {
                const hex = color.replace('#', ''); // Remove the '#' if present
                // Parse the HEX string into RGB values
                return [
                    parseInt(hex.substring(0, 2), 16),
                    parseInt(hex.substring(2, 4), 16),
                    parseInt(hex.substring(4, 6), 16),
                ] as RGBType;
            } catch (error) {
                console.error('Error converting HEX to RGB:', error);
                throw error;
            }
        }

        /**
         * Lightens a HEX color by a given factor.
         * @param color - The HEX color to lighten.
         * @param factor - The factor by which to lighten the color (0 to 1).
         * @returns The lightened HEX color.
         */
        public static lighten(color: HEXType, factor: number): HEXType {
            try {
                const rgb = Color.HEX.toRGB(color); // Convert HEX to RGB
                // Increase each RGB value by the factor, capped at RGB_CONSTANT.MAX
                const lightenedRGB = rgb.map((value: number) => Math.min(RGB_CONSTANT.MAX, value + Math.floor(RGB_CONSTANT.MAX * factor))) as RGBType;
                return Color.RGB.toHEX(lightenedRGB); // Convert back to HEX
            } catch (error) {
                console.error('Error lightening HEX color:', error);
                throw error;
            }
        }

        /**
         * Darkens a HEX color by a given factor.
         * @param color - The HEX color to darken.
         * @param factor - The factor by which to darken the color (0 to 1).
         * @returns The darkened HEX color.
         */
        public static darken(color: HEXType, factor: number): HEXType {
            try {
                const rgb = Color.HEX.toRGB(color); // Convert HEX to RGB
                // Decrease each RGB value by the factor, floored at RGB_CONSTANT.MIN
                const darkenedRGB = rgb.map((value: number) => Math.max(RGB_CONSTANT.MIN, value - Math.floor(RGB_CONSTANT.MAX * factor))) as RGBType;
                return Color.RGB.toHEX(darkenedRGB); // Convert back to HEX
            } catch (error) {
                console.error('Error darkening HEX color:', error);
                throw error;
            }
        }

        /**
         * Applies random noise to a HEX color.
         * @param color - The HEX color to apply noise to.
         * @param noiseFactor - The factor of noise to apply (0 to 1).
         * @returns The HEX color with noise applied.
         */
        public static randomNoise(color: HEXType, noiseFactor: number): HEXType {
            try {
                const rgb = Color.HEX.toRGB(color); // Convert HEX to RGB
                // Apply noise to each RGB value, ensuring it stays within bounds
                const noisedRGB = rgb.map((value: number) => {
                    const noise = Math.floor(noiseFactor * (Math.random() * RGB_CONSTANT.MAX));
                    return Math.min(RGB_CONSTANT.MAX, Math.max(RGB_CONSTANT.MIN, value + noise));
                }) as RGBType;
                return Color.RGB.toHEX(noisedRGB); // Convert back to HEX
            } catch (error) {
                console.error('Error applying noise to HEX color:', error);
                throw error;
            }
        }

        /**
         * Mixes multiple HEX colors into one.
         * @param colors - The array of HEX colors to mix.
         * @returns The mixed HEX color.
         */
        public static mix(colors: HEXType[]): HEXType {
            try {
                // Sum up all RGB values from the HEX colors
                const totalRGB = colors.reduce((acc, color) => {
                    const rgb = Color.HEX.toRGB(color);
                    return acc.map((value: number, index: number) => value + rgb[index]) as RGBType;
                }, [0, 0, 0] as RGBType);
                // Calculate the average RGB values
                const averageRGB = totalRGB.map((value: number) => Math.floor(value / colors.length)) as RGBType;
                return Color.RGB.toHEX(averageRGB); // Convert back to HEX
            } catch (error) {
                console.error('Error mixing HEX colors:', error);
                throw error;
            }
        }

        /**
         * Generates a random HEX color, optionally from a given list of colors.
         * @param colors - The optional array of HEX colors to choose from.
         * @returns A random HEX color.
         */
        public static random(colors: HEXType[] = []): HEXType {
            try {
                if (colors.length > 0) {
                    // Return a random color from the provided list
                    const randomIndex = Math.floor(Math.random() * colors.length);
                    return colors[randomIndex];
                }
                // Generate a random RGB color and convert to HEX
                return Color.RGB.toHEX(Color.RGB.random());
            } catch (error) {
                console.error('Error generating random HEX color:', error);
                throw error;
            }
        }
    }
}


export default Color;