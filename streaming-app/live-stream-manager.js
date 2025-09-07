// SECURITY: DOMPurify is loaded via CDN in HTML
// Ensure DOMPurify is available globally

/**
 * BaddBeatz Live Stream Manager
 * Handles multi-platform streaming integration with real-time chat
 * Optimized for European electronic music events
 */

class LiveStreamManager {
    constructor() {
        this.platforms = {
            twitch: {
                name: 'Twitch',
                chatEnabled: true,
                embedUrl: 'https://player.twitch.tv/',
                chatUrl: 'https://www.twitch.tv/embed/{channel}/chat'
            },
            youtube: {
                name: 'YouTube Live',
                chatEnabled: true,
                embedUrl: 'https://www.youtube.com/embed/',
                chatUrl: 'https://www.youtube.com/live_chat'
            },
            facebook: {
                name: 'Facebook Live',
                chatEnabled: false,
                embedUrl: 'https://www.facebook.com/plugins/video.php'
            },
            tiktok: {
                name: 'TikTok Live',
                chatEnabled: true,
                embedUrl: 'https://www.tiktok.com/embed/',
                chatUrl: 'https://www.tiktok.com/live_chat'
            }
        };
        
        this.currentStream = null;
        this.chatEnabled = true;
        this.streamQuality = 'auto';
        this.viewers = 0;
        this.isLive = false;
        
        // European timezone handling
        this.timezone = 'Europe/Amsterdam';
        this.locale = 'en-EU';
        
        this.initializeEventListeners();
        this.loadStreamSchedule();
    }

    /**
     * Initialize live stream with platform-specific settings
     */
    async initializeStream(platform, streamData) {
        try {
            this.currentStream = {
                platform: platform,
                id: streamData.id,
                title: streamData.title,
                startTime: new Date(streamData.startTime),
                genre: streamData.genre || 'Electronic',
                chatEnabled: this.platforms[platform].chatEnabled
            };

            await this.setupStreamEmbed(platform, streamData);
            await this.initializeChat(platform, streamData);
            this.startStreamMonitoring();
            
            this.showNotification(`🔴 LIVE: ${streamData.title}`, 'live-stream');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize stream:', error);
            this.showError('Failed to load live stream');
            return false;
        }
    }

    /**
     * Setup platform-specific stream embed
     */
    async setupStreamEmbed(platform, streamData) {
        const container = document.getElementById('live-stream-container');
        if (!container) return;

        let embedHTML = '';
        
        switch (platform) {
            case 'twitch':
                embedHTML = `
                    <iframe 
                        src="https://player.twitch.tv/?channel=${streamData.channel}&parent=${window.location.hostname}&autoplay=false&muted=false"
                        height="480"
                        width="100%"
                        allowfullscreen="true">
                    </iframe>
                `;
                break;
                
            case 'youtube':
                embedHTML = `
                    <iframe 
                        src="https://www.youtube.com/embed/${streamData.id}?autoplay=0&enablejsapi=1"
                        height="480"
                        width="100%"
                        allowfullscreen="true">
                    </iframe>
                `;
                break;
                
            case 'facebook':
                embedHTML = `
                    <iframe 
                        src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(streamData.url)}&width=100%&show_text=false&appId=${streamData.appId}"
                        height="480"
                        width="100%"
                        allowfullscreen="true">
                    </iframe>
                `;
                break;
                
            case 'tiktok':
                embedHTML = `
                    <iframe 
                        src="https://www.tiktok.com/embed/live/${streamData.id}?autoplay=0&controls=1"
                        height="480"
                        width="100%"
                        allowfullscreen="true"
                        frameborder="0">
                    </iframe>
                `;
                break;
        }
        
        container.innerHTML = DOMPurify.sanitize(embedHTML);
        this.addStreamOverlay(streamData);
    }

    /**
     * Add custom overlay with DJ info and track details
     */
    addStreamOverlay(streamData) {
        const overlay = document.createElement('div');
        overlay.className = 'stream-overlay';
        overlay.innerHTML = DOMPurify.sanitize(`
            <div class="stream-info">
                <div class="dj-info">
                    <h3>🎧 ${this.escapeHtml(streamData.djName || 'TheBadGuyHimself')}</h3>
                    <p class="genre-tag">${this.escapeHtml(streamData.genre)}</p>
                </div>
                <div class="live-stats">
                    <span class="live-indicator">🔴 LIVE</span>
                    <span class="viewer-count" id="viewer-count">0 viewers</span>
                    <span class="bpm-counter" id="bpm-display">-- BPM</span>
                </div>
            </div>
            <div class="current-track" id="current-track">
                <marquee>🎵 Track info will appear here...</marquee>
            </div>
        `);
        
        document.getElementById('live-stream-container').appendChild(overlay);
    }

