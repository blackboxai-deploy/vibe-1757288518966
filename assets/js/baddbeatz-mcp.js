/**
 * BaddBeatz MCP Integration
 * AI-powered features for the DJ website
 */

class BaddBeatzMCP {
    constructor() {
        this.apiEndpoint = '/api/ask'; // Using existing Cloudflare Worker endpoint
        this.isInitialized = false;
        this.chatHistory = [];
        this.init();
    }

    async init() {
        console.log('🎵 Initializing BaddBeatz MCP...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createAIChatWidget();
        this.setupMusicRecommendations();
        this.setupSmartBooking();
        this.setupEventSuggestions();
        this.isInitialized = true;
        console.log('✅ BaddBeatz MCP initialized successfully!');
    }

    // AI Chat Widget
    createAIChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.id = 'baddbeatz-ai-chat';
        chatWidget.className = 'ai-chat-widget collapsed';
        chatWidget.innerHTML = `
            <div class="chat-toggle" onclick="baddBeatzMCP.toggleChat()">
                <span class="chat-icon">🎵</span>
                <span class="chat-text">Ask BaddBeatz AI</span>
            </div>
            <div class="chat-container">
                <div class="chat-header">
                    <h3>🎵 BaddBeatz AI Assistant</h3>
                    <button class="chat-close" onclick="baddBeatzMCP.toggleChat()">×</button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="message ai">
                        <div class="message-content">
                            Hey! I'm your AI DJ assistant. Ask me about:
                            <br>• Music recommendations
                            <br>• Booking information  
                            <br>• Event details
                            <br>• Technical questions
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Ask about music, bookings, events..." 
                           onkeypress="if(event.key==='Enter') baddBeatzMCP.sendMessage()">
                    <button onclick="baddBeatzMCP.sendMessage()" class="send-btn">🚀</button>
                </div>
                <div class="quick-actions">
                    <button onclick="baddBeatzMCP.quickQuestion('Recommend some hardstyle tracks')" class="quick-btn">
                        🎵 Music Recs
                    </button>
                    <button onclick="baddBeatzMCP.quickQuestion('How do I book a DJ set?')" class="quick-btn">
                        📅 Booking Info
                    </button>
                    <button onclick="baddBeatzMCP.quickQuestion('What genres do you play?')" class="quick-btn">
                        🎧 Genres
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);
    }

    toggleChat() {
        const widget = document.getElementById('baddbeatz-ai-chat');
        widget.classList.toggle('collapsed');
    }

    async quickQuestion(question) {
        const input = document.getElementById('chat-input');
        input.value = question;
        await this.sendMessage();
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        
        if (!input.value.trim()) return;

        const userMessage = input.value.trim();
        
        // Add user message
        this.addMessage(messages, userMessage, 'user');
        
        // Show typing indicator
        const typingId = this.addTypingIndicator(messages);
        
        // Clear input
        input.value = '';

        try {
            // Get AI response
            const response = await this.getAIResponse(userMessage);
            
            // Remove typing indicator
            this.removeTypingIndicator(typingId);
            
            // Add AI response
            this.addMessage(messages, response.answer || response.error, 'ai');
            
            // Store in chat history
            this.chatHistory.push({
                user: userMessage,
                ai: response.answer || response.error,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.removeTypingIndicator(typingId);
            this.addMessage(messages, 'Sorry, I\'m having trouble connecting right now. Please try again!', 'ai error');
        }
    }

    async getAIResponse(question) {
        // Enhance the question with BaddBeatz context
        const contextualQuestion = this.addBaddBeatzContext(question);
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: contextualQuestion
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the actual answer from OpenAI response
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return { answer: data.choices[0].message.content };
        }
        
        return data;
    }

    addBaddBeatzContext(question) {
        const context = `
        You are an AI assistant for BaddBeatz, a DJ website featuring TheBadGuyHimself.
        
        About BaddBeatz:
        - Specializes in electronic music: techno, hardstyle, house, trance
        - Offers DJ services for events, parties, and live streaming
        - Features original mixes and curated playlists
        - Based in Europe with international reach
        - Known for high-energy underground electronic music
        - Offers booking services for events and private parties
        
        Website features:
        - Music streaming and downloads
        - Live streaming events
        - Booking system for DJ services
        - Gallery of past performances
        - Contact information for bookings
        
        Answer as a knowledgeable DJ assistant who understands electronic music culture.
        Be enthusiastic, helpful, and professional. Keep responses concise but informative.
        
        User question: ${question}
        `;
        
        return context;
    }

    addMessage(container, message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    addTypingIndicator(container) {
        const typingDiv = document.createElement('div');
        const typingId = 'typing-' + Date.now();
        typingDiv.id = typingId;
        typingDiv.className = 'message ai typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
        return typingId;
    }

    removeTypingIndicator(typingId) {
        const typingElement = document.getElementById(typingId);
        if (typingElement) {
            typingElement.remove();
        }
    }

    formatMessage(message) {
        // Basic formatting for better readability
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/- (.*?)(?=\n|$)/g, '• $1');
    }

    // Music Recommendations Feature
    setupMusicRecommendations() {
        const musicSection = document.querySelector('#music, .music-section, [data-section="music"]');
        if (musicSection) {
            const recButton = document.createElement('button');
            recButton.className = 'mcp-recommendation-btn';
            recButton.innerHTML = '🎵 Get AI Recommendations';
            recButton.onclick = () => this.showMusicRecommendations();
            
            musicSection.appendChild(recButton);
        }
    }

    async showMusicRecommendations() {
        const genres = ['techno', 'hardstyle', 'house', 'trance'];
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        
        const question = `Recommend 5 great ${randomGenre} tracks that would fit BaddBeatz style. Include artist names and brief descriptions.`;
        
        try {
            const response = await this.getAIResponse(question);
            this.displayRecommendations(response.answer);
        } catch (error) {
            console.error('Recommendation error:', error);
        }
    }

    displayRecommendations(recommendations) {
        const modal = document.createElement('div');
        modal.className = 'mcp-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎵 AI Music Recommendations</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.formatMessage(recommendations)}
                </div>
                <div class="modal-footer">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-primary">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Smart Booking Feature
    setupSmartBooking() {
        const bookingSection = document.querySelector('#bookings, .booking-section, [data-section="bookings"]');
        if (bookingSection) {
            const smartBtn = document.createElement('button');
            smartBtn.className = 'mcp-smart-booking-btn';
            smartBtn.innerHTML = '🤖 Smart Booking Assistant';
            smartBtn.onclick = () => this.openSmartBooking();
            
            bookingSection.appendChild(smartBtn);
        }
    }

    openSmartBooking() {
        // Open chat and ask booking question
        const widget = document.getElementById('baddbeatz-ai-chat');
        widget.classList.remove('collapsed');
        
        setTimeout(() => {
            this.quickQuestion('I want to book BaddBeatz for an event. What information do you need?');
        }, 500);
    }

    // Event Suggestions Feature
    setupEventSuggestions() {
        const liveSection = document.querySelector('#live, .live-section, [data-section="live"]');
        if (liveSection) {
            const eventBtn = document.createElement('button');
            eventBtn.className = 'mcp-event-btn';
            eventBtn.innerHTML = '🎉 Suggest Events';
            eventBtn.onclick = () => this.suggestEvents();
            
            liveSection.appendChild(eventBtn);
        }
    }

    async suggestEvents() {
        const question = 'What are some popular electronic music events and festivals that BaddBeatz fans might enjoy?';
        
        try {
            const response = await this.getAIResponse(question);
            this.displayEventSuggestions(response.answer);
        } catch (error) {
            console.error('Event suggestion error:', error);
        }
    }

    displayEventSuggestions(suggestions) {
        const modal = document.createElement('div');
        modal.className = 'mcp-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎉 Event Suggestions</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.formatMessage(suggestions)}
                </div>
                <div class="modal-footer">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-primary">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Analytics and Insights
    trackInteraction(type, data) {
        // Track MCP interactions for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mcp_interaction', {
                'interaction_type': type,
                'data': JSON.stringify(data)
            });
        }
        
        console.log('MCP Interaction:', type, data);
    }

    // Public API for external use
    async ask(question, context = 'general') {
        return await this.getAIResponse(question);
    }

    getChatHistory() {
        return this.chatHistory;
    }

    clearChatHistory() {
        this.chatHistory = [];
        const messages = document.getElementById('chat-messages');
        if (messages) {
            messages.innerHTML = `
                <div class="message ai">
                    <div class="message-content">
                        Chat history cleared! How can I help you today?
                    </div>
                </div>
            `;
        }
    }
}

// Initialize BaddBeatz MCP
window.baddBeatzMCP = new BaddBeatzMCP();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaddBeatzMCP;
}
