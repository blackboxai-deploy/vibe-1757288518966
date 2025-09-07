'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

interface StreamStatus {
  isLive: boolean;
  title: string;
  viewers: number;
  startTime: string;
  duration: string;
  genre: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isOwner?: boolean;
}

export default function LivePage() {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>({
    isLive: true,
    title: 'Underground Saturday Night Session',
    viewers: 1247,
    startTime: '21:00',
    duration: '2:34:15',
    genre: 'Techno/Hardstyle'
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', username: 'TechnoFan2024', message: 'This beat is insane! 🔥🔥🔥', timestamp: '23:45' },
    { id: '2', username: 'RaveQueen', message: 'Been waiting all week for this!', timestamp: '23:46' },
    { id: '3', username: 'TheBadGuyHimself', message: 'Next track is going to blow your minds!', timestamp: '23:47', isOwner: true },
    { id: '4', username: 'BassDrop99', message: 'Track ID please???', timestamp: '23:48' },
    { id: '5', username: 'ElectroNinja', message: 'This is why I love live streams', timestamp: '23:49' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate live viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStatus(prev => ({
        ...prev,
        viewers: prev.viewers + Math.floor(Math.random() * 10) - 5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        username: 'You',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {streamStatus.isLive ? (
          // Live Stream Interface
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Video Player Section */}
            <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
              <div className="relative aspect-video bg-black">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/daf39511-c112-4918-aac6-2f4550a67f5a.png" 
                  alt="Live DJ performance stream"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                
                {/* Live Status Overlay */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded font-bold animate-pulse">
                  ● LIVE
                </div>
                
                {/* Viewer Count */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded">
                  👥 {streamStatus.viewers.toLocaleString()} watching
                </div>
                
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded"
                >
                  {isFullscreen ? '↙️' : '↗️'}
                </button>
                
                {/* Stream Controls */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  <button className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded">
                    🔊
                  </button>
                  <button className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded">
                    ⚙️
                  </button>
                </div>
              </div>
              
              {/* Stream Info */}
              <div className="p-6 bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-gray-700">
                <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
                  {streamStatus.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  <span className="flex items-center">
                    🎵 {streamStatus.genre}
                  </span>
                  <span className="flex items-center">
                    ⏰ Started at {streamStatus.startTime}
                  </span>
                  <span className="flex items-center">
                    ⏱️ {streamStatus.duration}
                  </span>
                  <span className="flex items-center">
                    👥 {streamStatus.viewers.toLocaleString()} viewers
                  </span>
                </div>
              </div>

              {/* Stream Actions */}
              <div className="p-6 bg-black/30">
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-red-500 hover:bg-red-600">
                    ❤️ Like (2.4K)
                  </Button>
                  <Button variant="outline">
                    🔔 Follow
                  </Button>
                  <Button variant="outline">
                    📤 Share
                  </Button>
                  <Button variant="outline">
                    💰 Tip DJ
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="lg:w-80 bg-black/50 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Live Chat</h3>
                <p className="text-gray-400 text-sm">{streamStatus.viewers.toLocaleString()} viewers</p>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96 lg:max-h-none">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${msg.isOwner ? 'text-red-400' : 'text-cyan-400'}`}>
                        {msg.isOwner && '👑'} {msg.username}
                      </span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-white text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                  <Button type="submit" size="sm" className="px-4">
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          // Stream Offline State
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="text-8xl mb-8">📺</div>
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold neon-text mb-8">
                STREAM OFFLINE
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-12">
                TheBadGuyHimself is not currently live
              </p>
              
              {/* Next Stream Schedule */}
              <div className="bg-gradient-to-r from-red-900/20 to-cyan-900/20 border border-red-500/30 rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-6">📅 Upcoming Streams</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg">
                    <div className="text-left">
                      <div className="text-white font-bold">Saturday Night Techno Session</div>
                      <div className="text-cyan-400">This Saturday • 9:00 PM CET</div>
                    </div>
                    <Button variant="outline" size="sm">Set Reminder</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg">
                    <div className="text-left">
                      <div className="text-white font-bold">Sunday Hardstyle Madness</div>
                      <div className="text-purple-400">This Sunday • 8:00 PM CET</div>
                    </div>
                    <Button variant="outline" size="sm">Set Reminder</Button>
                  </div>
                </div>
              </div>
              
              {/* Previous Streams */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">🎥 Recent Streams</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-black">
                      <img 
                        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ae35e269-d0eb-4a10-8ee6-2a8246727e45.png" 
                        alt="Underground Friday Mix stream thumbnail"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-bold">Underground Friday Mix</h4>
                      <p className="text-gray-400 text-sm">2 days ago • 3.2K views</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-black">
                      <img 
                        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/43b4a345-e192-445e-a9f3-d215bc1af065.png" 
                        alt="Hardstyle Wednesday stream thumbnail"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-bold">Hardstyle Wednesday</h4>
                      <p className="text-gray-400 text-sm">5 days ago • 5.8K views</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-black">
                      <img 
                        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/96dbd5cd-d4e6-4638-921e-be4893021d99.png" 
                        alt="Electronic Fusion Experiment stream thumbnail"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-bold">Electronic Fusion Experiment</h4>
                      <p className="text-gray-400 text-sm">1 week ago • 4.1K views</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="btn-cyber text-lg px-8 py-4">
                  🔔 Get Stream Notifications
                </Button>
                <Button variant="outline" className="btn-cyber-secondary text-lg px-8 py-4">
                  📱 Follow on Social Media
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}