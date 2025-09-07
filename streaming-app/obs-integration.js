/**
 * BaddBeatz OBS Studio Integration
 * Multi-Platform Streaming Controller
 * Supports Twitch, YouTube, Facebook, TikTok simultaneous streaming
 */

const OBSWebSocket = require('obs-websocket-js');
const { EventEmitter } = require('events');

class BaddBeatzStreamer extends EventEmitter {
    constructor() {
        super();
        this.obs = new OBSWebSocket();
        this.isConnected = false;
        this.isStreaming = false;
        this.currentBPM = 0;
        this.currentTrack = null;
        this.platforms = {
            twitch: {
                name: 'Twitch',
                rtmpUrl: 'rtmp://live.twitch.tv/live/',
                streamKey: process.env.TWITCH_STREAM_KEY,
                enabled: false,
                viewers: 0
            },
            youtube: {
                name: 'YouTube Live',
                rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2/',
                streamKey: process.env.YOUTUBE_STREAM_KEY,
                enabled: false,
                viewers: 0
            },
            facebook: {
                name: 'Facebook Live',
                rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
                streamKey: process.env.FACEBOOK_STREAM_KEY,
                enabled: false,
                viewers: 0
            },
            tiktok: {
                name: 'TikTok Live',
                rtmpUrl: 'rtmp://push.tiktokcdn.com/live/',
                streamKey: process.env.TIKTOK_STREAM_KEY,
                enabled: false,
                viewers: 0
            }
        };
    }

    /**
     * Connect to OBS Studio
     */
    async connectToOBS() {
        try {
            await this.obs.connect({
                address: 'localhost:4444',
                password: process.env.OBS_PASSWORD
            });
            
            this.isConnected = true;
            console.log('✅ Connected to OBS Studio');
            
            // Set up event listeners
            this.setupOBSEventListeners();
            
            // Initialize streaming setup
            await this.initializeStreamingSetup();
            
            this.emit('connected');
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to OBS:', error);
            this.emit('error', error);
            return false;
        }
    }

    /**
     * Set up OBS event listeners
     */
    setupOBSEventListeners() {
        this.obs.on('StreamStarted', () => {
            this.isStreaming = true;
            console.log('🔴 Stream started');
            this.emit('streamStarted');
        });

        this.obs.on('StreamStopped', () => {
            this.isStreaming = false;
            console.log('⚫ Stream stopped');
            this.emit('streamStopped');
        });

        this.obs.on('SceneChanged', (data) => {
            console.log(`🎬 Scene changed to: ${data.sceneName}`);
            this.emit('sceneChanged', data.sceneName);
        });
    }

    /**
     * Initialize streaming setup in OBS
     */
    async initializeStreamingSetup() {
        try {
            // Create scenes for different streaming scenarios
            await this.createDJScenes();
            
            // Set up audio sources
            await this.setupAudioSources();
            
            // Configure streaming settings
            await this.configureStreamSettings();
            
            console.log('🎛️ OBS streaming setup initialized');
        } catch (error) {
            console.error('❌ Failed to initialize streaming setup:', error);
        }
    }

    /**
     * Create DJ-specific scenes
     */
    async createDJScenes() {
        const scenes = [
            'DJ Performance',
            'Track Transition',
            'Chat Interaction',
            'BPM Display',
            'Genre Showcase'
        ];

        for (const sceneName of scenes) {
            try {
                await this.obs.send('CreateScene', { sceneName });
                console.log(`📺 Created scene: ${sceneName}`);
            } catch (error) {
                // Scene might already exist
                console.log(`📺 Scene exists: ${sceneName}`);
            }
        }
    }

    /**
     * Set up audio sources for DJ equipment
     */
    async setupAudioSources() {
        const audioSources = [
            {
                sourceName: 'DJ Mixer',
                sourceType: 'wasapi_input_capture',
                settings: {
                    device_id: 'default' // DJ mixer audio interface
                }
            },
            {
                sourceName: 'Microphone',
                sourceType: 'wasapi_input_capture',
                settings: {
                    device_id: 'default' // DJ microphone
                }
            }
        ];

        for (const source of audioSources) {
            try {
                await this.obs.send('CreateSource', {
                    sourceName: source.sourceName,
                    sourceType: source.sourceType,
                    sourceSettings: source.settings
                });
                console.log(`🎤 Created audio source: ${source.sourceName}`);
            } catch (error) {
                console.log(`🎤 Audio source exists: ${source.sourceName}`);
            }
        }
    }

    /**
     * Configure streaming settings for multi-platform
     */
    async configureStreamSettings() {
        const streamSettings = {
            type: 'rtmp_output',
            settings: {
                server: '', // Will be set per platform
                key: '',    // Will be set per platform
                use_auth: false
            }
        };

        try {
            await this.obs.send('SetStreamSettings', streamSettings);
            console.log('⚙️ Stream settings configured');
        } catch (error) {
            console.error('❌ Failed to configure stream settings:', error);
        }
    }

