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
import { useState, useEffect, useRef } from 'react';

// Components
import CollisionParticles from '@/components/Particles/CollisionParticles.tsx';
import Icon from '@/components/Icon.tsx';

// Utility
import Keys from '@/util/Keys.ts';
import Pixel from '@/util/Pixel.ts';
import Sound from '@/util/Sound.ts';

// Style
import './_style/LoginPage.scss';

// TODO: Temporary
const DEBUG_MODE = false;

const LoginPage: React.FC = (): JSX.Element => {
    const [displayText, setDisplayText] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isError, setIsError] = useState(false);

    const error_sound = new Sound('error');
    const keyboard_sounds = [
        new Sound('clicks/creamy-click-1'),
        new Sound('clicks/creamy-click-2'),
        new Sound('clicks/creamy-click-3'),
    ];

    const displayTextContainerRef = useRef<HTMLDivElement>(null);
    const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (Keys.pressed(event.key, null, true, true, true)) {
            return;
        }

        if (Keys.pressed(event.key, 'Enter')) {
            if (input !== 'correct_password') {
                setIsError(true);
                setTimeout(() => setIsError(false), 1000);
                error_sound.play();
            } else {
                // Handle successful login
            }
        } else if (Keys.pressed(event.key, 'Backspace')) {
            setDisplayText((prev) => prev.slice(0, -1));
            setInput((prev) => prev.slice(0, -1));
            const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
            randomSound.play();
        } else {
            const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
            randomSound.play();
            setDisplayText((prev) => [...prev, event.key]);
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

    useEffect(() => {
        const container = displayTextContainerRef.current;
        if (container) {
            const MAX_FONT_SIZE_IN_REM = 20;
            const MAX_FONT_SIZE_IN_PX = Pixel.fromREM(MAX_FONT_SIZE_IN_REM);

            const containerWidth = container.offsetWidth * 2;
            const totalLetters = displayText.length;
            const letterWidthInPX = containerWidth / totalLetters;
            let letterWidthInREM = Pixel.toREM(letterWidthInPX);
            if (letterWidthInPX > MAX_FONT_SIZE_IN_PX) {
                letterWidthInREM = MAX_FONT_SIZE_IN_REM;
            }

            letterRefs.current.forEach((letterRef) => {
                if (letterRef) {
                    letterRef.style.fontSize = `${letterWidthInREM}rem`;
                    container.style.height = `${letterRef.offsetHeight}px`;
                }
            });
        }
    }, [displayText]);

    const activeInput = displayText.length > 0;

    return (
        <div id='login-page' className={isError ? 'error' : ''}>
            <div
                id='display-text-container'
                ref={displayTextContainerRef}
                style={{ display: 'flex', flexWrap: 'wrap' }}
            >
                {displayText.map((letter, index) => (
                    <div
                        className='display-text-letter'
                        key={index}
                        ref={(element) => (letterRefs.current[index] = element)}
                    >
                        {DEBUG_MODE ? letter : '*'}
                    </div>
                ))}
            </div>

            <CollisionParticles
                activeInput={activeInput}
                effectGap={20}
                effectRadius={3000}
                particleEase={0.2}
                particleFriction={0.95}
            />

            <Icon
                className={`${activeInput ? 'active-input' : ''}`}
                is_image
                id='homepie-logo'
                positioning='absolute'
                src={['homepie-logo']}
            />

            <div id='health' className={`${activeInput ? 'active-input' : ''}`}>
                <Icon className='heart' src={['common', 'heart']} />
                <Icon className='heart' src={['common', 'heart']} />
                <Icon className='heart' src={['common', 'heart']} />
            </div>
        </div>
    );
};

export default LoginPage;
