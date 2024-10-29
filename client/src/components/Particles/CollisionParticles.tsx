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

// Components
import Effect from '@/components/Particles/Effect.tsx';

interface CollisionParticlesProps {
    effectGap?: number;
    effectRadius?: number;
    particleEase?: number;
    particleFriction?: number;
}

/**
 * React component that renders the canvas and initializes the particle effect.
 */
const CollisionParticles: React.FC<CollisionParticlesProps> = (props) => {
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
        const effect = new Effect(
            canvas.width,
            canvas.height,
            ctx,
            canvas,
            props.effectGap,
            props.effectRadius,
            props.particleEase,
            props.particleFriction
        );

        // Define the animation function to update the effect
        const animate = () => {
            effect.update(); // Update the effect (particles)
            requestAnimationFrame(animate); // Request the next animation frame
        };

        // Start the animation
        animate();

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            window.removeEventListener('click', effect.handleMouseClick);
            window.removeEventListener('mouseleave', effect.handleMouseLeave);
            window.removeEventListener('mousemove', effect.handleMouseMove);
            window.removeEventListener('resize', effect.handleResize);
        };
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this effect runs only once

    // Render the canvas element inside a div
    return (
        <div id='collision-particles'>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CollisionParticles;
