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
import { useState, useEffect } from 'react';

// Components
import CollisionParticles from '@/components/Particles/CollisionParticles.tsx';
import Icon from '@/components/Icon.tsx';

// Media imports TODO: Make util function
import clickyKey1Loud from '@/assets/sfx/clicks/loud/clicky-key-1-loud.mp3';
import clickyKey2Loud from '@/assets/sfx/clicks/loud/clicky-key-2-loud.mp3';
import clickyKey3Loud from '@/assets/sfx/clicks/loud/clicky-key-3-loud.mp3';
import clickyKey4Loud from '@/assets/sfx/clicks/loud/clicky-key-4-loud.mp3';
import softClick from '@/assets/sfx/clicks/loud/soft-click-loud.mp3';

// Style
import './_style/LoginPage.scss';

const LoginPage = () => {
    const [displayText, setDisplayText] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isError, setIsError] = useState(false);

    const keyboard_sounds = [
        new Audio(clickyKey1Loud),
        new Audio(clickyKey2Loud),
        new Audio(clickyKey3Loud),
        new Audio(clickyKey4Loud),
    ];
    const soft_click_sound = new Audio(softClick);

    const handleKeyPress = (event: KeyboardEvent) => {
        // TODO: Make keys constants
        if (
            event.key === 'Alt' ||
            event.key === 'AltGraph' ||
            event.key === 'AltRight' ||
            event.key === 'ArrowDown' ||
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight' ||
            event.key === 'ArrowUp' ||
            event.key === 'AudioVolumeDown' ||
            event.key === 'AudioVolumeUp' ||
            event.key === 'CapsLock' ||
            event.key === 'Control' ||
            event.key === 'Delete' ||
            event.key === 'End' ||
            event.key === 'Escape' ||
            event.key === 'F1' ||
            event.key === 'F2' ||
            event.key === 'F3' ||
            event.key === 'F4' ||
            event.key === 'F5' ||
            event.key === 'F6' ||
            event.key === 'F7' ||
            event.key === 'F8' ||
            event.key === 'F9' ||
            event.key === 'F10' ||
            event.key === 'F11' ||
            event.key === 'F12' ||
            event.key === 'Home' ||
            event.key === 'MediaPlayPause' ||
            event.key === 'MediaTrackNext' ||
            event.key === 'MediaTrackPrevious' ||
            event.key === 'Meta' ||
            event.key === 'PageDown' ||
            event.key === 'PageUp' ||
            event.key === 'Pause' ||
            event.key === 'PrintScreen' ||
            event.key === 'ScrollLock' ||
            event.key === 'Shift' ||
            event.key === 'Tab'
        ) {
            return;
        }

        if (event.key === 'Enter') {
            if (input !== 'correct_password') {
                setIsError(true);
                setTimeout(() => setIsError(false), 1000);
            } else {
                // Handle successful login
            }
        } else if (event.key === 'Backspace') {
            setDisplayText((prev) => prev.slice(0, -1));
            setInput((prev) => prev.slice(0, -1));
            soft_click_sound.play();
        } else {
            const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
            randomSound.play();
            setDisplayText((prev) => [...prev, '*']);
            setInput((prev) => prev + event.key);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    return (
        <div id='login-page' className={isError ? 'error' : ''}>
            <CollisionParticles effectGap={20} effectRadius={3000} particleEase={0.2} particleFriction={0.95} />

            <div id='display-text-container'>
                <div id='display-text'>{displayText}</div>
            </div>
        </div>
    );
};

export default LoginPage;
