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

// Components
import Particle from '@/components/Particles/Particle.tsx';

/**
 * Represents the effect that manages and updates the particles.
 */
class Effect {
    width: number; // Width of the canvas
    height: number; // Height of the canvas
    ctx: CanvasRenderingContext2D; // Canvas rendering context
    particlesArray: Particle[]; // Array to hold all particles
    gap: number; // Gap between particles
    mouse: { radius: number; x: number; y: number }; // Mouse properties
    particleEase: number; // Particle ease factor
    particleFriction: number; // Particle friction factor

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
        this.mouse = {
            radius: mouseRadius, // Set the mouse interaction radius
            x: 0, // Initialize the mouse x-coordinate
            y: 0, // Initialize the mouse y-coordinate
        };
        this.particleEase = particleEase; // Set the particle ease factor
        this.particleFriction = particleFriction; // Set the particle friction factor

        // Add event listeners for mouse movement, window resize, and mouse leave
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('mouseleave', this.handleMouseLeave);

        this.init(); // Initialize the particles
    }

    /**
     * Handles mouse move events.
     * @param event - The mouse event.
     */
    handleMouseMove = (event: MouseEvent) => {
        this.mouse.x = event.clientX * window.devicePixelRatio; // Update mouse x-coordinate
        this.mouse.y = event.pageY * window.devicePixelRatio; // Update mouse y-coordinate
    };

    /**
     * Handles mouse leave events.
     */
    handleMouseLeave = () => {
        this.mouse.x = -Infinity; // Move mouse x-coordinate out of bounds
        this.mouse.y = -Infinity; // Move mouse y-coordinate out of bounds
    };

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
