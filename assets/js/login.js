// Login Page JavaScript - BaddBeatz Community
class BaddBeatzAuth {
    constructor() {
        this.initializeEventListeners();
        this.initializeFormValidation();
        this.loadSavedData();
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerFormElement').addEventListener('submit', (e) => this.handleRegister(e));

        // Password strength checking
        document.getElementById('registerPassword').addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        
        // Password confirmation matching
        document.getElementById('confirmPassword').addEventListener('input', (e) => this.checkPasswordMatch());

        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });

        // Remember form data
        document.getElementById('rememberMe').addEventListener('change', (e) => this.toggleRememberMe(e.target.checked));
    }

    initializeFormValidation() {
        // Real-time validation for all inputs
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Show/hide forms
        document.getElementById('loginForm').style.display = tabName === 'login' ? 'block' : 'none';
        document.getElementById('registerForm').style.display = tabName === 'register' ? 'block' : 'none';

        // Update page title
        document.title = tabName === 'login' ? 'Login | BaddBeatz Community' : 'Join Community | BaddBeatz';
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.auth-submit');
        const formData = new FormData(form);
        
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: document.getElementById('rememberMe').checked
        };

        // Validate login data
        if (!this.validateLoginData(loginData)) {
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API call (replace with actual authentication)
            const result = await this.authenticateUser(loginData);
            
            if (result.success) {
                this.showMessage('Welcome back to BaddBeatz! 🎵', 'success');
                
                // Save user session
                this.saveUserSession(result.user);
                
                // Redirect to dashboard or previous page
                setTimeout(() => {
                    window.location.href = result.redirectUrl || 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage(result.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Connection error. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.auth-submit');
        const formData = new FormData(form);
        
        const registerData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            artistName: formData.get('artistName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            musicGenre: formData.get('musicGenre'),
            bio: formData.get('bio'),
            agreeTerms: document.getElementById('agreeTerms').checked,
            newsletter: document.getElementById('newsletter').checked
        };

        // Validate registration data
        if (!this.validateRegistrationData(registerData)) {
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API call (replace with actual registration)
            const result = await this.registerUser(registerData);
            
            if (result.success) {
                this.showMessage('Welcome to the BaddBeatz community! 🎉 Please check your email to verify your account.', 'success');
                
                // Clear form
                form.reset();
                
                // Switch to login tab after delay
                setTimeout(() => {
                    this.switchTab('login');
                    document.getElementById('loginEmail').value = registerData.email;
                }, 3000);
            } else {
                this.showMessage(result.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Connection error. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    validateLoginData(data) {
        let isValid = true;

        // Email validation
        if (!data.email || data.email.trim() === '') {
            this.showFieldError('loginEmail', 'Email or username is required');
            isValid = false;
        }

        // Password validation
        if (!data.password || data.password.length < 1) {
            this.showFieldError('loginPassword', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateRegistrationData(data) {
        let isValid = true;

        // Name validation
        if (!data.firstName || data.firstName.trim().length < 2) {
            this.showFieldError('firstName', 'First name must be at least 2 characters');
            isValid = false;
        }

        if (!data.lastName || data.lastName.trim().length < 2) {
            this.showFieldError('lastName', 'Last name must be at least 2 characters');
            isValid = false;
        }

        // Artist name validation
        if (!data.artistName || data.artistName.trim().length < 2) {
            this.showFieldError('artistName', 'Artist name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('registerEmail', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!data.password || data.password.length < 8) {
            this.showFieldError('registerPassword', 'Password must be at least 8 characters');
            isValid = false;
        }

        // Password confirmation
        if (data.password !== data.confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        // Genre selection
        if (!data.musicGenre) {
            this.showFieldError('musicGenre', 'Please select your primary music genre');
            isValid = false;
        }

        // Terms agreement
        if (!data.agreeTerms) {
            this.showMessage('You must agree to the Terms of Service to continue', 'error');
            isValid = false;
        }

        return isValid;
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        let strength = 0;
        let strengthClass = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                strengthClass = 'weak';
                break;
            case 2:
            case 3:
                strengthClass = 'fair';
                break;
            case 4:
                strengthClass = 'good';
                break;
            case 5:
                strengthClass = 'strong';
                break;
        }

        strengthIndicator.className = `password-strength ${strengthClass}`;
    }

    checkPasswordMatch() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmField = document.getElementById('confirmPassword');

        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
        } else {
            this.clearFieldError(confirmField);
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    this.showFieldError(field.id, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
            case 'password':
                if (field.hasAttribute('required') && value.length < 8) {
                    this.showFieldError(field.id, 'Password must be at least 8 characters');
                    isValid = false;
                }
                break;
            default:
                if (field.hasAttribute('required') && !value) {
                    this.showFieldError(field.id, 'This field is required');
                    isValid = false;
                }
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.textContent = message;
        } else {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = 'color: #ff4444; font-size: 0.8rem; margin-top: 0.25rem;';
            field.parentNode.appendChild(errorElement);
        }
        
        field.style.borderColor = '#ff4444';
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    setLoadingState(button, isLoading) {
        button.classList.toggle('loading', isLoading);
        button.disabled = isLoading;
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        const messageElement = document.getElementById('messageContent');
        
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        container.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            container.style.display = 'none';
        }, 5000);
    }

    async authenticateUser(loginData) {
        // Use the real authentication service
        if (window.AuthService) {
            return await window.AuthService.login(loginData.email, loginData.password);
        } else {
            return {
                success: false,
                message: 'Authentication service not loaded. Please refresh the page.'
            };
        }
    }

    async registerUser(registerData) {
        // Use the real authentication service for registration
        if (window.AuthService) {
            // Use artistName as username for the registration
            const username = registerData.artistName || `${registerData.firstName} ${registerData.lastName}`;
            return await window.AuthService.register(username, registerData.email, registerData.password);
        } else {
            return {
                success: false,
                message: 'Authentication service not loaded. Please refresh the page.'
            };
        }
    }

    saveUserSession(user) {
        localStorage.setItem('baddbeatz_user', JSON.stringify(user));
        localStorage.setItem('baddbeatz_login_time', Date.now().toString());
    }

    loadSavedData() {
        // Load remembered login data
        const rememberMe = localStorage.getItem('baddbeatz_remember_me') === 'true';
        if (rememberMe) {
            const savedEmail = localStorage.getItem('baddbeatz_saved_email');
            if (savedEmail) {
                document.getElementById('loginEmail').value = savedEmail;
                document.getElementById('rememberMe').checked = true;
            }
        }
    }

    toggleRememberMe(remember) {
        if (remember) {
            localStorage.setItem('baddbeatz_remember_me', 'true');
        } else {
            localStorage.removeItem('baddbeatz_remember_me');
            localStorage.removeItem('baddbeatz_saved_email');
        }
    }

    handleSocialLogin(e) {
        e.preventDefault();
        const platform = e.currentTarget.textContent.trim();
        
        this.showMessage(`${platform} login integration coming soon! 🎵`, 'info');
        
        // TODO: Implement actual social login
        // Example for SoundCloud OAuth:
        // window.location.href = '/auth/soundcloud';
    }
}

// Password toggle functionality
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.parentNode.querySelector('.password-toggle');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BaddBeatzAuth();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaddBeatzAuth;
}
