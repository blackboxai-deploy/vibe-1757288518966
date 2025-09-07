/**
 * BaddBeatz Streaming Web Controller
 * Web interface for controlling multi-platform DJ streaming
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const BaddBeatzStreamer = require('./obs-integration');

class StreamingWebController {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.streamer = new BaddBeatzStreamer();
        this.port = process.env.PORT || 3001;
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        this.setupStreamerEvents();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    setupRoutes() {
        // Main streaming control interface
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'streaming-control.html'));
        });

        // API Routes
        this.app.get('/api/status', (req, res) => {
            res.json({
                connected: this.streamer.isConnected,
                streaming: this.streamer.isStreaming,
                platforms: this.streamer.platforms,
                currentBPM: this.streamer.currentBPM,
                currentTrack: this.streamer.currentTrack
            });
        });

        this.app.post('/api/connect', async (req, res) => {
            try {
                const success = await this.streamer.connectToOBS();
                res.json({ success, message: success ? 'Connected to OBS' : 'Failed to connect' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/stream/start', async (req, res) => {
            try {
                const { platforms } = req.body;
                const success = await this.streamer.startMultiPlatformStream(platforms);
                res.json({ success, message: success ? 'Stream started' : 'Failed to start stream' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/stream/stop', async (req, res) => {
            try {
                const success = await this.streamer.stopMultiPlatformStream();
                res.json({ success, message: success ? 'Stream stopped' : 'Failed to stop stream' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/bpm', (req, res) => {
            const { bpm } = req.body;
            this.streamer.updateBPM(bpm);
            res.json({ success: true, bpm });
        });

        this.app.post('/api/track', (req, res) => {
            const { artist, title, genre } = req.body;
            this.streamer.updateTrackInfo(artist, title, genre);
            res.json({ success: true, track: { artist, title, genre } });
        });

        this.app.post('/api/scene', async (req, res) => {
            try {
                const { sceneName } = req.body;
                const success = await this.streamer.switchScene(sceneName);
                res.json({ success, sceneName });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('🔌 Client connected to streaming controller');

            // Send current status to new client
            socket.emit('status', {
                connected: this.streamer.isConnected,
                streaming: this.streamer.isStreaming,
                platforms: this.streamer.platforms,
                currentBPM: this.streamer.currentBPM,
                currentTrack: this.streamer.currentTrack
            });

            socket.on('disconnect', () => {
                console.log('🔌 Client disconnected from streaming controller');
            });
        });
    }

    setupStreamerEvents() {
        this.streamer.on('connected', () => {
            this.io.emit('obs-connected');
        });

        this.streamer.on('disconnected', () => {
            this.io.emit('obs-disconnected');
        });

        this.streamer.on('streamStarted', () => {
            this.io.emit('stream-started');
        });

        this.streamer.on('streamStopped', () => {
            this.io.emit('stream-stopped');
        });

        this.streamer.on('bpmUpdated', (bpm) => {
            this.io.emit('bpm-updated', bpm);
        });

        this.streamer.on('trackUpdated', (track) => {
            this.io.emit('track-updated', track);
        });

        this.streamer.on('sceneChanged', (sceneName) => {
            this.io.emit('scene-changed', sceneName);
        });

        this.streamer.on('platformConnected', (platform) => {
            this.io.emit('platform-connected', platform);
        });

        this.streamer.on('error', (error) => {
            this.io.emit('error', error.message);
        });
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🎛️ BaddBeatz Streaming Controller running on http://localhost:${this.port}`);
            console.log('🎵 Ready to control multi-platform DJ streaming!');
        });
    }
}

// Start the web controller
if (require.main === module) {
    const controller = new StreamingWebController();
    controller.start();
}

module.exports = StreamingWebController;