    /**
     * Initialize real-time chat integration
     */
    async initializeChat(platform, streamData) {
        if (!this.platforms[platform].chatEnabled) return;
        
        const chatContainer = document.getElementById('live-chat-container');
        if (!chatContainer) return;

        // Create chat interface
        const chatHTML = `
            <div class="chat-header">
                <h4>💬 Live Chat</h4>
                <div class="chat-controls">
                    <button id="chat-toggle" class="btn-small">Hide Chat</button>
                    <button id="request-track" class="btn-small">🎵 Request Track</button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Type your message..." maxlength="200">
                <button id="send-message" class="btn-primary">Send</button>
            </div>
            <div class="track-requests" id="track-requests">
                <h5>🎵 Track Requests</h5>
                <div class="requests-list" id="requests-list"></div>
            </div>
        `;
        
        chatContainer.innerHTML = DOMPurify.sanitize(chatHTML);
        this.setupChatEventListeners();
        this.connectToChat(platform, streamData);
    }

    /**
     * Setup chat event listeners
     */
    setupChatEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const requestButton = document.getElementById('request-track');
        const chatToggle = document.getElementById('chat-toggle');

        // Send message on Enter or button click
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        
        sendButton?.addEventListener('click', () => this.sendChatMessage());
        
        // Track request functionality
        requestButton?.addEventListener('click', () => this.showTrackRequestModal());
        
