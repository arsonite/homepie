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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import CollisionParticles from '@/components/Particles/CollisionParticles.tsx';
import Icon from '@/components/Icon.tsx';

// Types
import Color from '@/util/Color.ts';

// Utility
import Keys from '@/util/Keys.ts';
import Sound from '@/util/Sound.ts';
import Storage from '@/util/Storage.ts';

// Style
import './_style/LoginPage.scss';

const DEBUG_PASSWORD = 'terrencehill'; // Debug password for testing
const DEBUG_USERNAME = 'budspencer'; // Debug username for testing
const MAX_FONT_SIZE_IN_REM = 7; // Maximum font size in rem units
const MAX_LETTERS_PER_LINE = 12; // Max letters allowed per line
const MAX_LINES = 3; // Maximum number of lines
const MIN_FONT_SIZE_IN_REM = 2.5; // Minimum font size in rem units

/**
 * LoginPage component handles user login interactions, input display,
 * error handling, and visual effects.
 */
// TODO: Fix particles performance issues on rerender/make proper deconstruction
// TODO: Implement different display box for username, so that i can shift to the top and also fix spacing
// Implement parallax effect
const LoginPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate(); // Hook for navigation

    // State to track active input
    const [activeInput, setActiveInput] = useState<boolean>(false);
    // State to store displayed text as an array of characters
    const [displayText, setDisplayText] = useState<string[]>([]);
    // State to track the number of input errors
    const [errorCount, setErrorCount] = useState<number>(0);
    // State to keep the current input string
    const [input, setInput] = useState<string>('');
    // State to indicate if there's an error in input
    const [isError, setIsError] = useState<boolean>(false);
    // State to indicate if the password input is active
    const [passwordMode, setPasswordMode] = useState<boolean>(false);
    // State to store the current username input
    const [username, setUsername] = useState<string>('');

    // Memoized Sound instance for error feedback
    const error_sound = useMemo(() => new Sound('error'), []);
    // Memoized array of Sound instances for keyboard clicks
    const keyboard_sounds = useMemo(
        () => [
            new Sound('clicks/creamy-click-1'),
            new Sound('clicks/creamy-click-2'),
            new Sound('clicks/creamy-click-3'),
        ],
        []
    );

    // Ref to the container displaying the input text
    const displayTextContainerRef = useRef<HTMLDivElement>(null);
    // Ref array to store individual letter elements
    const letterRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Function to perform login based on username and password
    const performLogin = useCallback(() => {
        if (username === DEBUG_USERNAME && input === DEBUG_PASSWORD) {
            // TODO: Temporary login storage until proper authentication is implemented
            Storage.set('login', username, true);
            navigate('/hub'); // Navigate to hub if password is correct
        } else {
            setIsError(true); // Trigger error state
            setTimeout(() => setIsError(false), 250); // Reset error state after delay
            error_sound.play(); // Play error sound
        }
    }, [error_sound, input, username, navigate]);

    const handleUsername = useCallback(() => {
        setPasswordMode(true);
        setUsername(input);
        setInput('');
        setDisplayText([]);
    }, [input]);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            // Ignore specific key presses based on utility function
            if (Keys.pressed(event.key, null, true, true, true)) {
                return;
            }

            // Handle Enter key press
            if (Keys.pressed(event.key, 'Enter')) {
                if (passwordMode) {
                    performLogin();
                } else {
                    handleUsername();
                }
            } else if (Keys.pressed(event.key, 'Backspace')) {
                // Handle Backspace key press
                setDisplayText((prev) => prev.slice(0, -1)); // Remove last character from displayText
                setInput((prev) => prev.slice(0, -1)); // Remove last character from input
                // Play a random keyboard click soundw
                const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
                randomSound.play();
            } else {
                // Handle regular character input
                const container = displayTextContainerRef.current;
                const letters = container ? (Array.from(container.children) as HTMLDivElement[]) : [];
                const totalLetters = letters.length;
                // Prevent adding more letters than the maximum allowed
                if (totalLetters >= MAX_LETTERS_PER_LINE * MAX_LINES) {
                    return;
                }
                // Play a random keyboard click sound
                const randomSound = keyboard_sounds[Math.floor(Math.random() * keyboard_sounds.length)];
                randomSound.play();
                // Add the new character to displayText and input
                setDisplayText((prev) => [...prev, event.key]);
                setInput((prev) => prev + event.key);
            }
        },
        [keyboard_sounds, passwordMode, handleUsername, performLogin]
    );

    /**
     * Effect to handle key press events for user input.
     */
    useEffect(() => {
        /**
         * Handles key press events.
         * @param event - Keyboard event object
         */

        // Attach the keydown event listener
        window.addEventListener('keydown', handleKeyPress);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
        /* By adding handleKeyPress to the dependency array, the useEffect will re-run whenever handleKeyPress changes.
         * Since handleKeyPress is memoized with useCallback, it only updates when one of its dependencies
         * (passwordMode, performLogin, handleUsername, keyboard_sounds) changes, minimizing unnecessary effect executions.
         */
    }, [handleKeyPress]);

    /**
     * Effect to update the display text container and letter styles
     * whenever displayText changes.
     */
    useEffect(() => {
        const container = displayTextContainerRef.current;
        if (container) {
            const letters = Array.from(container.children) as HTMLDivElement[];
            const totalLetters = letters.length;

            if (totalLetters > 0) {
                const lines = Math.ceil(totalLetters / MAX_LETTERS_PER_LINE); // Calculate number of lines
                const lettersPerLine = Math.min(totalLetters, MAX_LETTERS_PER_LINE); // Letters in the current line
                const containerWidth = container.clientWidth; // Width of the container
                const letterWidth = Math.min(containerWidth / lettersPerLine, MAX_FONT_SIZE_IN_REM * 16); // Calculate letter width

                letters.forEach((letter) => {
                    if (!letter.style.fill) {
                        const randomColor = Color.HEX.random(); // Generate random color
                        letter.style.color = randomColor;
                        letter.style.fill = randomColor;
                    }
                    if (totalLetters >= MAX_LETTERS_PER_LINE) {
                        letter.style.fontSize = `${MIN_FONT_SIZE_IN_REM}rem`; // Set maximum font size
                        letter.style.flexBasis = `${MIN_FONT_SIZE_IN_REM}rem`; // Set minimum font size
                    } else {
                        letter.style.fontSize = `${letterWidth}px`; // Set dynamic font size based on container
                        letter.style.flexBasis = `${letterWidth}px`; // Set dynamic font size based on container
                    }
                });

                // Set flex wrapping based on the number of lines
                container.style.flexWrap = lines > 1 ? 'wrap' : 'nowrap';
            }
        }
        if (!passwordMode) {
            setActiveInput(displayText.length > 0); // Set active input state based on displayText length
        }
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayText]);

    /**
     * Effect to handle error count updates when an error occurs.
     */
    useEffect(() => {
        if (isError) {
            if (errorCount < 4) {
                setErrorCount((prev) => prev + 1); // Necessary to prevent asynchronicity during state batching
            }
            if (errorCount >= 3) {
                setErrorCount(4); // Cap error count at 4
            }
        }
        // Intended behaviour
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError]);
    console.log(username, input);

    return (
        <div id='login-page' className={isError ? 'error' : ''}>
            {/* Logo Icon */}
            <Icon
                className={`logo${activeInput ? ' active-input' : ''}`}
                is_image
                id='homepie-logo'
                positioning='absolute'
                src={['homepie-logo']}
            />
            <Icon
                className={`logo${activeInput ? ' active-input' : ''}`}
                is_image
                id='homepie-logo-with-font'
                positioning='absolute'
                src={['homepie-logo-with-font']}
            />

            {/* Display current letter count */}
            <div className={activeInput ? 'active-input' : ''} id='letter-count'>
                <p>{displayText.length}</p>
                <p>/</p>
                <p>{MAX_LETTERS_PER_LINE * MAX_LINES}</p>
            </div>

            {/* Health indicators showing error status */}
            <div id='health' className={`${activeInput ? 'active-input' : ''}`}>
                {[3, 2, 1].map((level) => (
                    <Icon
                        className={`heart${errorCount >= level ? ' broken' : ''}`}
                        key={`heart-${level}-${errorCount}`}
                        src={['common', errorCount >= level ? 'heart-broken' : 'heart']}
                    />
                ))}
            </div>

            {passwordMode && (
                <div id='username-display'>
                    <p>{username}</p>
                </div>
            )}

            {passwordMode ? (
                <div
                    className={`display-text-container${isError ? ' error' : ''}`}
                    id='display-text-password-container'
                    ref={displayTextContainerRef}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    {/* Container for displaying password asterisks */}
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
            ) : (
                <div
                    className='display-text-container'
                    id='display-text-username-container'
                    ref={displayTextContainerRef}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    {/* Container for displaying username input text */}
                    {displayText.map((letter, index) => (
                        <div
                            className={`display-text-letter unintialized${isError ? ' error' : ''}`}
                            key={index}
                            ref={(element) => (letterRefs.current[index] = element)}
                        >
                            {letter}
                        </div>
                    ))}
                </div>
            )}

            {/* Particle effects component */}
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
