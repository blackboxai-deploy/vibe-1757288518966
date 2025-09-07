import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Music & Mixes',
  description: 'Listen to the latest mixes and tracks from TheBadGuyHimself featuring high-energy techno, hardstyle, and underground electronic music.',
  openGraph: {
    title: 'Music & Mixes | BaddBeatz',
    description: 'Stream the latest electronic music mixes and tracks from TheBadGuyHimself.',
    images: ['/images/music-hero.jpg'],
  },
};

export default function MusicPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/902df5ff-1778-44e6-b409-feb199683ee9.png" 
              alt="Professional DJ mixing console with equalizer visualization"
              className="w-full h-full object-cover opacity-50"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold neon-text mb-8 animate-fade-in-up">
              MUSIC & MIXES
            </h1>
            <p className="text-xl md:text-2xl text-cyan-400 neon-text-secondary mb-12 font-light animate-fade-in-up">
              Experience the Sound of Underground Electronic Music
            </p>
            
            {/* Audio Player Controls */}
            <div className="bg-black/60 backdrop-blur-lg border border-red-500/30 rounded-lg p-6 mb-8 max-w-2xl mx-auto animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <div className="text-white font-bold">Currently Playing</div>
                  <div className="text-cyan-400">Underground Techno Mix #47</div>
                </div>
                <div className="text-red-400 font-mono">128 BPM</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600">
                  ⏯️
                </Button>
                <div className="flex-1 bg-gray-800 rounded-full h-2 relative">
                  <div className="bg-gradient-to-r from-red-500 to-cyan-500 h-2 rounded-full w-1/3"></div>
                </div>
                <div className="text-sm text-gray-400">12:34 / 45:22</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Mixes Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-orbitron font-bold text-red-500 text-center mb-16">
              Featured Mixes
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Mix Card 1 */}
              <div className="bg-gradient-to-b from-red-900/20 to-transparent border border-red-500/30 rounded-lg overflow-hidden hover:border-red-500/60 transition-all duration-300 group">
                <div className="relative aspect-square">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d6bfe100-0737-4e69-af9c-cc21dc480ee3.png" 
                    alt="Underground Techno Mix 47 album cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Underground Techno Mix #47</h3>
                    <p className="text-red-400 text-sm">45 minutes • 128-135 BPM</p>
                  </div>
                  <Button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500">
                    ▶️
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-4">
                    Deep underground techno journey featuring exclusive tracks and cutting-edge production.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 text-sm">🎧 12.5K plays</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">Download</Button>
                      <Button size="sm" variant="outline" className="text-xs">Share</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mix Card 2 */}
              <div className="bg-gradient-to-b from-cyan-900/20 to-transparent border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-500/60 transition-all duration-300 group">
                <div className="relative aspect-square">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/24accf50-e090-4977-9f96-4e1e2f38911d.png" 
                    alt="Hardstyle Mayhem Volume 12 album cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Hardstyle Mayhem Vol. 12</h3>
                    <p className="text-cyan-400 text-sm">52 minutes • 145-155 BPM</p>
                  </div>
                  <Button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cyan-500/80 hover:bg-cyan-500">
                    ▶️
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-4">
                    High-energy hardstyle bangers that will blow your mind. Pure euphoric madness.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 text-sm">🎧 8.7K plays</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">Download</Button>
                      <Button size="sm" variant="outline" className="text-xs">Share</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mix Card 3 */}
              <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/30 rounded-lg overflow-hidden hover:border-purple-500/60 transition-all duration-300 group">
                <div className="relative aspect-square">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/700d9fae-baee-4499-8989-a34221a68acf.png" 
                    alt="Electronic Fusion Experimental Mix cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Electronic Fusion</h3>
                    <p className="text-purple-400 text-sm">38 minutes • Variable BPM</p>
                  </div>
                  <Button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-purple-500/80 hover:bg-purple-500">
                    ▶️
                  </Button>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-4">
                    Experimental electronic sounds blending genres and pushing boundaries.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 text-sm">🎧 15.2K plays</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">Download</Button>
                      <Button size="sm" variant="outline" className="text-xs">Share</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Music Categories */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-orbitron font-bold text-cyan-400 text-center mb-16">
              Music Categories
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold text-red-500">Techno</h3>
                <p className="text-gray-300">Raw underground techno beats from 128-135 BPM</p>
                <Button asChild variant="outline">
                  <Link href="/music?category=techno">Browse Techno</Link>
                </Button>
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-cyan-500">Hardstyle</h3>
                <p className="text-gray-300">High-energy hardstyle from 145-165 BPM</p>
                <Button asChild variant="outline">
                  <Link href="/music?category=hardstyle">Browse Hardstyle</Link>
                </Button>
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🌊</div>
                <h3 className="text-2xl font-bold text-purple-500">Electronic</h3>
                <p className="text-gray-300">Experimental electronic and fusion sounds</p>
                <Button asChild variant="outline">
                  <Link href="/music?category=electronic">Browse Electronic</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Streaming Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-orbitron font-bold text-red-500 mb-8">
              🔴 LIVE NOW
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join the live stream and experience electronic music in real-time
            </p>
            
            <div className="bg-gradient-to-r from-red-900/20 to-cyan-900/20 border border-red-500/30 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="aspect-video bg-black rounded-lg mb-6 relative overflow-hidden">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3fa8ef3d-4d09-4bf0-888a-057e678b47aa.png" 
                  alt="Live stream preview showing DJ performance"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-bold animate-pulse">
                  ● LIVE
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  👥 1,247 watching
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Underground Saturday Session</h3>
              <p className="text-gray-300 mb-6">Deep techno journey • Started 2 hours ago</p>
              
              <div className="flex justify-center space-x-4">
                <Button asChild className="btn-cyber">
                  <Link href="/live">Join Live Stream</Link>
                </Button>
                <Button variant="outline" className="btn-cyber-secondary">
                  Set Reminder
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-gradient-to-r from-black to-gray-900/50">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-orbitron font-bold text-white mb-8">
              Want Custom Mixes?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Get personalized mixes tailored to your event or personal taste
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild className="btn-cyber text-lg px-8 py-4">
                <Link href="/contact">
                  🎵 Request Custom Mix
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="btn-cyber-secondary text-lg px-8 py-4">
                <Link href="/bookings">
                  📅 Book DJ Set
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}