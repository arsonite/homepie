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
import creamyClick1 from '@/assets/sfx/creamy-keyboard-click-1.mp3';
import creamyClick2 from '@/assets/sfx/creamy-keyboard-click-2.mp3';
import creamyClick3 from '@/assets/sfx/creamy-keyboard-click-3.mp3';

// Style
import './_style/LoginPage.scss';

const LoginPage = () => {
    const [displayText, setDisplayText] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isError, setIsError] = useState(false);

    // TODO: Sounds are REALLY quiet, make much louder also better clickier button sfx
    const sounds = [new Audio(creamyClick1), new Audio(creamyClick2), new Audio(creamyClick3)];

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (input !== 'correct_password') {
                setIsError(true);
                setTimeout(() => setIsError(false), 1000);
            } else {
                // Handle successful login
            }
        } else if (event.key === 'Backspace') {
            setInput((prev) => prev.slice(0, -1));
            setDisplayText((prev) => prev.slice(0, -1));
        } else {
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            randomSound.play();
            setInput((prev) => prev + event.key);
            setDisplayText((prev) => prev + '*');
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
            <CollisionParticles />

            <div id='display-text-container'>
                <div id='display-text'>{displayText}</div>
            </div>
        </div>
    );
};

export default LoginPage;
