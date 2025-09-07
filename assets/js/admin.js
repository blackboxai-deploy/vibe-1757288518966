// SECURITY: Consider using DOMPurify for sanitization
// import DOMPurify from 'dompurify';

// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize real-time updates
    startRealTimeUpdates();
    
    // Initialize tooltips and interactions
    initializeInteractions();
    
    console.log('Admin panel initialized successfully');
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked nav tab
    const activeTab = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Load section-specific data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'users':
            loadUserData();
            break;
        case 'music':
            loadMusicData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'moderation':
            loadModerationData();
            break;
    }
}

// Dashboard Functions
function updateDashboardStats() {
    // Simulate real-time stat updates
    const stats = {
        users: Math.floor(Math.random() * 100) + 1200,
        tracks: Math.floor(Math.random() * 200) + 3800,
        plays: Math.floor(Math.random() * 10000) + 150000,
        revenue: Math.floor(Math.random() * 5000) + 10000
    };
    
    // Update stat numbers with animation
    animateStatUpdate('.stat-number', stats);
}

function animateStatUpdate(selector, stats) {
    const statElements = document.querySelectorAll(selector);
    const values = Object.values(stats);
    
    statElements.forEach((element, index) => {
        if (values[index]) {
            const finalValue = values[index];
            const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, ''));
            
            animateNumber(element, currentValue, finalValue, 1000);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (difference * progress));
        
        if (element.textContent.includes('$')) {
            element.textContent = `$${current.toLocaleString()}`;
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// User Management Functions
function loadUserData() {
    console.log('Loading user data...');
    // Simulate loading user data
    showNotification('User data loaded successfully', 'success');
}

function viewUser(userId) {
    showModal('User Details', `
        <div class="user-details">
            <h3>User ID: ${userId}</h3>
            <p><strong>Name:</strong> DJ_Nexus</p>
            <p><strong>Email:</strong> dj.nexus@email.com</p>
            <p><strong>Join Date:</strong> 2024-01-15</p>
            <p><strong>Total Tracks:</strong> 23</p>
            <p><strong>Total Plays:</strong> 15,847</p>
            <p><strong>Status:</strong> Active</p>
        </div>
    `);
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        console.log(`Suspending user ${userId}`);
        showNotification(`User ${userId} has been suspended`, 'warning');
        
        // Update UI
        const row = document.querySelector(`[onclick="suspendUser('${userId}')"]`).closest('tr');
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = 'Suspended';
        statusBadge.className = 'status-badge suspended';
        
        // Update button
        const suspendBtn = row.querySelector(`[onclick="suspendUser('${userId}')"]`);
        suspendBtn.textContent = 'Activate';
        suspendBtn.className = 'btn-small success';
        suspendBtn.setAttribute('onclick', `activateUser('${userId}')`);
    }
}

function activateUser(userId) {
    if (confirm('Are you sure you want to activate this user?')) {
        console.log(`Activating user ${userId}`);
        showNotification(`User ${userId} has been activated`, 'success');
        
        // Update UI
        const row = document.querySelector(`[onclick="activateUser('${userId}')"]`).closest('tr');
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = 'Active';
        statusBadge.className = 'status-badge active';
        
        // Update button
        const activateBtn = row.querySelector(`[onclick="activateUser('${userId}')"]`);
        activateBtn.textContent = 'Suspend';
        activateBtn.className = 'btn-small warning';
        activateBtn.setAttribute('onclick', `suspendUser('${userId}')`);
    }
}

function exportUsers() {
    showNotification('Exporting user data...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification('User data exported successfully', 'success');
        
        // Create and download a sample CSV
        const csvContent = "data:text/csv;charset=utf-8,Name,Email,Join Date,Tracks,Status\nDJ_Nexus,dj.nexus@email.com,2024-01-15,23,Active\nBeatMaster,beatmaster@email.com,2024-01-10,45,Active\nSynthWave_Pro,synthwave@email.com,2024-01-05,67,Suspended";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "baddbeatz_users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 2000);
}

// Music Management Functions
function loadMusicData() {
    console.log('Loading music data...');
    showNotification('Music data loaded successfully', 'success');
}

function featureTrack(trackId) {
    console.log(`Featuring track ${trackId}`);
    showNotification(`Track ${trackId} has been featured`, 'success');
    
    // Add visual indicator
    const musicCard = document.querySelector(`[onclick="featureTrack('${trackId}')"]`).closest('.music-card');
    musicCard.style.border = '2px solid #ffaa00';
    
    const featuredBadge = document.createElement('span');
    featuredBadge.className = 'featured-badge';
    featuredBadge.textContent = 'FEATURED';
    musicCard.querySelector('.music-info').insertBefore(featuredBadge, musicCard.querySelector('.music-info').firstChild);
}

function removeTrack(trackId) {
    if (confirm('Are you sure you want to remove this track?')) {
        console.log(`Removing track ${trackId}`);
        showNotification(`Track ${trackId} has been removed`, 'warning');
        
        // Remove from UI with animation
        const musicCard = document.querySelector(`[onclick="removeTrack('${trackId}')"]`).closest('.music-card');
        musicCard.style.opacity = '0';
        musicCard.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            musicCard.remove();
        }, 300);
    }
}

