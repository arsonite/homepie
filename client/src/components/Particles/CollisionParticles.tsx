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

// React imports
import React, { useEffect, useRef } from 'react';

// Components
import Effect from '@/components/Particles/Effect';

// Style
import './_style/CollisionParticles.scss';

interface CollisionParticlesProps {
    activeInput?: boolean;
    effectGap?: number;
    effectRadius?: number;
    mouseTracking?: boolean;
    particleEase?: number;
    particleFriction?: number;
}

// TODO: Rewrite this component for better performance and readability and maintainability as a react component
/**
 * `CollisionParticles` is a React functional component that renders a canvas element and manages
 * particle collision effects based on user interactions and window resizing.
 *
 * @component
 *
 * @param {CollisionParticlesProps} props - The properties used to configure the particle effect.
 * @param {number} props.effectGap - The gap between particles in the effect.
 * @param {number} props.effectRadius - The radius of each particle in the effect.
 * @param {number} props.particleEase - The easing factor for particle movement.
 * @param {number} props.particleFriction - The friction applied to particle movement.
 * @param {boolean} props.activeInput - Flag to activate or deactivate input interactions.
 *
 * @remarks
 * The component utilizes `useRef` hooks to maintain references to the canvas element, the effect instance,
 * and the animation frame ID. It sets up event listeners for window resizing and mouse interactions
 * to dynamically adjust the particle effects. Cleanup of event listeners and animation frames is handled
 * when the component unmounts to prevent memory leaks.
 */
const CollisionParticles: React.FC<CollisionParticlesProps> = (props) => {
    // Reference to the canvas DOM element
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Reference to the Effect instance managing particle behavior
    const effectRef = useRef<Effect | null>(null);

    // Reference to store the animation frame ID for cancellation
    const animationFrameRef = useRef<number>();

    /**
     * Initializes the canvas size and sets up the particle effect.
     * Adds event listeners for window resizing and mouse interactions.
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        /**
         * Sets the canvas dimensions based on the window size and device pixel ratio.
         * Updates the canvas style to match the window dimensions.
         * Notifies the effect instance to handle the resize.
         */
        const setCanvasSize = () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            effectRef.current?.handleResize();
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Instantiate the Effect with the current canvas and provided props
        effectRef.current = new Effect(
            canvas.width,
            canvas.height,
            context,
            canvas,
            props.effectGap,
            props.effectRadius,
            props.particleEase,
            props.particleFriction
        );

        /**
         * The animation loop that continuously updates the particle effect.
         * Requests the next animation frame recursively.
         */
        const animate = () => {
            effectRef.current?.update();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        if (props.mouseTracking) {
            // Add mouse interaction event listeners to the window
            // window.addEventListener('click', effectRef.current.handleMouseClick);
            // window.addEventListener('mouseleave', effectRef.current.handleMouseLeave);
            window.addEventListener('mousemove', effectRef.current.handleMouseMove);
        }

        /**
         * Cleanup function to remove event listeners and cancel the animation frame.
         * Destroys the effect instance to free up resources.
         */
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('resize', setCanvasSize);
            if (effectRef.current) {
                window.removeEventListener('click', effectRef.current.handleMouseClick);
                window.removeEventListener('mouseleave', effectRef.current.handleMouseLeave);
                window.removeEventListener('mousemove', effectRef.current.handleMouseMove);
            }
            effectRef.current?.destroy();
            effectRef.current = null;
        };
    }, [props.effectGap, props.effectRadius, props.particleEase, props.particleFriction]);

    /**
     * Updates the active input state and refreshes the mouse position in the effect.
     * This runs whenever the `activeInput` prop changes.
     */
    useEffect(() => {
        if (effectRef.current) {
            effectRef.current.activeInput = props.activeInput ? props.activeInput : false;
            if (effectRef.current.activeInput) {
                effectRef.current.updateMousePosition();
            }
        }
    }, [props.activeInput]);

    /**
     * Renders a div containing the canvas element where the particle effects are displayed.
     */
    return (
        <div id='collision-particles'>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CollisionParticles;
