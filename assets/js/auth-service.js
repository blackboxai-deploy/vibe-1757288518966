// Authentication Service for BaddBeatz
class AuthService {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api/auth' 
            : 'https://api.baddbeatz.com/api/auth';
        
        // Check token from sessionStorage and validate expiry
        this.token = this.getValidToken();
    }

    // Get valid token (check expiry)
    getValidToken() {
        const token = sessionStorage.getItem('authToken');
        const expiry = sessionStorage.getItem('tokenExpiry');
        
        if (!token || !expiry) {
            return null;
        }
        
        // Check if token is expired
        if (Date.now() > parseInt(expiry)) {
            this.logout();
            return null;
        }
        
        return token;
    }

    // Register new user
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return { success: true, message: data.message };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user info securely
            this.token = data.token;
            
            // Use sessionStorage for tokens (more secure than localStorage)
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('tokenExpiry', (Date.now() + (24 * 60 * 60 * 1000)).toString()); // 24 hours
            
            // Store non-sensitive user info in localStorage
            const safeUserData = {
                username: data.user.username,
                email: data.user.email,
                // Don't store sensitive data
            };
            localStorage.setItem('user', JSON.stringify(safeUserData));

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Verify token
    async verifyToken() {
        if (!this.token) {
            return { valid: false };
        }

        try {
            const response = await fetch(`${this.baseURL}/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                this.logout();
                return { valid: false };
            }

            return { valid: true, user: data.user };
        } catch (error) {
            console.error('Token verification error:', error);
            this.logout();
            return { valid: false };
        }
    }

    // Logout user
    async logout() {
        try {
            if (this.token) {
                await fetch(`${this.baseURL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all stored data
            this.token = null;
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            
            // Redirect to login
            window.location.href = '/login.html';
        }
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && this.getValidToken();
    }

    // Get auth headers for API requests
    getAuthHeaders() {
        const validToken = this.getValidToken();
        return validToken ? { 'Authorization': `Bearer ${validToken}` } : {};
    }

    // Protected route guard
    async requireAuth() {
        const result = await this.verifyToken();
        if (!result.valid) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }
}

// Create singleton instance
const authService = new AuthService();

// Auto-verify token on page load for protected pages
if (window.location.pathname.includes('dashboard') || 
    window.location.pathname.includes('admin')) {
    authService.requireAuth();
}

// Export for use in other modules
window.AuthService = authService;
