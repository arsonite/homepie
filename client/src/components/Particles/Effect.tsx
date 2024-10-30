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
    activeInput: boolean; // Flag to indicate if the input is active
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

        // Start the automatic mouse rotation
        // this.continouslyUpdateMousePosition();

        // Add event listeners for mouse movement, window resize, and mouse leave
        // window.addEventListener('click', this.handleMouseClick);
        // window.addEventListener('mouseleave', this.handleMouseLeave);
        // window.addEventListener('mousemove', this.handleMouseMove);
        // window.addEventListener('resize', this.handleResize);

        this.init(); // Initialize the particles
    }

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
        this.mouse1.radius = this.activeInput ? 100000 : 3000; // Radius of the circular path
        const centerX = this.width / 2; // Center x-coordinate of the circular path
        const centerY = this.height / 2; // Center y-coordinate of the circular path
        // Calculate the new mouse position based on the angle
        this.mouse1.x = centerX;
        this.mouse1.y = centerY;
    };

    /**
     * Handles mouse move events.
     * @param event - The mouse event.
     */
    handleMouseMove = (event: MouseEvent) => {
        this.mouse1.x = event.clientX * window.devicePixelRatio; // Update mouse x-coordinate
        this.mouse1.y = event.pageY * window.devicePixelRatio; // Update mouse y-coordinate
    };

    /**
     * Handles mouse leave events.
     */
    handleMouseLeave = () => {
        console.log('leave');
        this.mouse1.x = -Infinity; // Move mouse x-coordinate out of bounds
        this.mouse1.y = -Infinity; // Move mouse y-coordinate out of bounds
        this.mouse1.radius = 0; // Set mouse interaction radius to zero
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
