// AI Chat Improved - Self-hosted chat widget with modern UI
// SECURITY: DOMPurify is loaded via CDN in HTML

(function() {
  'use strict';

  // Safe sanitize helper (graceful fallback if DOMPurify is not available)
  const sanitize = (html) => (window.DOMPurify ? window.DOMPurify.sanitize(html) : html);

  let retryCount = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds
  let isProcessing = false;

  // Initialize AI chat when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initAIChat();
  });

  function initAIChat() {
    const chatForm = document.getElementById('aiChatForm');
    const userInput = document.getElementById('userInput');
    const askButton = document.getElementById('askButton');
    const responseBox = document.getElementById('aiResponse');
    const premiumMessage = document.getElementById('premiumMessage');

    if (!userInput || !askButton || !responseBox || !premiumMessage) {
      console.warn('AI chat elements not found on this page');
      return;
    }

    // Create form if it doesn't exist
    if (!chatForm) {
      const form = document.createElement('form');
      form.id = 'aiChatForm';
      form.addEventListener('submit', handleAskSubmit);
      userInput.parentNode.insertBefore(form, userInput);
      form.appendChild(userInput);
      form.appendChild(askButton);
    } else {
      chatForm.addEventListener('submit', handleAskSubmit);
    }

    // Add click handler for ask button
    askButton.addEventListener('click', handleAskSubmit);

    // Add enter key handler for textarea
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAskSubmit(e);
      }
    });

    // Add input validation
    userInput.addEventListener('input', function() {
      const question = this.value.trim();
      askButton.disabled = !question || question.length > 1000 || isProcessing;
      updateCharacterCount(question.length);
    });

    // Check user authentication status
    checkUserStatus();
  }

  async function checkUserStatus() {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        showPremiumRequired();
        return;
      }

      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user status');
      }

      const userData = await response.json();

      const askButton = document.getElementById('askButton');
      const responseBox = document.getElementById('aiResponse');

      if (userData.is_premium) {
        // User is premium, enable chat
        askButton.disabled = false;
        askButton.textContent = 'Ask';
        responseBox.innerHTML = sanitize(`
          <div class="ai-welcome">
            <div class="welcome-header">
              <span class="ai-icon">🎵</span>
              <span class="ai-label">BaddBeatz AI Assistant</span>
            </div>
            <p>Welcome ${userData.username}! Ask me about:</p>
            <ul class="feature-list">
              <li>🎧 Music and mixes</li>
              <li>📅 Booking information</li>
              <li>🎪 Event details</li>
              <li>🎛️ Technical questions</li>
            </ul>
            <p class="tip">💡 I can answer in both English and Dutch!</p>
          </div>
        `);
      } else {
        // User is not premium
        showPremiumRequired();
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      showPremiumRequired();
    }
  }

  function showPremiumRequired() {
    const askButton = document.getElementById('askButton');
    const responseBox = document.getElementById('aiResponse');
    const premiumMessage = document.getElementById('premiumMessage');
    const userInput = document.getElementById('userInput');

    askButton.disabled = true;
    askButton.textContent = 'Premium Required';
    userInput.disabled = true;
    
    if (premiumMessage) {
      premiumMessage.style.display = 'block';
    }
    
    responseBox.innerHTML = sanitize(`
      <div class="premium-required">
        <div class="premium-header">
          <span class="premium-icon">⭐</span>
          <span class="premium-label">Premium Feature</span>
        </div>
        <p>This AI assistant is available for premium members only.</p>
        <div class="premium-actions">
          <a href="login.html" class="btn-premium">🎵 Join Premium</a>
          <a href="contact.html" class="btn-contact">📧 Contact Us</a>
        </div>
      </div>
    `);
  }

  function updateCharacterCount(count) {
    let counter = document.getElementById('charCounter');
    if (!counter) {
      counter = document.createElement('div');
      counter.id = 'charCounter';
      counter.className = 'char-counter';
      document.getElementById('userInput').parentNode.appendChild(counter);
    }
    
    counter.textContent = `${count}/1000`;
    counter.className = `char-counter ${count > 1000 ? 'over-limit' : ''}`;
  }

  async function handleAskSubmit(e) {
    e.preventDefault();
    
    if (isProcessing) return;
    
    const userInput = document.getElementById('userInput');
    const question = userInput.value.trim();
    
    if (!question) {
      showResponse('Please enter a question first.');
      return;
    }

    if (question.length > 1000) {
      showResponse('Question is too long. Please keep it under 1000 characters.');
      return;
    }

    await askDJWithRetry(question);
  }

  async function askDJWithRetry(question) {
    const askButton = document.getElementById('askButton');

    try {
      isProcessing = true;
      showLoading();
      askButton.disabled = true;

      await askDJ(question);
    } catch (error) {
      console.error('Error asking DJ:', error);
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = RETRY_DELAY * retryCount;
        
        showRetrying(retryCount, delay);
        
        setTimeout(() => {
          askDJWithRetry(question);
        }, delay);
      } else {
        showResponse('Sorry, I\'m having trouble connecting right now. Please try again later or contact us directly for assistance!');
        retryCount = 0;
      }
    } finally {
      isProcessing = false;
      askButton.disabled = false;
    }
  }

  async function askDJ(question) {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || data.error || 'No response received.';

    showResponse(aiResponse);
    retryCount = 0; // Reset retry count on success
  }

  function showLoading() {
    const responseBox = document.getElementById('aiResponse');
    responseBox.className = 'ai-response loading';
    responseBox.innerHTML = sanitize(`
      <div class="loading-container">
        <div class="loading-header">
          <span class="ai-icon">🎵</span>
          <span class="ai-label">BaddBeatz AI</span>
        </div>
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>Analyzing your question...</p>
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `);
  }

  function showRetrying(attempt, delay) {
    const responseBox = document.getElementById('aiResponse');
    responseBox.className = 'ai-response retrying';
    responseBox.innerHTML = sanitize(`
      <div class="retry-container">
        <div class="retry-header">
          <span class="ai-icon">🔄</span>
          <span class="retry-label">Reconnecting</span>
        </div>
        <div class="retry-content">
          <div class="loading-spinner"></div>
          <p>Connection issue detected. Retrying...</p>
          <div class="retry-info">
            <span class="retry-attempt">Attempt ${attempt} of ${MAX_RETRIES}</span>
            <span class="retry-delay">Next attempt in ${delay/1000}s</span>
          </div>
        </div>
      </div>
    `);
  }

  function showResponse(response) {
    const responseBox = document.getElementById('aiResponse');
    responseBox.className = 'ai-response success';
    
    // Format response with better typography
    const formattedResponse = response
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    responseBox.innerHTML = sanitize(`
      <div class="response-content">
        <div class="response-header">
          <span class="ai-icon">🎵</span>
          <span class="ai-label">BaddBeatz AI</span>
          <span class="response-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="response-text">
          <p>${formattedResponse}</p>
        </div>
        <div class="response-footer">
          <button class="btn-feedback" onclick="provideFeedback('helpful')">👍 Helpful</button>
          <button class="btn-feedback" onclick="provideFeedback('not-helpful')">👎 Not helpful</button>
          <button class="btn-copy" onclick="copyResponse('${response.replace(/'/g, "\\'")}')">📋 Copy</button>
        </div>
      </div>
    `);
    
    // Clear the input
    const userInput = document.getElementById('userInput');
    if (userInput) {
      userInput.value = '';
      updateCharacterCount(0);
    }
  }

  function provideFeedback(type) {
    console.log(`User feedback: ${type}`);
    // You could send this to an analytics endpoint
    const feedbackButtons = document.querySelectorAll('.btn-feedback');
    feedbackButtons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
    });
    
    // Show thank you message
    const footer = document.querySelector('.response-footer');
    if (footer) {
      const thanksSpan = document.createElement('span');
      thanksSpan.className = 'feedback-thanks';
      thanksSpan.textContent = 'Thanks for your feedback! 🙏';
      footer.appendChild(thanksSpan);
    }
  }

  function copyResponse(text) {
    navigator.clipboard.writeText(text).then(() => {
      const copyBtn = document.querySelector('.btn-copy');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    }).catch(() => {
      const copyBtn = document.querySelector('.btn-copy');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '❌ Failed';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  // Quick question helpers for common queries
  function askQuickQuestion(question) {
    const userInput = document.getElementById('userInput');
    if (userInput) {
      userInput.value = question;
      handleAskSubmit(new Event('submit'));
    }
  }

  // Add enhanced CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .ai-response {
      min-height: 60px;
      padding: 1.5rem;
      border-radius: 16px;
      margin-top: 1rem;
      position: relative;
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    
    .ai-response.loading {
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05));
      border: 1px solid rgba(0, 255, 255, 0.3);
    }
    
    .ai-response.success {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(26, 26, 26, 0.9));
      border: 1px solid rgba(255, 0, 51, 0.3);
      color: #fff;
    }
    
    .ai-response.retrying {
      background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05));
      border: 1px solid rgba(255, 165, 0, 0.3);
    }

    .ai-welcome {
      text-align: center;
      padding: 1rem;
    }

    .welcome-header, .premium-header, .loading-header, .retry-header, .response-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .ai-icon, .premium-icon {
      font-size: 1.2rem;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .feature-list li {
      padding: 0.5rem 0;
      font-size: 0.95rem;
    }

    .tip {
      font-style: italic;
      color: #00ffff;
      font-size: 0.9rem;
    }

    .premium-required {
      text-align: center;
      padding: 1rem;
    }

    .premium-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .btn-premium, .btn-contact {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-premium {
      background: linear-gradient(45deg, #ff0033, #ff3366);
      color: #fff;
    }

    .btn-contact {
      background: linear-gradient(45deg, #00ffff, #0099cc);
      color: #000;
    }

    .btn-premium:hover, .btn-contact:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 0, 51, 0.4);
    }

    .loading-container, .retry-container {
      text-align: center;
    }

    .loading-content, .retry-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(0, 255, 255, 0.2);
      border-top: 3px solid #00ffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-dots {
      display: flex;
      gap: 0.5rem;
    }

    .loading-dots span {
      width: 8px;
      height: 8px;
      background: #00ffff;
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

    .retry-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: #ffa500;
    }

    .response-content {
      position: relative;
    }

    .response-header {
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 0, 51, 0.2);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .response-time {
      font-size: 0.8rem;
      color: #999;
    }

    .response-text {
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .response-text p {
      margin: 0 0 1rem 0;
    }

    .response-footer {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-feedback, .btn-copy {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: #00ffff;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-feedback:hover, .btn-copy:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .feedback-thanks {
      color: #00ff88;
      font-size: 0.9rem;
      font-style: italic;
    }

    .char-counter {
      font-size: 0.8rem;
      color: #999;
      text-align: right;
      margin-top: 0.5rem;
    }

    .char-counter.over-limit {
      color: #ff0033;
      font-weight: bold;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    #userInput:focus {
      outline: none;
      border-color: #00ffff;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    #askButton:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  // Export functions for global access
  window.askQuickQuestion = askQuickQuestion;
  window.provideFeedback = provideFeedback;
  window.copyResponse = copyResponse;

  // Backward compatibility
  window.askDJ = function() {
    const event = new Event('submit');
    handleAskSubmit(event);
  };

})();
