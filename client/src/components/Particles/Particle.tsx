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

/**
 * Represents a single particle in the particle effect.
 */
class Particle {
    alpha: number; // Alpha transparency of the particle
    angle: number; // Angle between the particle and the mouse
    color: string; // Color of the particle
    colorHoldCounter: number; // Counter to track how long to keep the color before fading
    colorHoldDuration: number; // Duration to hold the color after interaction
    ctx: CanvasRenderingContext2D; // Canvas rendering context
    distance: number; // Squared distance from the mouse
    dx: number; // Distance in the x-direction from the mouse
    dy: number; // Distance in the y-direction from the mouse
    effect: {
        ctx: CanvasRenderingContext2D;
        mouse1: { x: number; y: number; radius: number };
        mouse2: { x: number; y: number; radius: number };
    }; // Reference to the parent effect
    ease: number; // Ease factor for smooth movement
    force: number; // Force applied to the particle
    friction: number; // Friction factor to slow down the particle
    opacity: number; // Opacity of the particle
    originX: number; // The original x-coordinate of the particle
    originY: number; // The original y-coordinate of the particle
    size: number; // Size of the particle
    vx: number; // Velocity in the x-direction
    vy: number; // Velocity in the y-direction
    x: number; // Current x-coordinate of the particle
    y: number; // Current y-coordinate of the particle

    /**
     * Creates an instance of a Particle.
     * @param x - The initial x-coordinate of the particle.
     * @param y - The initial y-coordinate of the particle.
     * @param effect - The parent effect that manages this particle.
     */
    constructor(
        x: number,
        y: number,
        effect: {
            ctx: CanvasRenderingContext2D;
            mouse1: { x: number; y: number; radius: number };
            mouse2: { x: number; y: number; radius: number };
        },
        ease: number = 0.2,
        friction: number = 0.95
    ) {
        this.x = Math.floor(x); // Initialize the current x-coordinate
        this.y = Math.floor(y); // Initialize the current y-coordinate
        this.effect = effect; // Set the parent effect
        this.ease = ease; // Set the ease factor
        this.friction = friction; // Set the friction factor

        this.alpha = 0.25; // Set the default alpha transparency of the particle
        this.angle = 0; // Initialize angle between the particle and the mouse
        this.color = 'white'; // Set the default color of the particle
        this.colorHoldCounter = 0; // Initialize the counter to zero
        this.colorHoldDuration = 60; // Hold color for 60 frames after interaction
        this.ctx = this.effect.ctx; // Get the canvas rendering context from the effect
        this.distance = 0; // Initialize squared distance from the mouse
        this.dx = 0; // Initialize distance in the x-direction from the mouse
        this.dy = 0; // Initialize distance in the y-direction from the mouse
        this.force = 0; // Initialize force applied to the particle
        this.originX = x; // Set the original x-coordinate
        this.originY = y; // Set the original y-coordinate
        this.opacity = 1; // Set the default opacity of the particle
        this.size = Math.floor(Math.random() * 5); // Randomize the size of the particle
        this.vx = 0; // Initialize velocity in the x-direction
        this.vy = 0; // Initialize velocity in the y-direction

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
        // Update based on the first mouse
        this.updateMouseInteraction(this.effect.mouse1);

        // Update based on the second mouse
        // this.updateMouseInteraction(this.effect.mouse2);

        // Apply friction and ease to the particle's velocity and position
        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw(); // Draw the updated particle
    }

    /**
     * Updates the particle's position and appearance based on interactions with a given mouse.
     * @param mouse - The mouse object containing x, y, and radius properties.
     */
    updateMouseInteraction(mouse: { x: number; y: number; radius: number }) {
        // Calculate the distance between the particle and the mouse pointer
        this.dx = mouse.x - this.x;
        this.dy = mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = (-mouse.radius / this.distance) * 8;

        // If the particle is within the mouse radius, apply forces
        if (this.distance < mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Change color on interaction
            this.alpha = 1; // Reset alpha to 1 on interaction
            this.colorHoldCounter = this.colorHoldDuration; // Reset hold counter
        } else if (this.colorHoldCounter > 0) {
            // Decrement hold counter if still within the hold duration
            this.colorHoldCounter--;
        } else {
            // Fade color gradually once hold duration has passed
            this.alpha *= 0.98;
            if (this.alpha < 0.25) this.alpha = 0.25;
            this.color = 'white';
        }
    }
}

export default Particle;
