// PWA Installation and Management
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = false;
        
        this.init();
    }

    init() {
        this.checkStandaloneMode();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupUpdateNotification();
        this.addPWACommands();
    }

    // Check if app is running in standalone mode
    checkStandaloneMode() {
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
        
        if (this.isStandalone) {
            this.isInstalled = true;
            document.body.classList.add('pwa-installed');
        }
    }

    // Register service worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                console.log('✅ SW registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    this.handleServiceWorkerUpdate(registration);
                });
                
                // Handle messages from service worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    this.handleServiceWorkerMessage(event);
                });
                
            } catch (error) {
                console.error('❌ SW registration failed:', error);
            }
        }
    }

    // Handle service worker updates
    handleServiceWorkerUpdate(registration) {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
            }
        });
    }

    // Show update notification
    showUpdateNotification() {
        if (window.terminal) {
            window.terminal.typeText(`
🔄 Portfolio update available!

Type 'pwa update' to refresh with latest changes.
`, 10);
        }
    }

    // Handle messages from service worker
    handleServiceWorkerMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'VERSION_INFO':
                console.log('SW Version:', data.version);
                break;
            case 'CACHE_UPDATED':
                console.log('Cache updated:', data.url);
                break;
        }
    }

    // Setup install prompt handling
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallHint();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.showInstallSuccess();
        });
    }

    // Show install hint in terminal
    showInstallHint() {
        if (window.terminal && !this.isInstalled) {
            setTimeout(() => {
                window.terminal.typeText(`
💡 Tip: This portfolio can be installed as an app!

Type 'pwa install' to install it on your device.
`, 15);
            }, 3000);
        }
    }

    // Show installation success message
    showInstallSuccess() {
        if (window.terminal) {
            window.terminal.typeText(`
🎉 Portfolio app installed successfully!

You can now access it from your home screen/desktop.
`, 12);
        }
    }

    // Install the PWA
    async installPWA() {
        if (!this.deferredPrompt) {
            return {
                success: false,
                message: 'Installation not available on this device/browser.'
            };
        }

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            this.deferredPrompt = null;
            
            return {
                success: outcome === 'accepted',
                message: outcome === 'accepted' 
                    ? 'Installation started!' 
                    : 'Installation cancelled.'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Installation failed: ' + error.message
            };
        }
    }

    // Update the PWA
    async updatePWA() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            
            if (registration) {
                await registration.update();
                
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                    return { success: true, message: 'Update applied! Refreshing...' };
                }
                
                return { success: true, message: 'Already up to date!' };
            }
        }
        
        return { success: false, message: 'Update not available.' };
    }

    // Get PWA status
    getPWAStatus() {
        return {
            isInstalled: this.isInstalled,
            isStandalone: this.isStandalone,
            canInstall: !!this.deferredPrompt,
            hasServiceWorker: 'serviceWorker' in navigator,
            isOnline: navigator.onLine
        };
    }

    // Setup update notification
    setupUpdateNotification() {
        // Check for updates periodically when online
        setInterval(() => {
            if (navigator.onLine && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration()
                    .then(registration => {
                        if (registration) {
                            registration.update();
                        }
                    });
            }
        }, 60000); // Check every minute
    }

    // Add PWA-related commands to terminal
    addPWACommands() {
        // We'll integrate this with the terminal's command system
        if (window.terminal) {
            // Add commands after terminal is initialized
            setTimeout(() => {
                this.integratePWACommands();
            }, 1000);
        }
    }

    // Integrate PWA commands with terminal
    integratePWACommands() {
        // This will be called from terminal.js to add PWA commands
        console.log('PWA Manager ready for command integration');
    }

    // Handle offline/online status
    setupNetworkHandling() {
        window.addEventListener('online', () => {
            if (window.terminal) {
                window.terminal.typeText(`
🌐 Connection restored! You're back online.
`, 10);
            }
        });

        window.addEventListener('offline', () => {
            if (window.terminal) {
                window.terminal.typeText(`
📱 You're now offline, but the portfolio still works!

All cached content is available for browsing.
`, 10);
            }
        });
    }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Make it globally available
window.pwaManager = pwaManager;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}