// Analytics Functions
function loadAnalyticsData() {
    console.log('Loading analytics data...');
    showNotification('Analytics data loaded successfully', 'success');
}

function exportAnalytics() {
    showNotification('Exporting analytics report...', 'info');
    
    setTimeout(() => {
        showNotification('Analytics report exported successfully', 'success');
        
        // Create sample analytics report
        const reportContent = `BaddBeatz Analytics Report
Generated: ${new Date().toLocaleDateString()}

Platform Statistics:
- Total Users: 1,247
- Total Tracks: 3,891
- Total Plays: 156,432
- Revenue: $12,847

Top Genres:
1. Electronic (85%)
2. House (72%)
3. Techno (68%)
4. Dubstep (45%)

Top Tracks:
1. Bass Drop - 2,156 plays
2. Cyber Dreams - 1,247 plays
3. Neon Nights - 892 plays`;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'baddbeatz_analytics_report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 2000);
}

// Settings Functions
function saveSettings() {
    showNotification('Saving settings...', 'info');
    
    // Collect all settings
    const settings = {
        platformName: document.querySelector('input[value="BaddBeatz"]').value,
        maxUploadSize: document.querySelector('input[value="50"]').value,
        allowRegistration: document.querySelector('input[type="checkbox"]').checked
    };
    
    console.log('Settings to save:', settings);
    
    setTimeout(() => {
        showNotification('Settings saved successfully', 'success');
    }, 1000);
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        showNotification('Resetting settings to default...', 'info');
        
        setTimeout(() => {
            // Reset form values
            document.querySelector('input[value="BaddBeatz"]').value = 'BaddBeatz';
            document.querySelector('input[value="50"]').value = '50';
            
            // Reset checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                checkbox.checked = index < 3; // First 3 checked by default
            });
            
            showNotification('Settings reset to default', 'success');
        }, 1000);
    }
}

// Moderation Functions
function loadModerationData() {
    console.log('Loading moderation data...');
    showNotification('Moderation data loaded successfully', 'success');
}

function reviewContent(contentId) {
    showModal('Content Review', `
        <div class="content-review">
            <h3>Content ID: ${contentId}</h3>
            <p><strong>Type:</strong> Music Track</p>
            <p><strong>Title:</strong> "Dark Beats"</p>
            <p><strong>Artist:</strong> UnknownArtist</p>
            <p><strong>Reported by:</strong> DJ_Nexus</p>
            <p><strong>Reason:</strong> Copyright infringement</p>
            <p><strong>Date:</strong> 2024-01-20</p>
            
            <div class="review-actions" style="margin-top: 1rem;">
                <button class="btn-small success" onclick="approveContent('${contentId}'); closeModal();">Approve</button>
                <button class="btn-small danger" onclick="removeContent('${contentId}'); closeModal();">Remove</button>
                <button class="btn-small" onclick="closeModal();">Close</button>
            </div>
        </div>
    `);
}

function approveContent(contentId) {
    console.log(`Approving content ${contentId}`);
    showNotification(`Content ${contentId} has been approved`, 'success');
    
    // Update status in table
    updateContentStatus(contentId, 'approved');
}

function removeContent(contentId) {
    console.log(`Removing content ${contentId}`);
    showNotification(`Content ${contentId} has been removed`, 'warning');
    
    // Update status in table
    updateContentStatus(contentId, 'removed');
}

function updateContentStatus(contentId, status) {
    const row = document.querySelector(`[onclick="reviewContent('${contentId}')"]`).closest('tr');
    const statusBadge = row.querySelector('.status-badge');
    
    if (status === 'approved') {
        statusBadge.textContent = 'Approved';
        statusBadge.className = 'status-badge active';
    } else if (status === 'removed') {
        row.style.opacity = '0.5';
        statusBadge.textContent = 'Removed';
        statusBadge.className = 'status-badge suspended';
    }
}

// Search Functionality
function initializeSearch() {
    const userSearch = document.getElementById('userSearch');
    const musicSearch = document.getElementById('musicSearch');
    
    if (userSearch) {
        userSearch.addEventListener('input', function(e) {
            filterTable('users-table', e.target.value);
        });
    }
    
    if (musicSearch) {
        musicSearch.addEventListener('input', function(e) {
            filterMusicGrid(e.target.value);
        });
    }
}

