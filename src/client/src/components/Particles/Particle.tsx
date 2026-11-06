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

interface ParticleEffect {
    bulge: { active: boolean; maxPush: number; radius: number; x: number; y: number };
    ctx: CanvasRenderingContext2D;
    focusState: { colors: number[][]; maxPush: number; radius: number; strength: number; x: number; y: number };
    gap: number;
    mouse1: { x: number; y: number; radius: number };
    mouse2: { x: number; y: number; radius: number };
}

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
    effect: ParticleEffect; // Reference to the parent effect
    tint: string; // Color of the app whose tile is hovered, empty if the particle is outside of its bulge
    tintAmount: number; // How strongly the tint shows, 0 to 1
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
        effect: ParticleEffect,
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
        this.tint = '';
        this.tintAmount = 0;
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
        this.ctx.beginPath(); // Begin a new path

        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);

        // Same dot again in the color of the hovered app
        if (this.tintAmount > 0.01) {
            this.ctx.fillStyle = this.tint;
            this.ctx.globalAlpha = this.tintAmount;
            this.ctx.fillRect(this.x, this.y, this.size, this.size);
        }

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

        // The bulges shift the resting position away from the cursor and the hovered app tile
        const [mousePushX, mousePushY] = this.getBulgePush();
        const [focusPushX, focusPushY] = this.getFocusPush();
        const pushX = mousePushX + focusPushX;
        const pushY = mousePushY + focusPushY;

        // Apply friction and ease to the particle's velocity and position
        this.x += (this.vx *= this.friction) + (this.originX + pushX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY + pushY - this.y) * this.ease;
        this.draw(); // Draw the updated particle
    }

    /**
     * Gentle displacement away from the cursor, strongest right at the cursor and smoothly fading out.
     * Also lights the dots up a little so the bulge is visible.
     */
    getBulgePush(): [number, number] {
        const bulge = this.effect.bulge;
        if (!bulge.active) return [0, 0];

        const dx = this.originX - bulge.x;
        const dy = this.originY - bulge.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= bulge.radius) return [0, 0];

        const t = 1 - distance / bulge.radius;
        const strength = t * t * (3 - 2 * t); // Smoothstep
        this.alpha = Math.max(this.alpha, 0.25 + 0.35 * strength);

        // A dot exactly under the cursor has no direction, so it stays put
        if (distance < 1) return [0, 0];
        return [(dx / distance) * strength * bulge.maxPush, (dy / distance) * strength * bulge.maxPush];
    }

    /**
     * The same gentle displacement as around the cursor, around the hovered app tile and with a wider radius.
     * Tints the dots in the colors of the app.
     */
    getFocusPush(): [number, number] {
        const focus = this.effect.focusState;
        this.tintAmount = 0;
        if (focus.strength <= 0) return [0, 0];

        const dx = this.originX - focus.x;
        const dy = this.originY - focus.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= focus.radius) return [0, 0];

        const t = 1 - distance / focus.radius;
        const strength = (t * t * (3 - 2 * t)) * focus.strength; // Smoothstep
        this.alpha = Math.max(this.alpha, 0.25 + 0.35 * strength);

        // Diagonal gradient across the bulge
        const position = Math.min(Math.max(0.5 + (dx + dy) / (4 * focus.radius), 0), 1);
        const [from, to] = focus.colors;
        const [r, g, b] = from.map((channel, index) => Math.round(channel + (to[index] - channel) * position));
        this.tint = `rgb(${r}, ${g}, ${b})`;
        this.tintAmount = Math.min(strength * 1.4, 1);

        if (distance < 1) return [0, 0];
        return [(dx / distance) * strength * focus.maxPush, (dy / distance) * strength * focus.maxPush];
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
export type { ParticleEffect };
