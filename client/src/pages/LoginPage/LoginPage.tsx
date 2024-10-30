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

// Types
import Color from '@/util/Color.ts';

// Utility
import Keys from '@/util/Keys.ts';
import Pixel from '@/util/Pixel.ts';
import Sound from '@/util/Sound.ts';

// Style
import './_style/LoginPage.scss';
import { error } from 'console';

const LoginPage: React.FC = (): JSX.Element => {
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

    const handleKeyPress = (event: KeyboardEvent) => {
        if (Keys.pressed(event.key, null, true, true, true)) {
            return;
        }

        if (Keys.pressed(event.key, 'Enter')) {
            setIsError(true);
            setErrorCount((prev) => prev + 1); // Necessary to prevent asynchronicity during state batching
            setTimeout(() => setIsError(false), 250);
            error_sound.play();
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
    }, []);

    useEffect(() => {
        const container = displayTextContainerRef.current;
        if (container) {
            const MAX_FONT_SIZE_IN_REM = 7;
            const MAX_FONT_SIZE_IN_PX = Pixel.fromREM(MAX_FONT_SIZE_IN_REM);

            const containerWidth = container.offsetWidth;
            console.log('containerWidth: ', containerWidth);
            const totalLetters = displayText.length;
            console.log('totalLetters: ', totalLetters);
            const letterWidthInPX = containerWidth / totalLetters;
            console.log('letterWidthInPX: ', letterWidthInPX);
            let letterWidthInREM = Pixel.toREM(letterWidthInPX);
            if (letterWidthInPX > MAX_FONT_SIZE_IN_PX) {
                letterWidthInREM = MAX_FONT_SIZE_IN_REM;
            }

            letterRefs.current.forEach((letterRef) => {
                if (letterRef) {
                    if (!letterRef.style.fill) {
                        letterRef.style.fill = Color.HEX.random();
                    }
                    letterRef.style.width = `${letterWidthInREM}rem`;
                }
            });
        }
    }, [displayText]);

    const activeInput = displayText.length > 0;

    console.log(errorCount);

    return (
        <div id='login-page' className={isError ? 'error' : ''}>
            <Icon
                className={`${activeInput ? 'active-input' : ''}`}
                is_image
                id='homepie-logo'
                positioning='absolute'
                src={['homepie-logo']}
            />

            <div
                id='display-text-container'
                className={isError ? 'error' : ''}
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

            <div id='health' className={`${activeInput ? 'active-input' : ''}`}>
                {errorCount >= 3 ? (
                    <Icon key={`heart-3-${errorCount}`} className='heart broken' src={['common', 'heart-broken']} />
                ) : (
                    <Icon key={`heart-3-${errorCount}`} className='heart' src={['common', 'heart']} />
                )}
                {errorCount >= 2 ? (
                    <Icon key={`heart-2-${errorCount}`} className='heart broken' src={['common', 'heart-broken']} />
                ) : (
                    <Icon key={`heart-2-${errorCount}`} className='heart' src={['common', 'heart']} />
                )}
                {errorCount >= 1 ? (
                    <Icon key={`heart-1-${errorCount}`} className='heart broken' src={['common', 'heart-broken']} />
                ) : (
                    <Icon key={`heart-1-${errorCount}`} className='heart' src={['common', 'heart']} />
                )}
            </div>
        </div>
    );
};

export default LoginPage;
