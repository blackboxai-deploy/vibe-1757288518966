 // SECURITY: Consider using DOMPurify for sanitization
// import DOMPurify from 'dompurify';

// Graceful sanitize helper if DOMPurify is available on window
const ytSanitize = (html) => (window.DOMPurify ? window.DOMPurify.sanitize(html) : html);

async function loadYoutubeVideos() {
  const list = document.getElementById('youtubeVideos');
  if (!list) return;
  
  // Show loading state
  if (window.AppUtils && window.AppUtils.showLoading) {
    window.AppUtils.showLoading(list);
  }
  list.innerHTML = ytSanitize(`<li class="loading-message">Loading latest videos...</li>`);
  
  try {
    const channelId = list.dataset.channelId || 'UCqHpI2_Z48G9CuDFYQpsc2Q';
    
    // Try server-side API first
    try {
      const res = await fetch(`/api/youtube?channel_id=${encodeURIComponent(channelId)}`);
      
      if (res.ok) {
        const data = await res.json();
        
        if (!data.error && data.videos && data.videos.length > 0) {
          displayYouTubeVideos(data.videos, list);
          return;
        }
      }
    } catch (serverError) {
      console.log('Server-side YouTube API not available, using fallback');
    }
    
    // Fallback: Display static video links for TheBadGuyHimself channel
    const fallbackVideos = [
      {
        id: 'vfDLTqShdSE',
        title: '🔥 TheBadGuyHimself - Underground Techno Mix',
        description: 'High-energy underground techno and hardstyle performance',
        url: 'https://www.youtube.com/watch?v=vfDLTqShdSE'
      },
      {
        id: 'channel',
        title: '🎵 Latest Mixes & Performances',
        description: 'Check out all my latest content on YouTube',
        url: 'https://www.youtube.com/@TheBadGuyHimself/videos'
      },
      {
        id: 'subscribe',
        title: '🔔 Subscribe for New Content',
        description: 'Never miss a new mix or performance',
        url: 'https://www.youtube.com/@TheBadGuyHimself?sub_confirmation=1'
      }
    ];
    
    displayYouTubeVideos(fallbackVideos, list);
    console.log('Using fallback YouTube content for TheBadGuyHimself');
    
  } catch (err) {
    console.error('Error loading YouTube videos:', err);
    
    // Hide loading state
    if (window.AppUtils && window.AppUtils.hideLoading) {
      window.AppUtils.hideLoading(list);
    }
    
    // Create error message with direct channel link
    list.innerHTML = ytSanitize(`
      <li class="error-message">
        <div class="error-content">
          <p class="error-text">🎥 YouTube Content Available</p>
          <p class="error-description">Visit my channel directly for all the latest mixes!</p>
          <a href="https://www.youtube.com/@TheBadGuyHimself/videos" target="_blank" class="retry-btn" rel="noopener noreferrer">
            ▶️ Visit YouTube Channel
          </a>
        </div>
      </li>
    `);
  }
}

function displayYouTubeVideos(videos, list) {
  // Clear loading state
  if (window.AppUtils && window.AppUtils.hideLoading) {
    window.AppUtils.hideLoading(list);
  }
  list.textContent = '';
  
  if (videos.length === 0) {
    list.innerHTML = ytSanitize(`<li class="no-videos">No videos found. Check back later!</li>`);
    return;
  }
  
  videos.forEach(v => {
    const li = document.createElement('li');
    li.className = 'video-item';
    
    const a = document.createElement('a');
    a.href = v.url || `https://www.youtube.com/watch?v=${v.id}`;
    a.textContent = v.title || 'Untitled Video';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    
    // Add video description if available
    if (v.description) {
      const desc = document.createElement('p');
      desc.className = 'video-description';
      desc.textContent = v.description.substring(0, 100) + (v.description.length > 100 ? '...' : '');
      li.appendChild(a);
      li.appendChild(desc);
    } else {
      li.appendChild(a);
    }
    
    list.appendChild(li);
  });
  
  console.log(`Successfully loaded ${videos.length} YouTube videos`);
}

// Auto-retry mechanism with exponential backoff
let retryCount = 0;
const maxRetries = 3;

async function loadYoutubeVideosWithRetry() {
  try {
    await loadYoutubeVideos();
    retryCount = 0; // Reset on success
  } catch (err) {
    if (retryCount < maxRetries) {
      retryCount++;
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
      setTimeout(loadYoutubeVideosWithRetry, delay);
    } else {
      console.error('Max retries reached for YouTube videos');
      retryCount = 0;
    }
  }
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', () => {
  // Load videos with retry mechanism
  loadYoutubeVideosWithRetry();
  
  // Set up periodic refresh (every 30 minutes)
  setInterval(() => {
    console.log('Refreshing YouTube videos...');
    loadYoutubeVideosWithRetry();
  }, 30 * 60 * 1000);
});

// Add CSS styles for enhanced UI
const style = document.createElement('style');
style.textContent = `
  .loading-message {
    text-align: center;
    color: #00ffff;
    font-style: italic;
    padding: 1rem;
  }
  
  .no-videos {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 1rem;
  }
  
  .error-message {
    text-align: center;
    padding: 1rem;
  }
  
  .error-content {
    background: rgba(255, 0, 51, 0.1);
    border: 1px solid rgba(255, 0, 51, 0.3);
    border-radius: 8px;
    padding: 1rem;
  }
  
  .error-text {
    color: #ff6b6b;
    margin-bottom: 0.5rem;
  }
  
  .retry-btn {
    background: linear-gradient(45deg, #00ffff, #0099cc);
    color: #000;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .retry-btn:hover {
    background: linear-gradient(45deg, #0099cc, #00ffff);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
  }
  
  .video-item {
    transition: all 0.3s ease;
  }
  
  .video-item:hover {
    background: rgba(0, 255, 255, 0.05);
    border-radius: 8px;
  }
  
  .video-description {
    font-size: 0.9rem;
    color: #ccc;
    margin: 0.5rem 0 0 0;
    line-height: 1.4;
  }
`;
document.head.appendChild(style);
