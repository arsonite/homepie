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