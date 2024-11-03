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

/**
 * A constant object containing arrays of different types of keys.
 * FUNCTION: Array of function keys (F1 to F12).
 * MEDIA: Array of media control keys.
 * SPECIAL: Array of special keys including navigation and control keys.
 */
const KEYS = {
    FUNCTION: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    MEDIA: ['AudioVolumeUp', 'AudioVolumeDown', 'MediaPlayPause', 'MediaTrackNext', 'MediaTrackPrevious'],
    SPECIAL: [' ', 'Alt', 'AltGraph', 'AltRight', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'CapsLock', 'Control', 'Delete', 'End', 'Escape', 'Home', 'Meta', 'PageDown', 'PageUp', 'Pause', 'PrintScreen', 'ScrollLock', 'Shift', 'Tab'],
}

/**
 * A class to handle key press events.
 */
class Keys {
    /**
     * Checks if a key is pressed based on the provided parameters.
     * 
     * @param key - The key to check.
     * @param target_key - The specific target key to compare against (optional).
     * @param include_function_keys - Whether to include function keys in the check (optional).
     * @param include_media_keys - Whether to include media keys in the check (optional).
     * @param include_special_keys - Whether to include special keys in the check (optional).
     * @returns True if the key is pressed based on the provided parameters, otherwise false.
     */
    public static readonly pressed = (
        key: string,
        target_key: string | null = null,
        include_function_keys: boolean = false,
        include_media_keys: boolean = false,
        include_special_keys: boolean = false): boolean => {

        // Check if the key is a function key and if function keys should be included in the check
        if (include_function_keys && KEYS.FUNCTION.includes(key)) {
            return true;
        }

        // Check if the key is a media key and if media keys should be included in the check
        if (include_media_keys && KEYS.MEDIA.includes(key)) {
            return true;
        }

        // Check if the key is a special key and if special keys should be included in the check
        if (include_special_keys && KEYS.SPECIAL.includes(key)) {
            return true;
        }

        // Check if the key matches the target key
        if (key === target_key) {
            return true;
        }

        // If none of the conditions are met, return false
        return false;
    };
}

export default Keys;