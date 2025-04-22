// TizenTuneIn - Enhance the TuneIn experience on Samsung Tizen TVs
(function() {
    'use strict';

    // Configuration
    const config = {
        focusColor: '#3498db',
        controlsTimeout: 5000 // ms before controls auto-hide
    };

    // Add TV-specific CSS
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Increase font sizes and element sizes for TV viewing */
            body, button, input, select, textarea {
                font-size: 1.5em !important;
            }
            
            /* Improve focus visibility */
            :focus, [focused=true], .focus-visible {
                outline: 3px solid ${config.focusColor} !important;
                outline-offset: 2px !important;
            }
            
            /* Make scrollbars larger for TV remote navigation */
            ::-webkit-scrollbar {
                width: 20px !important;
            }
            
            /* Increase touch target sizes */
            button, .button, [role="button"], .clickable {
                min-height: 60px !important;
                min-width: 60px !important;
                padding: 12px 20px !important;
            }
            
            /* Add custom TV UI container */
            #tv-controls-overlay {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                border-radius: 10px;
                padding: 15px;
                z-index: 9999;
                display: flex;
                gap: 20px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            #tv-controls-overlay.visible {
                opacity: 1;
            }
            
            .tv-control-btn {
                color: white;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .tv-control-btn .key {
                background: #555;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.8em;
            }
        `;
        document.head.appendChild(style);
    }

    // Create TV controls overlay
    function createTVControlsUI() {
        const overlay = document.createElement('div');
        overlay.id = 'tv-controls-overlay';
        
        const controls = [
            { key: 'OK', action: 'Select' },
            { key: '◀ ▶', action: 'Navigate' },
            { key: 'BACK', action: 'Go Back' },
            { key: 'PLAY/PAUSE', action: 'Toggle Playback' }
        ];
        
        controls.forEach(control => {
            const btn = document.createElement('div');
            btn.className = 'tv-control-btn';
            btn.innerHTML = `<span class="key">${control.key}</span> <span>${control.action}</span>`;
            overlay.appendChild(btn);
        });
        
        document.body.appendChild(overlay);
        
        // Show controls initially
        setTimeout(() => {
            overlay.classList.add('visible');
            
            // Auto-hide after timeout
            setTimeout(() => {
                overlay.classList.remove('visible');
            }, config.controlsTimeout);
        }, 1000);
        
        // Show controls on any key press
        document.addEventListener('keydown', () => {
            overlay.classList.add('visible');
            
            // Reset auto-hide timer
            clearTimeout(window.controlsTimer);
            window.controlsTimer = setTimeout(() => {
                overlay.classList.remove('visible');
            }, config.controlsTimeout);
        });
    }

    // Handle TV remote navigation
    function setupTVRemoteNavigation() {
        // Find all clickable elements
        const makeElementsFocusable = () => {
            const clickableElements = document.querySelectorAll('a, button, [role="button"], .clickable, input, select');
            clickableElements.forEach(el => {
                if (!el.getAttribute('tabindex')) {
                    el.setAttribute('tabindex', '0');
                }
            });
        };
        
        // Run initially and on DOM changes
        makeElementsFocusable();
        
        // Set up a mutation observer to make new elements focusable
        const observer = new MutationObserver(mutations => {
            makeElementsFocusable();
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        // Handle media keys
        document.addEventListener('keydown', (e) => {
            // Find play buttons or audio elements
            const playButton = document.querySelector('[aria-label*="play" i], [title*="play" i], .play-button, button:contains("Play")');
            const audio = document.querySelector('audio, video');
            
            switch (e.key) {
                case 'MediaPlayPause':
                    if (audio) {
                        audio.paused ? audio.play() : audio.pause();
                    } else if (playButton) {
                        playButton.click();
                    }
                    break;
                case 'MediaPlay':
                    if (audio) audio.play();
                    else if (playButton) playButton.click();
                    break;
                case 'MediaPause':
                    if (audio) audio.pause();
                    break;
                case 'MediaStop':
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                    break;
                // Add more media key handling as needed
            }
        });
    }

    // Wait for page to be fully loaded
    function initWhenReady() {
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    }

    // Initialize the TV enhancements
    function init() {
        console.log('TizenTuneIn initialized');
        addCustomStyles();
        createTVControlsUI();
        setupTVRemoteNavigation();
        
        // Check if we need to bypass any login screens or entrance pages
        const autoNavigate = setInterval(() => {
            // Example: auto-click on "Listen Now" or similar buttons
            const listenButton = document.querySelector('[aria-label*="listen" i], [title*="listen" i], .listen-button');
            if (listenButton) {
                listenButton.click();
                clearInterval(autoNavigate);
            }
        }, 1000);
        
        // Clear the auto-navigation after 10 seconds
        setTimeout(() => clearInterval(autoNavigate), 10000);
    }

    // Start the script
    initWhenReady();
})();