        // Toggle chat visibility
        chatToggle?.addEventListener('click', () => this.toggleChat());
    }

    /**
     * Send chat message with moderation
     */
    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message || message.length > 200) return;
        
        // Basic moderation
        if (this.moderateMessage(message)) {
            this.addChatMessage({
                username: 'You',
                message: message,
                timestamp: new Date(),
                isOwn: true
            });
            
            // Send to platform-specific chat API
            this.sendToPlatformChat(message);
            input.value = '';
        } else {
            this.showError('Message contains inappropriate content');
        }
    }

    /**
     * Basic message moderation
     */
    moderateMessage(message) {
        const bannedWords = ['spam', 'hate', 'inappropriate']; // Extend as needed
        const lowerMessage = message.toLowerCase();
        
        return !bannedWords.some(word => lowerMessage.includes(word));
    }

    /**
     * Add message to chat display
     */
    addChatMessage(messageData) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageData.isOwn ? 'own-message' : ''}`;
        
        const timestamp = messageData.timestamp.toLocaleTimeString('en-EU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = DOMPurify.sanitize(`
            <div class="message-header">
                <span class="username">${this.escapeHtml(messageData.username)}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-content">${this.escapeHtml(messageData.message)}</div>
        `);
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Remove old messages to prevent memory issues
        if (messagesContainer.children.length > 100) {
            messagesContainer.removeChild(messagesContainer.firstChild);
        }
    }

    /**
     * Show track request modal
     */
    showTrackRequestModal() {
        const modal = document.createElement('div');
        modal.className = 'modal track-request-modal';
        modal.innerHTML = DOMPurify.sanitize(`
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎵 Request a Track</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <input type="text" id="track-artist" placeholder="Artist name" required>
                    <input type="text" id="track-title" placeholder="Track title" required>
                    <select id="track-genre">
                        <option value="">Select genre</option>
                        <option value="house">House</option>
                        <option value="techno">Techno</option>
                        <option value="techno-house">Techno House</option>
                        <option value="hard-techno">Hard Techno</option>
                        <option value="raw-techno">Raw Techno</option>
                        <option value="rawstyle">Rawstyle</option>
                        <option value="hardcore">Hardcore</option>
                        <option value="uptempo">Uptempo</option>
                        <option value="edm">EDM</option>
                    </select>
                    <textarea id="request-message" placeholder="Optional message to the DJ" maxlength="100"></textarea>
                </div>
                <div class="modal-footer">
                    <button id="submit-request" class="btn-primary">Submit Request</button>
                    <button id="cancel-request" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
        
        // Event listeners for modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#cancel-request').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#submit-request').addEventListener('click', () => {
            this.submitTrackRequest(modal);
        });
    }

    /**
     * Submit track request
     */
    submitTrackRequest(modal) {
        const artist = modal.querySelector('#track-artist').value.trim();
        const title = modal.querySelector('#track-title').value.trim();
        const genre = modal.querySelector('#track-genre').value;
        const message = modal.querySelector('#request-message').value.trim();
        
        if (!artist || !title) {
            this.showError('Please fill in artist and track title');
            return;
        }
        
        const request = {
            artist,
            title,
            genre,
            message,
            timestamp: new Date(),
            votes: 0
        };
        
        this.addTrackRequest(request);
        document.body.removeChild(modal);
        this.showNotification('Track request submitted! 🎵');
    }

    /**
     * Add track request to the list
     */
    addTrackRequest(request) {
        const requestsList = document.getElementById('requests-list');
        if (!requestsList) return;

        const requestElement = document.createElement('div');
        requestElement.className = 'track-request';
        requestElement.innerHTML = DOMPurify.sanitize(`
            <div class="request-info">
                <strong>${this.escapeHtml(request.artist)} - ${this.escapeHtml(request.title)}</strong>
                ${request.genre ? `<span class="genre-tag">${this.escapeHtml(request.genre)}</span>` : ''}
                ${request.message ? `<p class="request-message">${this.escapeHtml(request.message)}</p>` : ''}
            </div>
            <div class="request-actions">
                <button class="vote-btn" data-request-id="${Date.now()}">
                    👍 <span class="vote-count">${request.votes}</span>
                </button>
            </div>
        `);
        
        requestsList.appendChild(requestElement);
        
        // Add vote functionality
        requestElement.querySelector('.vote-btn').addEventListener('click', (e) => {
            const voteCount = e.target.querySelector('.vote-count');
            voteCount.textContent = parseInt(voteCount.textContent) + 1;
            e.target.disabled = true;
            e.target.textContent = '✅ Voted';
        });
    }

    /**
     * Start monitoring stream status
     */
    startStreamMonitoring() {
        this.isLive = true;
        
        // Update viewer count every 30 seconds
        this.viewerInterval = setInterval(() => {
            this.updateViewerCount();
        }, 30000);
        
        // Update BPM display every 5 seconds (mock data for now)
        this.bpmInterval = setInterval(() => {
            this.updateBPMDisplay();
        }, 5000);
        
        // Check stream status every minute
        this.statusInterval = setInterval(() => {
            this.checkStreamStatus();
        }, 60000);
    }

    /**
     * Update viewer count (mock implementation)
     */
    updateViewerCount() {
        // In real implementation, this would fetch from platform APIs
        this.viewers = Math.floor(Math.random() * 500) + 50;
        const viewerElement = document.getElementById('viewer-count');
        if (viewerElement) {
            viewerElement.textContent = `${this.viewers} viewers`;
        }
    }

    /**
     * Update BPM display (mock implementation)
     */
    updateBPMDisplay() {
        // In real implementation, this would use audio analysis
        const genres = ['house', 'techno', 'hardcore', 'rawstyle'];
        const bpmRanges = {
            house: [120, 130],
            techno: [130, 150],
            hardcore: [160, 200],
            rawstyle: [150, 180]
        };
        
        const currentGenre = this.currentStream?.genre?.toLowerCase() || 'techno';
        const range = bpmRanges[currentGenre] || [120, 150];
        const bpm = Math.floor(Math.random() * (range[1] - range[0])) + range[0];
        
        const bpmElement = document.getElementById('bpm-display');
        if (bpmElement) {
            bpmElement.textContent = `${bpm} BPM`;
        }
    }

    /**
     * Load stream schedule from API
     */
    async loadStreamSchedule() {
        try {
            // Mock schedule data - replace with actual API call
            const schedule = [
                {
                    id: 'stream1',
                    title: 'Friday Night Techno Session',
                    startTime: '2024-01-19T20:00:00Z',
                    duration: 120,
                    genre: 'Techno',
                    platform: 'twitch'
                },
                {
                    id: 'stream2',
                    title: 'Weekend Rawstyle Madness',
                    startTime: '2024-01-20T21:00:00Z',
                    duration: 90,
                    genre: 'Rawstyle',
                    platform: 'youtube'
                },
                {
                    id: 'stream3',
                    title: 'TikTok Hardcore Vibes',
                    startTime: '2024-01-21T19:30:00Z',
                    duration: 60,
                    genre: 'Hardcore',
                    platform: 'tiktok'
                }
            ];
            
            this.displaySchedule(schedule);
        } catch (error) {
            console.error('Failed to load stream schedule:', error);
        }
    }

    /**
     * Display stream schedule
     */
    displaySchedule(schedule) {
        const scheduleContainer = document.getElementById('stream-schedule');
        if (!scheduleContainer) return;

        const scheduleHTML = schedule.map(stream => {
            const startTime = new Date(stream.startTime);
            const isUpcoming = startTime > new Date();
            
            return `
                <div class="schedule-item ${isUpcoming ? 'upcoming' : 'past'}">
                    <div class="schedule-time">
                        ${startTime.toLocaleDateString('en-EU')} 
                        ${startTime.toLocaleTimeString('en-EU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div class="schedule-info">
                        <h4>${this.escapeHtml(stream.title)}</h4>
                        <p>Genre: ${this.escapeHtml(stream.genre)} | Duration: ${stream.duration} min</p>
                        <span class="platform-tag">${this.escapeHtml(stream.platform)}</span>
                    </div>
                    ${isUpcoming ? `
                        <button class="btn-small notify-btn" data-stream-id="${stream.id}">
                            🔔 Notify Me
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        scheduleContainer.innerHTML = DOMPurify.sanitize(scheduleHTML);
        
        // Add notification listeners
        scheduleContainer.querySelectorAll('.notify-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const streamId = e.target.dataset.streamId;
                this.scheduleNotification(streamId);
                e.target.textContent = '✅ Notified';
                e.target.disabled = true;
            });
        });
    }

    /**
     * Schedule notification for upcoming stream
     */
    scheduleNotification(streamId) {
        if ('Notification' in window && Notification.permission === 'granted') {
            // Schedule notification logic here
            this.showNotification('You\'ll be notified before the stream starts! 🔔');
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.scheduleNotification(streamId);
                }
            });
        }
    }

    /**
     * Utility functions
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Listen for stream events
        document.addEventListener('streamStart', (e) => {
            this.initializeStream(e.detail.platform, e.detail.streamData);
        });
        
        document.addEventListener('streamEnd', () => {
            this.endStream();
        });
    }

    /**
     * End current stream
     */
    endStream() {
        this.isLive = false;
        
        // Clear intervals
        if (this.viewerInterval) clearInterval(this.viewerInterval);
        if (this.bpmInterval) clearInterval(this.bpmInterval);
        if (this.statusInterval) clearInterval(this.statusInterval);
        
        // Update UI
        const liveIndicator = document.querySelector('.live-indicator');
        if (liveIndicator) {
            liveIndicator.textContent = '⚫ OFFLINE';
            liveIndicator.className = 'offline-indicator';
        }
        
        this.showNotification('Stream ended. Thanks for watching! 🎵');
    }

    /**
     * Toggle chat visibility
     */
    toggleChat() {
        const chatContainer = document.getElementById('live-chat-container');
        const toggleBtn = document.getElementById('chat-toggle');
        
        if (chatContainer && toggleBtn) {
            const isHidden = chatContainer.style.display === 'none';
            chatContainer.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Hide Chat' : 'Show Chat';
        }
    }

    /**
     * Check stream status
     */
    async checkStreamStatus() {
        // Implementation would check if stream is still live
        // For now, just a placeholder
        if (this.isLive && Math.random() < 0.1) {
            // 10% chance to simulate stream ending
            this.endStream();
        }
    }

    /**
     * Connect to platform-specific chat
     */
    connectToChat(platform, streamData) {
        // Platform-specific chat connection logic
        // This would integrate with actual chat APIs
        console.log(`Connecting to ${platform} chat for stream ${streamData.id}`);
        
        // Simulate incoming messages for demo
        this.simulateChatMessages();
    }

    /**
     * Simulate chat messages for demo purposes
     */
    simulateChatMessages() {
        const demoMessages = [
            { username: 'TechnoFan92', message: 'This beat is insane! 🔥' },
            { username: 'RaveQueen', message: 'Can you play some harder stuff?' },
            { username: 'BassLover', message: 'The drop was perfect!' },
            { username: 'DJ_Apprentice', message: 'What equipment are you using?' },
            { username: 'PartyAnimal', message: 'Greetings from Berlin! 🇩🇪' },
            { username: 'TikTokDancer', message: 'Love this track! 💃' },
            { username: 'HardcoreFan', message: 'More BPM please! ⚡' },
            { username: 'EDMVibes', message: 'This is fire! 🔥🔥🔥' }
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (!this.isLive || messageIndex >= demoMessages.length) {
                clearInterval(messageInterval);
                return;
            }
            
            this.addChatMessage({
                ...demoMessages[messageIndex],
                timestamp: new Date(),
                isOwn: false
            });
            
            messageIndex++;
        }, 10000); // New message every 10 seconds
    }

    /**
     * Send message to platform chat (placeholder)
     */
    sendToPlatformChat(message) {
        // This would integrate with platform-specific chat APIs
        console.log(`Sending message to ${this.currentStream?.platform}: ${message}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.liveStreamManager = new LiveStreamManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiveStreamManager;
}