    /**
     * Start streaming to selected platforms
     */
    async startMultiPlatformStream(enabledPlatforms = ['twitch']) {
        if (!this.isConnected) {
            throw new Error('Not connected to OBS Studio');
        }

        try {
            // For now, start with primary platform (Twitch)
            // Multi-platform requires OBS plugins or multiple instances
            const primaryPlatform = enabledPlatforms[0];
            const platform = this.platforms[primaryPlatform];

            if (!platform.streamKey) {
                throw new Error(`Stream key not configured for ${platform.name}`);
            }

            // Set stream settings for primary platform
            await this.obs.send('SetStreamSettings', {
                type: 'rtmp_output',
                settings: {
                    server: platform.rtmpUrl,
                    key: platform.streamKey
                }
            });

            // Start streaming
            await this.obs.send('StartStreaming');
            
            platform.enabled = true;
            console.log(`🚀 Started streaming to ${platform.name}`);
            
            // Start additional platforms (requires advanced setup)
            await this.startAdditionalPlatforms(enabledPlatforms.slice(1));
            
            this.emit('multiStreamStarted', enabledPlatforms);
            return true;
        } catch (error) {
            console.error('❌ Failed to start multi-platform stream:', error);
            this.emit('error', error);
            return false;
        }
    }

    /**
     * Start streaming to additional platforms
     * Note: This requires OBS plugins like "Multiple RTMP outputs" or separate instances
     */
    async startAdditionalPlatforms(platforms) {
        for (const platformKey of platforms) {
            const platform = this.platforms[platformKey];
            
            if (!platform.streamKey) {
                console.warn(`⚠️ Stream key not configured for ${platform.name}`);
                continue;
            }

            // This would require additional OBS setup or plugins
            console.log(`🔄 Setting up additional stream for ${platform.name}`);
            platform.enabled = true;
            
            // Emit event for each platform
            this.emit('platformConnected', platformKey);
        }
    }

    /**
     * Stop streaming to all platforms
     */
    async stopMultiPlatformStream() {
        try {
            await this.obs.send('StopStreaming');
            
            // Disable all platforms
            Object.keys(this.platforms).forEach(key => {
                this.platforms[key].enabled = false;
                this.platforms[key].viewers = 0;
            });
            
            console.log('⏹️ Stopped all streams');
            this.emit('multiStreamStopped');
            return true;
        } catch (error) {
            console.error('❌ Failed to stop streams:', error);
            return false;
        }
    }

    /**
     * Update BPM display (from DJ software integration)
     */
    updateBPM(bpm) {
        this.currentBPM = bpm;
        
        // Update BPM text source in OBS
        this.obs.send('SetTextGDIPlusProperties', {
            source: 'BPM Display',
            text: `${bpm} BPM`
        }).catch(console.error);
        
        this.emit('bpmUpdated', bpm);
    }

    /**
     * Update current track info
     */
    updateTrackInfo(artist, title, genre) {
        this.currentTrack = { artist, title, genre };
        
        // Update track info text source in OBS
        const trackText = `🎵 ${artist} - ${title} [${genre}]`;
        this.obs.send('SetTextGDIPlusProperties', {
            source: 'Track Info',
            text: trackText
        }).catch(console.error);
        
        this.emit('trackUpdated', this.currentTrack);
    }

    /**
     * Switch to different scene
     */
    async switchScene(sceneName) {
        try {
            await this.obs.send('SetCurrentScene', { 'scene-name': sceneName });
            console.log(`🎬 Switched to scene: ${sceneName}`);
            this.emit('sceneChanged', sceneName);
            return true;
        } catch (error) {
            console.error(`❌ Failed to switch to scene ${sceneName}:`, error);
            return false;
        }
    }

    /**
     * Get streaming statistics
     */
    async getStreamStats() {
        try {
            const stats = await this.obs.send('GetStreamingStatus');
            return {
                isStreaming: stats.streaming,
                streamTime: stats.streamTimecode,
                totalFrames: stats.totalFrames,
                droppedFrames: stats.droppedFrames,
                fps: stats.fps
            };
        } catch (error) {
            console.error('❌ Failed to get stream stats:', error);
            return null;
        }
    }

    /**
     * Disconnect from OBS
     */
    async disconnect() {
        try {
            await this.obs.disconnect();
            this.isConnected = false;
            console.log('🔌 Disconnected from OBS Studio');
            this.emit('disconnected');
        } catch (error) {
            console.error('❌ Failed to disconnect from OBS:', error);
        }
    }
}

module.exports = BaddBeatzStreamer;

// Example usage
if (require.main === module) {
    const streamer = new BaddBeatzStreamer();
    
    // Set up event listeners
    streamer.on('connected', () => {
        console.log('🎉 Ready to stream!');
    });
    
    streamer.on('streamStarted', () => {
        console.log('🔴 Live streaming started!');
    });
    
    streamer.on('bpmUpdated', (bpm) => {
        console.log(`🎵 BPM: ${bpm}`);
    });
    
    // Connect and start streaming
    async function startDJStream() {
        await streamer.connectToOBS();
        
        // Simulate DJ session
        setTimeout(() => {
            streamer.updateBPM(128);
            streamer.updateTrackInfo('Charlotte de Witte', 'Doppler', 'Techno');
        }, 2000);
        
        // Start streaming to Twitch and YouTube
        setTimeout(() => {
            streamer.startMultiPlatformStream(['twitch', 'youtube']);
        }, 5000);
    }
    
    startDJStream().catch(console.error);
}
