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