/**
 * @license
 * Copyright (c) 2024-2025 Burak Günaydin
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
import { useNavigate } from 'react-router-dom';

// Components
import CollisionParticles from '@/components/Particles/CollisionParticles.tsx';
import Icon from '@/components/Icon.tsx';

// Types
import Color from '@/util/Color.ts';

// Utility
import Keys from '@/util/Keys.ts';
import Pixel from '@/util/Pixel.ts';
import Sound from '@/util/Sound.ts';

// Style
import './_style/LoginPage.scss';

const DEBUG_PASSWORD = 'password';
const MAX_FONT_SIZE_IN_REM = 7;
const MAX_LETTERS_PER_LINE = 12;
const MAX_LINES = 3;
const MIN_FONT_SIZE_IN_REM = 2.5;

const LoginPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const [displayText, setDisplayText] = useState<string[]>([]);
    const [errorCount, setErrorCount] = useState<number>(0);
    const [input, setInput] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    const error_sound = new Sound('error');
    const keyboard_sounds = [
        new Sound('clicks/creamy-click-1'),
        new Sound('clicks/creamy-click-2'),
        new Sound('clicks/creamy-click-3'),
    ];

    // Speak.
    // Who is there?
    // Identify.

    // Ahh, yes, I know you
    // You again, welcome back
    // I awaited your return

    // And what is your secret?
    // Tell me your secret
    // I am going to keep your secret

    // I am going to need the master key for that
    // I won't let you in without the master key
    // Sorry, come back with the master key

    const displayTextContainerRef = useRef<HTMLDivElement>(null);
    const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (Keys.pressed(event.key, null, true, true, true)) {
                return;
            }

            if (Keys.pressed(event.key, 'Enter')) {
                if (input === DEBUG_PASSWORD) {
                    navigate('/home');
                } else {
                    setIsError(true);
                    setTimeout(() => setIsError(false), 250);
                    error_sound.play();
                }
            } else if (Keys.pressed(event.key, 'Backspace')) {
                setDisplayText((prev) => prev.slice(0, -1));
                setInput((prev) => prev.slice(0, -1));
                const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
                randomSound.play();
            } else {
                const container = displayTextContainerRef.current;
                const letters = container ? (Array.from(container.children) as HTMLDivElement[]) : [];
                const totalLetters = letters.length;
                if (totalLetters >= MAX_LETTERS_PER_LINE * MAX_LINES) {
                    return;
                }

                const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
                randomSound.play();
                setDisplayText((prev) => [...prev, event.key]);
                setInput((prev) => prev + event.key);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [error_sound, input, keyboard_sounds, navigate]);

    useEffect(() => {
        const container = displayTextContainerRef.current;
        if (container) {
            const letters = Array.from(container.children) as HTMLDivElement[];
            const totalLetters = letters.length;

            if (totalLetters > 0) {
                const lines = Math.ceil(totalLetters / MAX_LETTERS_PER_LINE);
                const lettersPerLine = Math.min(totalLetters, MAX_LETTERS_PER_LINE);
                const containerWidth = container.clientWidth;
                const letterWidth = Math.min(containerWidth / lettersPerLine, MAX_FONT_SIZE_IN_REM * 16);

                letters.forEach((letter) => {
                    if (!letter.style.fill) {
                        letter.style.fill = Color.HEX.random();
                    }
                    if (totalLetters >= MAX_LETTERS_PER_LINE) {
                        letter.style.flexBasis = `${MIN_FONT_SIZE_IN_REM}rem`;
                    } else {
                        letter.style.flexBasis = `${letterWidth}px`;
                    }
                });

                container.style.flexWrap = lines > 1 ? 'wrap' : 'nowrap';
            }
        }
    }, [displayText]);

    useEffect(() => {
        if (isError) {
            if (errorCount < 4) {
                setErrorCount((prev) => prev + 1); // Necessary to prevent asynchronicity during state batching
            }
            if (errorCount >= 3) {
                setErrorCount(4);
            }
        }
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError]);

    const activeInput = displayText.length > 0;

    return (
        <div id='login-page' className={isError ? 'error' : ''}>
            <Icon
                className={activeInput ? 'active-input' : ''}
                is_image
                id='homepie-logo'
                positioning='absolute'
                src={['homepie-logo']}
            />

            <div className={activeInput ? 'active-input' : ''} id='speech-bubble'>
                <p className='speech-bubble-text'>Ahh, yes, I know you</p>
                <p className='speech-bubble-text'>And what is your secret?</p>
            </div>

            <div className={activeInput ? 'active-input' : ''} id='letter-count'>
                <p>{displayText.length}</p>
                <p>/</p>
                <p>{MAX_LETTERS_PER_LINE * MAX_LINES}</p>
            </div>

            <div id='health' className={`${activeInput ? 'active-input' : ''}`}>
                {errorCount >= 3 ? (
                    <Icon className='heart broken' key={`heart-3-${errorCount}`} src={['common', 'heart-broken']} />
                ) : (
                    <Icon className='heart' key={`heart-3-${errorCount}`} src={['common', 'heart']} />
                )}
                {errorCount >= 2 ? (
                    <Icon className='heart broken' key={`heart-2-${errorCount}`} src={['common', 'heart-broken']} />
                ) : (
                    <Icon className='heart' key={`heart-2-${errorCount}`} src={['common', 'heart']} />
                )}
                {errorCount >= 1 ? (
                    <Icon className='heart broken' key={`heart-1-${errorCount}`} src={['common', 'heart-broken']} />
                ) : (
                    <Icon className='heart' key={`heart-1-${errorCount}`} src={['common', 'heart']} />
                )}
            </div>

            <div
                className={isError ? 'error' : ''}
                id='display-text-container'
                ref={displayTextContainerRef}
                style={{ display: 'flex', flexWrap: 'wrap' }}
            >
                {displayText.map((_, index) => (
                    <div
                        className={`display-text-letter unintialized${isError ? ' error' : ''}`}
                        key={index}
                        ref={(element) => (letterRefs.current[index] = element)}
                    >
                        <Icon src={['common', 'asterisk']} />
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
        </div>
    );
};

export default LoginPage;
