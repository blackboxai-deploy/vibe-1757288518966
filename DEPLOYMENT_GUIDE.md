# 🚀 BaddBeatz Deployment Guide

This guide covers how to deploy the BaddBeatz DJ portfolio website using both GitHub Pages and Cloudflare Workers.

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- Python 3.12
- Cloudflare account (for Workers deployment)
- GitHub repository with Pages enabled

## 🔧 Initial Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 2. Environment Configuration

Copy the environment template and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys:
- `OPENAI_API_KEY`: Your OpenAI API key for AI features
- `YOUTUBE_API_KEY`: YouTube API key for video integration
- Other OAuth and service keys as needed

## 🏗️ Building the Project

### Build Static Assets

```bash
npm run build
```

This command:
1. Cleans previous builds (`dist` and `docs` folders)
2. Optimizes assets and copies them to `dist/`
3. Copies files for GitHub Pages to `docs/`

### Validate Build

```bash
npm run validate:build
```

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically:
1. Builds the project on every push to `main`
2. Validates the build
3. Deploys to GitHub Pages

**Setup:**
1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The workflow will handle the rest automatically

### Manual Deployment

If you prefer manual deployment:

```bash
npm run build
git add docs/
git commit -m "Update GitHub Pages build"
git push origin main
```

Then configure GitHub Pages to serve from the `/docs` folder.

## ☁️ Cloudflare Workers Deployment

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Configure Secrets

Set your API keys as Cloudflare secrets (recommended for production):

```bash
wrangler secret put OPENAI_API_KEY
```

### 4. Deploy

#### Development Environment
```bash
npm run deploy:dev
# or
wrangler deploy --env development
```

#### Production Environment
```bash
npm run deploy
# or
wrangler deploy --env production
```

### 5. Custom Domain Setup

The production environment is configured for:
- `baddbeatz.nl`
- `www.baddbeatz.nl`

Make sure your domain DNS points to Cloudflare and the custom domain is configured in your Cloudflare dashboard.

## 🧪 Local Development

### Start Development Server

```bash
# Python development server
python server.py

# Or use npm script
npm run dev:frontend
```

The server includes security headers and serves at `http://localhost:8000`

### Backend Development

```bash
npm run dev:backend
```

This starts the Node.js backend server for API endpoints.

### Full Development Environment

```bash
npm run dev
```

Starts both frontend and backend servers concurrently.

## 🔍 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Lint Code

```bash
npm run lint
```

### Integration Testing

```bash
npm run test:integration
```

## 📁 Build Output Structure

```
docs/                 # GitHub Pages deployment folder
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── CNAME            # Custom domain configuration
└── ...

dist/                # Cloudflare Workers deployment folder
├── index.html
├── assets/
└── ...
```

## 🔐 Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables for local development
- Use Cloudflare secrets for production deployment
- Rotate keys regularly

### Content Security Policy
The server includes CSP headers for security:
- `default-src 'self'`
- `script-src 'self'`
- `object-src 'none'`

### Rate Limiting
Cloudflare Workers include rate limiting:
- 20 requests per minute per IP for AI endpoints
- Configurable via KV storage

## 🚨 Troubleshooting

### Build Issues

**Problem:** Build validation fails
```bash
npm run validate:build
```
**Solution:** Ensure `docs/index.html` exists after running `npm run build`

**Problem:** Missing dependencies
```bash
npm ci
pip install -r requirements.txt
```

### Deployment Issues

**Problem:** Wrangler authentication fails
```bash
wrangler logout
wrangler login
```

**Problem:** Custom domain not working
- Check DNS configuration
- Verify Cloudflare custom domain settings
- Ensure SSL/TLS is configured

### Local Development Issues

**Problem:** Port 8000 already in use
```bash
fuser -k 8000/tcp
python server.py
```

**Problem:** Python dependencies missing
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## 📊 Monitoring

### Cloudflare Analytics
- Monitor worker performance in Cloudflare dashboard
- Check error rates and response times
- Review security events

### GitHub Actions
- Monitor deployment status in Actions tab
- Check build logs for issues
- Review deployment history

## 🔄 Continuous Integration

The repository includes:
- **GitHub Actions** for automated testing and deployment
- **ESLint** for code quality
- **Jest** for JavaScript testing
- **Python testing** with pytest

### Workflow Triggers
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Cloudflare Workers logs
4. Verify environment configuration

---

**Happy Deploying! 🎵**
