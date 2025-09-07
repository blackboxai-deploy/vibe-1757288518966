// SECURITY: Consider using DOMPurify for sanitization
// import DOMPurify from 'dompurify';

/**
 * Intro Video System for BaddBeatz Website
 * Plays intro-video.mp4 when users first visit the site
 */

const ivSanitize = (html) => (window.DOMPurify ? window.DOMPurify.sanitize(html) : html);

class IntroVideoManager {
    constructor() {
        this.videoPath = 'assets/Intro-video.mp4';
        this.hasPlayedKey = 'baddbeatz_intro_played';
        this.sessionKey = 'baddbeatz_session_intro';
        this.init();
    }

    init() {
        // Check if intro should be shown
        if (this.shouldShowIntro()) {
            this.createIntroOverlay();
        }
    }

    shouldShowIntro() {
        // Check if intro has been played in this session
        if (sessionStorage.getItem(this.sessionKey)) {
            return false;
        }

        // Check if user has seen intro recently (within 24 hours)
        const lastPlayed = localStorage.getItem(this.hasPlayedKey);
        if (lastPlayed) {
            const timeDiff = Date.now() - parseInt(lastPlayed);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            if (hoursDiff < 24) {
                return false;
            }
        }

        return true;
    }

    createIntroOverlay() {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'intro-video-overlay';
        overlay.innerHTML = ivSanitize(`
            <div class="intro-video-container">
                <video 
                    id="intro-video" 
                    autoplay 
                    muted 
                    playsinline
                    preload="auto"
                >
                    <source src="${this.videoPath}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="intro-controls">
                    <button id="skip-intro" class="skip-btn">
                        <span>Skip Intro</span>
                        <div class="skip-countdown">
                            <span id="countdown-text">5</span>
                        </div>
                    </button>
                </div>
                <div class="intro-loading" id="intro-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading the experience...</p>
                </div>
            </div>
        `);

        // Add styles
        this.addIntroStyles();

        // Insert overlay at the beginning of body
        document.body.insertBefore(overlay, document.body.firstChild);

        // Setup video events
        this.setupVideoEvents();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    addIntroStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #intro-video-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #000;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .intro-video-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #intro-video {
                max-width: 90vw;
                max-height: 90vh;
                width: auto;
                height: auto;
                object-fit: contain;
                background: #000;
                border-radius: 12px;
                box-shadow: 0 0 30px rgba(255, 0, 51, 0.3);
            }

            .intro-controls {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 10001;
            }

            .skip-btn {
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid #ff0033;
                color: #fff;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .skip-btn:hover {
                background: rgba(255, 0, 51, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 0, 51, 0.3);
            }

            .skip-countdown {
                width: 24px;
                height: 24px;
                border: 2px solid #00ffff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #00ffff;
                position: relative;
            }

            .skip-countdown::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border: 2px solid transparent;
                border-top-color: #00ffff;
                border-radius: 50%;
                animation: countdown-spin 1s linear infinite;
            }

            @keyframes countdown-spin {
                to { transform: rotate(360deg); }
            }

            .intro-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #fff;
                z-index: 10001;
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid #ff0033;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }

            .intro-loading p {
                font-family: 'Orbitron', monospace;
                font-size: 16px;
                margin: 0;
                opacity: 0.8;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .intro-controls {
                    top: 15px;
                    right: 15px;
                }

                .skip-btn {
                    padding: 10px 16px;
                    font-size: 12px;
                }

                .intro-loading p {
                    font-size: 14px;
                }
            }

            /* Fade out animation */
            .intro-fade-out {
                opacity: 0;
                transition: opacity 0.8s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    setupVideoEvents() {
        const video = document.getElementById('intro-video');
        const skipBtn = document.getElementById('skip-intro');
        const loading = document.getElementById('intro-loading');
        const countdownText = document.getElementById('countdown-text');

        let countdown = 5;
        let countdownInterval;

        // Video loading events
        video.addEventListener('loadstart', () => {
            loading.style.display = 'block';
        });

        video.addEventListener('canplay', () => {
            loading.style.display = 'none';
            this.startCountdown();
        });

        video.addEventListener('loadeddata', () => {
            loading.style.display = 'none';
        });

        // Video playback events
        video.addEventListener('ended', () => {
            this.endIntro();
        });

        video.addEventListener('error', (e) => {
            console.warn('Intro video failed to load:', e);
            this.endIntro();
        });

        // Skip button functionality
        skipBtn.addEventListener('click', () => {
            this.endIntro();
        });

        // Countdown functionality
        this.startCountdown = () => {
            countdownInterval = setInterval(() => {
                countdown--;
                countdownText.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    skipBtn.style.opacity = '1';
                    skipBtn.style.pointerEvents = 'auto';
                }
            }, 1000);
        };

        // Auto-skip after video duration or timeout
        setTimeout(() => {
            if (document.getElementById('intro-video-overlay')) {
                this.endIntro();
            }
        }, 30000); // 30 second max timeout
    }

    endIntro() {
        const overlay = document.getElementById('intro-video-overlay');
        if (!overlay) return;

        // Mark intro as played
        localStorage.setItem(this.hasPlayedKey, Date.now().toString());
        sessionStorage.setItem(this.sessionKey, 'true');

        // Fade out animation
        overlay.classList.add('intro-fade-out');

        // Remove overlay after animation
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Trigger any page initialization that was waiting
            this.triggerPageReady();
        }, 800);
    }

    triggerPageReady() {
        // Dispatch custom event for other scripts to know intro is complete
        const event = new CustomEvent('introComplete', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);

        // Initialize any deferred animations or effects
        if (window.enhancedAnimations && window.enhancedAnimations.init) {
            window.enhancedAnimations.init();
        }
    }

    // Public method to force show intro (for testing)
    static forceShowIntro() {
        localStorage.removeItem('baddbeatz_intro_played');
        sessionStorage.removeItem('baddbeatz_session_intro');
        location.reload();
    }

    // Public method to disable intro
    static disableIntro() {
        localStorage.setItem('baddbeatz_intro_played', Date.now().toString());
        sessionStorage.setItem('baddbeatz_session_intro', 'true');
    }
}

// Initialize intro video when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new IntroVideoManager();
    });
} else {
    new IntroVideoManager();
}

// Export for global access
window.IntroVideoManager = IntroVideoManager;
