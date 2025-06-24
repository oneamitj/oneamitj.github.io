// Enhanced typewriter effect with multiple animation styles

class TypewriterEffect {
    constructor(options = {}) {
        this.defaultSpeed = options.speed || 10; // Reduced from 50 to 15ms
        this.cursor = options.cursor || '▋';
        this.cursorClass = options.cursorClass || 'cursor';
        this.sounds = options.sounds || false;
    }

    // Main typewriter effect
    async type(element, text, speed = this.defaultSpeed) {
        return new Promise((resolve) => {
            let index = 0;
            element.textContent = '';
            
            const typeChar = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    
                    // Play typing sound if enabled
                    if (this.sounds) {
                        this.playTypeSound();
                    }
                    
                    setTimeout(typeChar, speed + this.getRandomDelay());
                } else {
                    resolve();
                }
            };
            
            typeChar();
        });
    }

    // Typewriter effect with HTML support
    async typeHTML(element, htmlContent, speed = this.defaultSpeed) {
        return new Promise((resolve) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const textContent = tempDiv.textContent || tempDiv.innerText;
            
            let index = 0;
            element.innerHTML = '';
            
            const typeChar = () => {
                if (index < textContent.length) {
                    element.textContent += textContent.charAt(index);
                    index++;
                    setTimeout(typeChar, speed + this.getRandomDelay());
                } else {
                    // Replace with full HTML after typing is complete
                    element.innerHTML = htmlContent;
                    resolve();
                }
            };
            
            typeChar();
        });
    }

    // Matrix-style digital rain effect
    async matrixEffect(element, duration = 3000) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZあいうえおかきくけこ';
        const originalText = element.textContent;
        const textLength = originalText.length;
        
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                let newText = '';
                for (let i = 0; i < textLength; i++) {
                    if (Math.random() < progress) {
                        newText += originalText[i];
                    } else {
                        newText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                
                element.textContent = newText;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = originalText;
                    resolve();
                }
            };
            
            animate();
        });
    }

    // Glitch effect
    async glitchEffect(element, text, duration = 2000) {
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        return new Promise((resolve) => {
            let phase = 0;
            const phases = [
                () => this.scrambleText(element, text, glitchChars),
                () => this.type(element, text, 30)
            ];
            
            const nextPhase = async () => {
                if (phase < phases.length) {
                    await phases[phase]();
                    phase++;
                    setTimeout(nextPhase, duration / phases.length);
                } else {
                    resolve();
                }
            };
            
            nextPhase();
        });
    }

    // Terminal boot sequence effect
    async bootSequence(element, lines, speed = 100) {
        element.innerHTML = '';
        
        for (const line of lines) {
            const lineDiv = document.createElement('div');
            element.appendChild(lineDiv);
            
            if (line.startsWith('[') && line.includes(']')) {
                // Status line
                await this.typeStatusLine(lineDiv, line, speed);
            } else {
                // Regular line
                await this.type(lineDiv, line, speed);
            }
            
            // Add small delay between lines
            await this.sleep(50);
        }
    }

    // Progress bar animation
    async progressBar(element, label, duration = 2000) {
        const width = 30;
        
        return new Promise((resolve) => {
            let progress = 0;
            const interval = 50;
            const increment = 100 / (duration / interval);
            
            const updateProgress = () => {
                const filled = Math.floor((progress / 100) * width);
                const empty = width - filled;
                const bar = '█'.repeat(filled) + '░'.repeat(empty);
                
                element.textContent = `${label}: [${bar}] ${Math.floor(progress)}%`;
                
                progress += increment;
                
                if (progress >= 100) {
                    element.textContent = `${label}: [${'█'.repeat(width)}] 100% ✓`;
                    resolve();
                } else {
                    setTimeout(updateProgress, interval);
                }
            };
            
            updateProgress();
        });
    }

    // Utility methods
    getRandomDelay() {
        return Math.random() * 30; // Add some human-like variation
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    scrambleText(element, finalText, chars) {
        return new Promise((resolve) => {
            let iterations = 0;
            const maxIterations = 10;
            
            const scramble = () => {
                let scrambled = '';
                for (let i = 0; i < finalText.length; i++) {
                    if (Math.random() < 0.7) {
                        scrambled += chars[Math.floor(Math.random() * chars.length)];
                    } else {
                        scrambled += finalText[i];
                    }
                }
                
                element.textContent = scrambled;
                iterations++;
                
                if (iterations < maxIterations) {
                    setTimeout(scramble, 100);
                } else {
                    resolve();
                }
            };
            
            scramble();
        });
    }

    async typeStatusLine(element, line, speed) {
        const parts = line.match(/\[(.*?)\](.*)/);
        if (parts) {
            const status = parts[1];
            const message = parts[2];
            
            await this.type(element, `[${status}]`, speed);
            await this.type(element, message, speed / 2);
            
            // Add status color
            if (status.toLowerCase().includes('ok') || status.toLowerCase().includes('success')) {
                element.className = 'success';
            } else if (status.toLowerCase().includes('error') || status.toLowerCase().includes('fail')) {
                element.className = 'error';
            }
        } else {
            await this.type(element, line, speed);
        }
    }

    playTypeSound() {
        // Create simple beep sound using Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            
            gain.gain.setValueAtTime(0.01, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        }
    }

    // Add blinking cursor
    addCursor(element) {
        const cursorSpan = document.createElement('span');
        cursorSpan.className = this.cursorClass;
        cursorSpan.textContent = this.cursor;
        element.appendChild(cursorSpan);
        return cursorSpan;
    }

    removeCursor(element) {
        const cursor = element.querySelector(`.${this.cursorClass}`);
        if (cursor) {
            cursor.remove();
        }
    }
}

// Global instance for easy access
window.typewriter = new TypewriterEffect({
    speed: 15, // Reduced from 50 to 15ms
    cursor: '▋',
    sounds: false
});

// Legacy function for backward compatibility
const typewriterEffect = (element, text, delay = 25) => { // Reduced from 100 to 25ms
    return window.typewriter.type(element, text, delay);
};
