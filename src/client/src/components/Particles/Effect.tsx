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

/** Where the grid bulges, in CSS pixels relative to the viewport. */
interface ParticleFocus {
    radius: number;
    x: number;
    y: number;
}

interface FocusState {
    colors: number[][];
    maxPush: number;
    radius: number;
    strength: number;
    target: number;
    x: number;
    y: number;
}

/**
 * Represents the effect that manages and updates the particles.
 */
class Effect {
    activeInput: boolean; // Flag to indicate if the input is active
    bulge: { active: boolean; maxPush: number; radius: number; x: number; y: number }; // Subtle bulge around the cursor
    focusState: FocusState = {
        colors: [[255, 255, 255], [255, 255, 255]],
        maxPush: 14 * window.devicePixelRatio,
        radius: 0,
        strength: 0, // Eased towards `target`, so the bulge rises and fades smoothly
        target: 0,
        x: 0,
        y: 0,
    }; // Wide bulge around the hovered app tile
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
     * Makes the grid bulge around a point like it does around the cursor, but wider and in the colors of an app.
     * Releases the bulge again when `focus` is null.
     * @param focus - Center and radius of the bulge, in CSS pixels relative to the viewport.
     * @param colors - Start and end color (6-digit hex) of the gradient the dots in the bulge are tinted in.
     */
    setFocus(focus: ParticleFocus | null, colors?: readonly [string, string]) {
        if (colors) this.focusState.colors = colors.map(parseHexColor);
        if (!focus) {
            this.focusState.target = 0; // Keeps the position, so the bulge fades out where it was
            return;
        }

        this.focusState.radius = focus.radius * window.devicePixelRatio;
        this.focusState.target = 1;
        this.focusState.x = focus.x * window.devicePixelRatio;
        this.focusState.y = focus.y * window.devicePixelRatio;
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

    }

    /**
     * Updates all particles in the effect.
     * Clears the canvas and then updates each particle's position and appearance.
     */
    update() {
        this.focusState.strength += (this.focusState.target - this.focusState.strength) * 0.08;
        if (this.focusState.strength < 0.002 && !this.focusState.target) this.focusState.strength = 0;

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
export type { ParticleFocus };
