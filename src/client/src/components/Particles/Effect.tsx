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

// Components
import Particle from '@/components/Particles/Particle.tsx';

const parseHexColor = (hex: string): number[] => {
    const value = hex.replace('#', '');
    return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
};

/**
 * Represents the effect that manages and updates the particles.
 */
class Effect {
    activeInput: boolean; // Flag to indicate if the input is active
    bulge: { active: boolean; maxPush: number; radius: number; x: number; y: number }; // Subtle bulge around the cursor
    now: number = 0; // Timestamp of the current frame, drives the breathing of the letter
    letter: string | null = null; // Letter the particles currently form
    letterColors: readonly [string, string] = ['#ffffff', '#ffffff']; // Gradient of the letter
    ctx: CanvasRenderingContext2D; // Canvas rendering context
    gap: number; // Gap between particles
    height: number; // Height of the canvas
    mouse1: { radius: number; x: number; y: number }; // Mouse properties
    mouse2: { radius: number; x: number; y: number }; // Second mouse properties
    particleEase: number; // Particle ease factor
    particleFriction: number; // Particle friction factor
    particlesArray: Particle[]; // Array to hold all particles
    width: number; // Width of the canvas
    angle: number; // Angle for automatic mouse rotation

    /**
     * Creates an instance of the Effect.
     * @param width - The width of the canvas.
     * @param height - The height of the canvas.
     * @param context - The canvas rendering context.
     * @param canvas - The canvas element.
     */
    constructor(
        width: number,
        height: number,
        context: CanvasRenderingContext2D,
        private canvas: HTMLCanvasElement,
        gap: number = 20,
        mouseRadius: number = 3000,
        particleEase: number = 0.2,
        particleFriction: number = 0.95
    ) {
        this.width = width; // Set the width of the canvas
        this.height = height; // Set the height of the canvas
        this.ctx = context; // Set the canvas rendering context
        this.particlesArray = []; // Initialize the particles array
        this.gap = gap; // Set the gap between particles
        this.mouse1 = {
            radius: mouseRadius, // Set the mouse interaction radius
            x: 0, // Initialize the mouse x-coordinate
            y: 0, // Initialize the mouse y-coordinate
        };
        this.mouse2 = {
            radius: mouseRadius, // Set the second mouse interaction radius
            x: 0, // Initialize the second mouse x-coordinate
            y: 0, // Initialize the second mouse y-coordinate
        };
        this.particleEase = particleEase; // Set the particle ease factor
        this.particleFriction = particleFriction; // Set the particle friction factor

        this.activeInput = false; // Initialize the active input flag

        // Initialize the angle for automatic mouse rotation
        this.angle = 0;

        // The strong repulsion stays off until the login input is activated
        this.mouse1.radius = 0;

        this.bulge = {
            active: false,
            maxPush: 12 * window.devicePixelRatio,
            radius: 110 * window.devicePixelRatio,
            x: 0,
            y: 0,
        };

        // Start the automatic mouse rotation
        // this.updateMousePosition();
        // this.continouslyUpdateMousePosition();

        this.init(); // Initialize the particles
    }

    /**
     * Releases the particles. Called when the component that owns the effect unmounts.
     */
    destroy = () => {
        this.particlesArray = [];
    };

    continouslyUpdateMousePosition = () => {
        const radius = this.activeInput ? 500 : 15; // Radius of the circular path
        const centerX = this.width / 2; // Center x-coordinate of the circular path
        const centerY = this.height / 2; // Center y-coordinate of the circular path

        // Calculate the new second mouse position based on the angle
        this.mouse2.x = centerX + radius * Math.cos(-this.angle + Math.PI);
        this.mouse2.y = centerY + radius * Math.sin(-this.angle + Math.PI);

        // Increment the angle for the next frame
        // this.angle += 0.005; // Slower increment for the angle
        this.angle += 0.01;

        // Request the next frame to keep the animation going
        requestAnimationFrame(this.continouslyUpdateMousePosition);
    };

    // Function to update the mouse position in a circular path
    updateMousePosition = () => {
        this.mouse1.radius = this.activeInput ? 150000 : 3000; // Radius of the circular path
        const centerX = this.width / 2; // Center x-coordinate of the circular path
        const centerY = this.height / 2; // Center y-coordinate of the circular path
        // Calculate the new mouse position based on the angle
        this.mouse1.x = centerX;
        this.mouse1.y = centerY;
    };

    /**
     * Handles mouse move events by moving the bulge to the cursor.
     * @param event - The mouse event.
     */
    handleMouseMove = (event: MouseEvent) => {
        this.bulge.x = event.clientX * window.devicePixelRatio;
        this.bulge.y = event.clientY * window.devicePixelRatio;
        this.bulge.active = true;
    };

    /**
     * Handles the cursor leaving the page.
     */
    handleMouseLeave = () => {
        this.bulge.active = false;
    };

    /**
     * Makes the particles form a letter, or return to the plain grid when `letter` is null.
     * @param letter - The character to form.
     * @param colors - Start and end color (6-digit hex) of the gradient the letter is painted in.
     */
    setLetter(letter: string | null, colors?: readonly [string, string]) {
        this.letter = letter;
        if (colors) this.letterColors = colors;
        this.applyLetter();
    }

