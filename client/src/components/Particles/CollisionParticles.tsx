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

// React imports
import React, { useEffect, useRef } from 'react';

/**
 * Represents a single particle in the particle effect.
 */
class Particle {
    originX: number; // The original x-coordinate of the particle
    originY: number; // The original y-coordinate of the particle
    effect: Effect; // Reference to the parent effect
    x: number; // Current x-coordinate of the particle
    y: number; // Current y-coordinate of the particle
    ctx: CanvasRenderingContext2D; // Canvas rendering context
    vx: number; // Velocity in the x-direction
    vy: number; // Velocity in the y-direction
    ease: number; // Ease factor for smooth movement
    friction: number; // Friction factor to slow down the particle
    dx: number; // Distance in the x-direction from the mouse
    dy: number; // Distance in the y-direction from the mouse
    distance: number; // Squared distance from the mouse
    force: number; // Force applied to the particle
    angle: number; // Angle between the particle and the mouse
    size: number; // Size of the particle
    color: string; // Color of the particle
    alpha: number; // Alpha transparency of the particle

    /**
     * Creates an instance of a Particle.
     * @param x - The initial x-coordinate of the particle.
     * @param y - The initial y-coordinate of the particle.
     * @param effect - The parent effect that manages this particle.
     */
    constructor(x: number, y: number, effect: Effect) {
        this.originX = x; // Set the original x-coordinate
        this.originY = y; // Set the original y-coordinate
        this.effect = effect; // Set the parent effect
        this.x = Math.floor(x); // Initialize the current x-coordinate
        this.y = Math.floor(y); // Initialize the current y-coordinate
        this.ctx = this.effect.ctx; // Get the canvas rendering context from the effect
        this.vx = 0; // Initialize velocity in the x-direction
        this.vy = 0; // Initialize velocity in the y-direction
        this.ease = 0.2; // Set the ease factor
        this.friction = 0.95; // Set the friction factor
        this.dx = 0; // Initialize distance in the x-direction from the mouse
        this.dy = 0; // Initialize distance in the y-direction from the mouse
        this.distance = 0; // Initialize squared distance from the mouse
        this.force = 0; // Initialize force applied to the particle
        this.angle = 0; // Initialize angle between the particle and the mouse
        this.size = Math.floor(Math.random() * 5); // Randomize the size of the particle
        this.color = 'white'; // Set the default color of the particle
        this.alpha = 1; // Set the default alpha transparency of the particle
        this.draw(); // Draw the particle on the canvas
    }

    /**
     * Draws the particle on the canvas.
     */
    draw() {
        this.ctx.fillStyle = this.color; // Set the fill color
        this.ctx.globalAlpha = this.alpha; // Set the alpha transparency
        this.ctx.beginPath(); // Begin a new path
        this.ctx.fillRect(this.x, this.y, this.size, this.size); // Draw a rectangle representing the particle
        this.ctx.globalAlpha = 1; // Reset the alpha transparency
    }

    /**
     * Updates the particle's position and appearance based on interactions with the mouse.
     */
    update() {
        // Calculate the distance between the particle and the mouse pointer
        this.dx = this.effect.mouse.x - this.x; // Distance in the x-direction
        this.dy = this.effect.mouse.y - this.y; // Distance in the y-direction
        this.distance = this.dx * this.dx + this.dy * this.dy; // Squared distance from the mouse
        this.force = -this.effect.mouse.radius / this.distance * 8; // Calculate the force applied to the particle

        // If the particle is within the mouse radius, apply forces
        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx); // Calculate the angle between the particle and the mouse
            this.vx += this.force * Math.cos(this.angle); // Apply force in the x-direction
            this.vy += this.force * Math.sin(this.angle); // Apply force in the y-direction
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Change color on interaction
        } else {
            this.color = 'white'; // Default color
        }

        // Apply friction and ease to the particle's velocity and position
        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease; // Update x-coordinate
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease; // Update y-coordinate
        this.draw(); // Draw the updated particle
    }
}

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

    /**
     * Creates an instance of the Effect.
     * @param width - The width of the canvas.
     * @param height - The height of the canvas.
     * @param context - The canvas rendering context.
     * @param canvas - The canvas element.
     */
    constructor(width: number, height: number, context: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {
        this.width = width; // Set the width of the canvas
        this.height = height; // Set the height of the canvas
        this.ctx = context; // Set the canvas rendering context
        this.particlesArray = []; // Initialize the particles array
        this.gap = 20; // Set the gap between particles
        this.mouse = {
            radius: 3000, // Set the mouse interaction radius
            x: 0, // Initialize the mouse x-coordinate
            y: 0, // Initialize the mouse y-coordinate
        };

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
        for (let x = 0; x < this.width; x += this.gap) { // Loop through the width with a step of gap
            for (let y = 0; y < this.height; y += this.gap) { // Loop through the height with a step of gap
                this.particlesArray.push(new Particle(x, y, this)); // Create a new particle and add it to the array
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

/**
 * React component that renders the canvas and initializes the particle effect.
 */
const CollisionParticles: React.FC = () => {
    // Create a reference to the canvas element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Get the canvas element from the reference
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get the 2D rendering context from the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set the canvas dimensions to match the window size, accounting for device pixel ratio
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;

        // Set the canvas style dimensions to match the window size
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        // Create a new Effect instance with the canvas dimensions and context
        const effect = new Effect(canvas.width, canvas.height, ctx, canvas);

        // Define the animation function to update the effect
        const animate = () => {
            effect.update(); // Update the effect (particles)
            requestAnimationFrame(animate); // Request the next animation frame
        };

        // Start the animation
        animate();

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            window.removeEventListener('mousemove', effect.handleMouseMove);
            window.removeEventListener('resize', effect.handleResize);
            window.removeEventListener('mouseleave', effect.handleMouseLeave);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    // Render the canvas element inside a div
    return <div id='collision-particles'>
        <canvas ref={canvasRef} />
    </div>;
};

export default CollisionParticles;