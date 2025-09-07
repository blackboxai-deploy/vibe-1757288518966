/* SECURITY: DOMPurify fallback
   If DOMPurify is not present on the page, gracefully no-op sanitize
   to avoid runtime errors while still keeping XSS protection when loaded. */
// import DOMPurify from 'dompurify';
const sanitize = (html) => (window.DOMPurify ? window.DOMPurify.sanitize(html) : html);

/**
 * PWA Initialization Script
 * Registers service worker and handles PWA installation
 */

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // Register service worker
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('[PWA] Service Worker registered successfully:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[PWA] New Service Worker found, installing...');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker installed, show update notification
            showUpdateNotification();
          }
        });
      });
      
      // Handle service worker updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
      
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

// PWA install prompt handling
let deferredPrompt;
const installButton = document.createElement('button');
installButton.id = 'pwa-install-button';
installButton.className = 'pwa-install-btn';
installButton.innerHTML = sanitize(`
  <span class="install-icon">📱</span>
  <span class="install-text">Install App</span>
`);
installButton.style.display = 'none';

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button
  showInstallButton();
  
  console.log('[PWA] Install prompt ready');
});

// Show install button
function showInstallButton() {
  // Add button to page if not already added
  if (!document.body.contains(installButton)) {
    document.body.appendChild(installButton);
  }
  
  installButton.style.display = 'flex';
  
  // Add click handler
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      // Hide install button
      installButton.style.display = 'none';
      
      // Track installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'Install accepted'
        });
      }
    }
    
    // Clear the deferredPrompt
    deferredPrompt = null;
  });
}

// Check if app is installed
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  
  // Hide install button
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // Show success notification
  showNotification('BaddBeatz installed successfully!', 'success');
});

// Show update notification
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'pwa-update-notification';
notification.innerHTML = sanitize(`
    <div class="update-content">
      <span class="update-icon">🔄</span>
      <div class="update-text">
        <strong>Update Available!</strong>
        <p>A new version of BaddBeatz is available.</p>
      </div>
      <button class="update-btn" onclick="updateApp()">Update Now</button>
    </div>
  `);
  
  document.body.appendChild(notification);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// Update app
window.updateApp = function() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
};

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `pwa-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Check online/offline status
window.addEventListener('online', () => {
  showNotification('You are back online!', 'success');
});

window.addEventListener('offline', () => {
  showNotification('You are offline. Some features may be limited.', 'warning');
});

// Add PWA styles
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
  /* PWA Install Button */
  .pwa-install-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(45deg, #00ffff, #ff00ff);
    color: #000;
    border: none;
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
    transition: all 0.3s ease;
    z-index: 9999;
    animation: slideInRight 0.5s ease;
  }
  
  .pwa-install-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 255, 0.4);
  }
  
  .install-icon {
    font-size: 1.2rem;
  }
  
  /* PWA Notifications */
  .pwa-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    transition: opacity 0.3s ease;
  }
  
  .pwa-notification.success {
    border-left: 4px solid #00ff00;
  }
  
  .pwa-notification.warning {
    border-left: 4px solid #ffaa00;
  }
  
  .pwa-notification.info {
    border-left: 4px solid #00ffff;
  }
  
  /* PWA Update Notification */
  .pwa-update-notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 10px;
    padding: 20px;
    max-width: 350px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    z-index: 9999;
    animation: slideInLeft 0.5s ease;
  }
  
  .update-content {
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }
  
  .update-icon {
    font-size: 2rem;
    animation: rotate 2s linear infinite;
  }
  
  .update-text {
    flex: 1;
    color: #fff;
  }
  
  .update-text strong {
    display: block;
    margin-bottom: 5px;
    color: #00ffff;
  }
  
  .update-text p {
    margin: 0;
    font-size: 0.9rem;
    color: #ccc;
  }
  
  .update-btn {
    background: linear-gradient(45deg, #00ffff, #ff00ff);
    color: #000;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .update-btn:hover {
    transform: scale(1.05);
  }
  
  /* Animations */
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    .pwa-install-btn {
      bottom: 70px;
      right: 10px;
      padding: 10px 20px;
      font-size: 0.9rem;
    }
    
    .pwa-notification {
      right: 10px;
      left: 10px;
      max-width: none;
    }
    
    .pwa-update-notification {
      left: 10px;
      right: 10px;
      max-width: none;
    }
  }
`;

document.head.appendChild(pwaStyles);

// Log PWA status
console.log('[PWA] Initialization complete');
