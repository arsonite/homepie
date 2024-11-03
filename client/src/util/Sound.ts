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

import Path from '@/util/Path.ts';

/**
 * The Sound class is responsible for handling audio playback.
 * It wraps around the HTMLAudioElement and provides methods to play
 * sounds and manage their volume.
 */
class Sound {
    private audio: HTMLAudioElement; // The HTMLAudioElement instance used for audio playback
    private volume: number; // The volume level of the audio, ranging from 0.0 to 100.0

    /**
     * Constructs a new Sound instance.
     * @param path - The path to the audio file.
     * @param volume - The initial volume level (default (and max) is 100).
     */
    public constructor(path: string, volume: number = 100) {
        // Create a new Audio object with the provided path
        this.audio = new Audio(Path.getSFXPath(path));

        volume = volume / 100; // Convert the volume to a value between 0.0 and 1.0
        this.audio.volume = volume; // Set the audio element's volume (HTMLAudioElement volume is between 0.0 and 1.0)
        this.volume = volume; // Set the internal volume property
    }

    /**
     * Plays the audio.
     */
    public play(): void {
        this.audio.play(); // Call the play method on the HTMLAudioElement
    }

    /**
     * Gets the current volume level.
     * @returns The current volume level.
     */
    public getVolume(): number {
        return this.volume; // Return the internal volume property
    }

    /**
     * Sets the volume to a new level.
     * @param volume - The new volume level.
     */
    public setVolume(volume: number): void {
        // Update the internal volume property
        this.volume = volume;
        // Update the HTMLAudioElement's volume (HTMLAudioElement volume is between 0.0 and 1.0)
        this.audio.volume = this.volume / 100;
    }
}

export default Sound;