function filterTable(tableClass, searchTerm) {
    const table = document.querySelector(`.${tableClass} table`);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(searchTerm.toLowerCase());
        row.style.display = matches ? '' : 'none';
    });
}

function filterMusicGrid(searchTerm) {
    const musicCards = document.querySelectorAll('.music-card');
    
    musicCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(searchTerm.toLowerCase());
        card.style.display = matches ? '' : 'none';
    });
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update dashboard stats every 30 seconds
    setInterval(() => {
        if (document.getElementById('dashboard').classList.contains('active')) {
            updateDashboardStats();
        }
    }, 30000);
    
    // Update activity feed every 60 seconds
    setInterval(() => {
        updateActivityFeed();
    }, 60000);
}

function updateActivityFeed() {
    const activities = [
        { icon: 'fas fa-user-plus', text: 'New user registered: CyberDJ_2024', time: 'Just now' },
        { icon: 'fas fa-upload', text: 'Track uploaded: "Future Bass" by ElectroMaster', time: '2 minutes ago' },
        { icon: 'fas fa-heart', text: 'Track liked: "Neon Dreams" by SynthWave_Pro', time: '5 minutes ago' },
        { icon: 'fas fa-comment', text: 'New comment on "Bass Drop"', time: '8 minutes ago' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList && Math.random() > 0.7) { // 30% chance to add new activity
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const icon = document.createElement('i');
        icon.className = randomActivity.icon;
        
        const span = document.createElement('span');
        span.textContent = randomActivity.text;
        
        const time = document.createElement('time');
        time.textContent = randomActivity.time;
        
        activityItem.appendChild(icon);
        activityItem.appendChild(span);
        activityItem.appendChild(time);
        
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Remove oldest activity if more than 5
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
        
        // Animate new activity
        activityItem.style.opacity = '0';
        activityItem.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            activityItem.style.transition = 'all 0.3s ease';
            activityItem.style.opacity = '1';
            activityItem.style.transform = 'translateX(0)';
        }, 100);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${getNotificationIcon(type)}`;
    
    const span = document.createElement('span');
    span.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';
    closeButton.appendChild(closeIcon);
    
    notificationContent.appendChild(icon);
    notificationContent.appendChild(span);
    notificationContent.appendChild(closeButton);
    notification.appendChild(notificationContent);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(45deg, #00ff00, #00cc00)',
        error: 'linear-gradient(45deg, #ff0000, #cc0000)',
        warning: 'linear-gradient(45deg, #ffaa00, #ff8800)',
        info: 'linear-gradient(45deg, #00ffff, #0099cc)'
    };
    return colors[type] || colors.info;
}

function showModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    const modalElement = document.createElement('div');
    modalElement.className = 'modal';
    
    const headerElement = document.createElement('div');
    headerElement.className = 'modal-header';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.addEventListener('click', closeModal);
    
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';
    closeButton.appendChild(closeIcon);
    
    headerElement.appendChild(titleElement);
    headerElement.appendChild(closeButton);
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = DOMPurify.sanitize(content); // This needs to be sanitized separately
    
    modalElement.appendChild(headerElement);
    modalElement.appendChild(modalContent);
    modalOverlay.appendChild(modalElement);
    
    // Add styles
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modalElement.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #00ffff;
        border-radius: 15px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    `;
    
    headerElement.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    `;
    
    titleElement.style.cssText = `
        color: #00ffff;
        margin: 0;
    `;
    
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: #00ffff;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
    `;
    
    modalContent.style.cssText = `
        color: white;
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function initializeInteractions() {
    // Add hover effects and animations
    const cards = document.querySelectorAll('.stat-card, .dashboard-card, .music-card, .analytics-card, .settings-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .featured-badge {
            background: linear-gradient(45deg, #ffaa00, #ff8800);
            color: #000;
            padding: 0.25rem 0.5rem;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        
        setTimeout(() => {
            // Redirect to login page
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const activeSearch = document.querySelector('.admin-section.active .search-bar input');
        if (activeSearch) {
            activeSearch.focus();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Number keys for quick navigation
    if (e.key >= '1' && e.key <= '6' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const sections = ['dashboard', 'users', 'music', 'analytics', 'settings', 'moderation'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            showSection(sections[sectionIndex]);
        }
    }
});

// Export functions for global access
window.showSection = showSection;
window.viewUser = viewUser;
window.suspendUser = suspendUser;
window.activateUser = activateUser;
window.exportUsers = exportUsers;
window.featureTrack = featureTrack;
window.removeTrack = removeTrack;
window.exportAnalytics = exportAnalytics;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.reviewContent = reviewContent;
window.approveContent = approveContent;
window.removeContent = removeContent;
window.closeModal = closeModal;
window.logout = logout;