    /**
     * Assigns every particle to the letter or releases it, by rasterizing the letter at one pixel per grid cell.
     */
    private applyLetter() {
        if (!this.letter) {
            for (const particle of this.particlesArray) particle.letterTarget = 0;
            return;
        }

        const columns = Math.ceil(this.width / this.gap);
        const rows = Math.ceil(this.height / this.gap);
        const mask = document.createElement('canvas');
        mask.width = columns;
        mask.height = rows;
        const maskContext = mask.getContext('2d');
        if (!maskContext) return;

        maskContext.fillStyle = '#fff';
        maskContext.font = `700 ${Math.min(rows * 0.9, columns * 1.2)}px sans-serif`;
        maskContext.textAlign = 'center';
        maskContext.textBaseline = 'middle';
        maskContext.fillText(this.letter, columns / 2, rows / 2);
        const pixels = maskContext.getImageData(0, 0, columns, rows).data;

        const filled = (column: number, row: number) =>
            column >= 0 && column < columns && row >= 0 && row < rows && pixels[(row * columns + column) * 4 + 3] > 128;
        const isInLetter = (particle: Particle) =>
            filled(Math.round(particle.originX / this.gap), Math.round(particle.originY / this.gap));

        // Distance of every filled cell to the edge of the letter (two-pass city-block transform)
        const depth = new Float32Array(columns * rows);
        const depthAt = (column: number, row: number) =>
            column < 0 || column >= columns || row < 0 || row >= rows ? 0 : depth[row * columns + column];
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                if (filled(column, row)) {
                    depth[row * columns + column] = Math.min(depthAt(column - 1, row), depthAt(column, row - 1)) + 1;
                }
            }
        }
        let maxDepth = 1;
        for (let row = rows - 1; row >= 0; row--) {
            for (let column = columns - 1; column >= 0; column--) {
                if (!filled(column, row)) continue;
                const index = row * columns + column;
                const value = Math.min(
                    depth[index],
                    (column + 1 < columns ? depthAt(column + 1, row) : 0) + 1,
                    (row + 1 < rows ? depthAt(column, row + 1) : 0) + 1
                );
                depth[index] = value;
                maxDepth = Math.max(maxDepth, value);
            }
        }
        // Cap, so that thick strokes plateau instead of only the very center swelling
        const depthRange = Math.min(maxDepth, 3);

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const particle of this.particlesArray) {
            if (!isInLetter(particle)) continue;
            minX = Math.min(minX, particle.originX);
            maxX = Math.max(maxX, particle.originX);
            minY = Math.min(minY, particle.originY);
            maxY = Math.max(maxY, particle.originY);
        }

        const [from, to] = this.letterColors.map(parseHexColor);
        for (const particle of this.particlesArray) {
            particle.letterTarget = isInLetter(particle) ? 1 : 0;
            if (!particle.letterTarget) continue;

            const cell = Math.round(particle.originY / this.gap) * columns + Math.round(particle.originX / this.gap);
            particle.letterDepth = Math.min(depth[cell] / depthRange, 1);

            // Diagonal gradient across the letter
            const t = ((particle.originX - minX) / (maxX - minX || 1) + (particle.originY - minY) / (maxY - minY || 1)) / 2;
            const [r, g, b] = from.map((channel, index) => Math.round(channel + (to[index] - channel) * t));
            particle.letterColor = `rgb(${r}, ${g}, ${b})`;
        }
    }

    /**
     * Handles window resize events.
     */
    handleResize = () => {
        if (!this.canvas) return; // If canvas is not defined, return
        this.canvas.width = window.innerWidth * window.devicePixelRatio; // Update canvas width
        this.canvas.height = window.innerHeight * window.devicePixelRatio; // Update canvas height
        this.width = this.canvas.width; // Update effect width
        this.height = this.canvas.height; // Update effect height
        this.canvas.style.width = `${window.innerWidth}px`; // Update canvas style width
        this.canvas.style.height = `${window.innerHeight}px`; // Update canvas style height

        this.particlesArray = []; // Clear the particles array
        this.init(); // Reinitialize the particles
    };

    /**
     * Handles mouse click events.
     * @param event - The mouse event.
     */
    handleMouseClick = (event: MouseEvent) => {
        const clickX = event.clientX * window.devicePixelRatio;
        const clickY = event.clientY * window.devicePixelRatio;
        const waveRadius = 100; // Radius of the wave effect
        const waveDuration = 500; // Duration of the wave effect in milliseconds

        // Loop through each particle in the particles array
        for (let i = 0; i < this.particlesArray.length; i++) {
            const particle = this.particlesArray[i];
            const dx = particle.x - clickX;
            const dy = particle.y - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < waveRadius) {
                const opacityIncrement = 1 - distance / waveRadius;
                particle.opacity = 1; // Set particle opacity to 1

                // Gradually decrease the opacity back to its original value
                setTimeout(() => {
                    particle.opacity -= opacityIncrement;
                }, waveDuration);
            }
        }
    };

    /**
     * Initializes the particles by creating Particle instances at regular intervals.
     */
    init() {
        for (let x = 0; x < this.width; x += this.gap) {
            // Loop through the width with a step of gap
            for (let y = 0; y < this.height; y += this.gap) {
                // Loop through the height with a step of gap
                this.particlesArray.push(new Particle(x, y, this, this.particleEase, this.particleFriction)); // Create a new particle and add it to the array
            }
        }

        if (this.letter) this.applyLetter();
    }

    /**
     * Updates all particles in the effect.
     * Clears the canvas and then updates each particle's position and appearance.
     */
    update() {
        this.now = performance.now();

        // Clear the entire canvas to prepare for the next frame
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Loop through each particle in the particles array
        for (let i = 0; i < this.particlesArray.length; i++) {
            // Update the current particle's position and appearance
            this.particlesArray[i].update();
        }
    }
}

export default Effect;
