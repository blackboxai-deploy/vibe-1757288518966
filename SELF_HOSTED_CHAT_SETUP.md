# BaddBeatz Self-Hosted Chat Widget Setup Guide

This guide will help you set up the self-hosted AI chat widget for the BaddBeatz DJ website.

## Overview

The self-hosted chat system includes:
- **Local LLM**: Uses Ollama for AI responses (no external API costs)
- **RAG (Retrieval Augmented Generation)**: Provides context from your website content
- **Bilingual Support**: Responds in Dutch or English based on user input
- **Premium Feature**: Only available to premium users
- **Modern UI**: Clean, responsive chat widget

## Prerequisites

1. **Python 3.8+** with pip
2. **Node.js 18+** with npm
3. **Ollama** (for local LLM)
4. **Git** (for version control)

## Step 1: Install Ollama

### On Linux/macOS:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### On Windows:
Download and install from: https://ollama.ai/download

### Start Ollama and download a model:
```bash
# Start Ollama service
ollama serve

# In another terminal, download a model
ollama pull llama3:8b-instruct

# Alternative models (optional):
# ollama pull mistral:7b-instruct
# ollama pull codellama:7b-instruct
```

## Step 2: Install Python Dependencies

```bash
# Install the new dependencies for self-hosted chat
pip install -r requirements.txt

# If you get errors, install individually:
pip install faiss-cpu sentence-transformers langdetect trafilatura pypdf numpy
```

## Step 3: Create RAG Content Index

### Option A: Use Demo Content (Quick Start)
```bash
# Create demo RAG store with sample content
python create_demo_rag.py
```

### Option B: Index Your Own Content (Recommended)
```bash
# Index your website content and any additional documents
python index_content.py
```

This will create:
- `rag_store/faiss.index` - Vector embeddings index
- `rag_store/meta.json` - Content metadata

## Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Key settings to configure:
```bash
# Local LLM Configuration
OLLAMA_URL=http://localhost:11434/api/generate
LLM_MODEL=llama3:8b-instruct

# Database path
DB_PATH=data/baddbeatz.db

# Server port
PORT=8000
```

## Step 5: Test the Setup

### 1. Check Ollama is running:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3:8b-instruct",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### 2. Check RAG store:
```bash
python -c "
from rag_store import get_index_stats
print(get_index_stats())
"
```

### 3. Start the server:
```bash
python server.py
```

### 4. Test the chat endpoint:
```bash
# First create a premium user (via the website or API)
# Then test the chat
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"question": "What music styles do you play?"}'
```

## Step 6: Deploy to Production

### Update server configuration:
```bash
# In .env, set:
FLASK_ENV=production
PORT=8000

# Ensure Ollama is running as a service
sudo systemctl enable ollama
sudo systemctl start ollama
```

### Use a process manager:
```bash
# Install PM2 or similar
npm install -g pm2

# Start the application
pm2 start server.py --name baddbeatz-chat --interpreter python3

# Save PM2 configuration
pm2 save
pm2 startup
```

## Usage

### For Users:
1. **Login** to the website
2. **Upgrade to premium** (if not already)
3. **Navigate to any page** with the AI chat section
4. **Type questions** about music, bookings, events, etc.
5. **Get responses** in English or Dutch automatically

### Sample Questions:
- "What music styles do you play?"
- "How much does it cost to book you for a private party?"
- "Wat voor muziek speel je?" (Dutch)
- "Kun je optreden in Amsterdam?" (Dutch)

## Troubleshooting

### Common Issues:

1. **"Self-hosted chat dependencies not available"**
   ```bash
   pip install faiss-cpu sentence-transformers langdetect
   ```

2. **"Local LLM server is not available"**
   ```bash
   # Check if Ollama is running
   ollama list
   ollama serve
   ```

3. **"No RAG index available"**
   ```bash
   # Create the demo index
   python create_demo_rag.py
   ```

4. **"Premium required" error**
   ```bash
   # Create a premium user via the registration API
   curl -X POST http://localhost:8000/api/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass123", "is_premium": true}'
   ```

### Performance Optimization:

1. **Use GPU acceleration** (if available):
   ```bash
   # Install FAISS with GPU support
   pip uninstall faiss-cpu
   pip install faiss-gpu
   ```

2. **Optimize Ollama**:
   ```bash
   # Set memory limits
   export OLLAMA_HOST=0.0.0.0:11434
   export OLLAMA_ORIGINS=*
   ```

3. **Cache embeddings**:
   The system automatically caches the embedding model and FAISS index in memory.

## Monitoring

### Check system status:
```bash
# RAG store status
curl http://localhost:8000/api/rag/status

# Server health
curl http://localhost:8000/api/tracks
```

### Logs:
```bash
# View application logs
tail -f logs/app.log

# View Ollama logs
journalctl -u ollama -f
```

## Security Considerations

1. **API Keys**: Never commit `.env` to version control
2. **Premium Access**: Only premium users can access the chat
3. **Rate Limiting**: Built-in rate limiting prevents abuse
4. **Input Validation**: All user inputs are validated and sanitized
5. **Local Processing**: No data sent to external AI services

## Customization

### Adding More Content:
1. Edit `index_content.py` to include more sources
2. Add documents to a `data/` directory
3. Re-run the indexing script

### Changing the AI Model:
1. Download a different model: `ollama pull mistral:7b-instruct`
2. Update `LLM_MODEL` in `.env`
3. Restart the server

### Modifying Prompts:
Edit the system prompts in `server_improved.py` around line 320.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the application logs
3. Test individual components (Ollama, RAG store, server)
4. Contact the development team

## Next Steps

1. **Content Expansion**: Add more website content and documents to the RAG store
2. **Model Fine-tuning**: Consider fine-tuning a model on DJ-specific content
3. **Analytics**: Add chat analytics to track popular questions
4. **Multi-language**: Expand beyond Dutch/English if needed
5. **Voice Integration**: Consider adding voice input/output capabilities

---

**Note**: This system is designed to be cost-effective and privacy-focused by running everything locally. No external AI API calls are made once properly configured.
