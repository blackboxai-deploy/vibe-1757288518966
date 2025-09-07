import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About TheBadGuyHimself',
  description: 'Learn about TheBadGuyHimself, a professional DJ specializing in high-energy underground techno, hardstyle, and electronic music across Europe.',
  openGraph: {
    title: 'About TheBadGuyHimself | BaddBeatz',
    description: 'Professional DJ with 4+ years of experience in underground electronic music.',
    images: ['/images/about-hero.jpg'],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d605cbbd-3362-45a1-b045-b0a4dba25308.png" 
              alt="TheBadGuyHimself performing at major electronic music festival"
              className="w-full h-full object-cover opacity-40"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold neon-text mb-8 animate-fade-in-up">
              THEBADGUYHIMSELF
            </h1>
            <p className="text-xl md:text-2xl text-cyan-400 neon-text-secondary mb-8 font-light animate-fade-in-up">
              4+ Years of Electrifying Underground Electronic Music
            </p>
            <div className="flex justify-center animate-fade-in-up">
              <Button asChild className="btn-cyber text-lg px-8 py-4">
                <Link href="/bookings">
                  📅 Book a Performance
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-orbitron font-bold text-red-500 mb-8">
                  The Journey
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  From underground clubs to major festival stages, TheBadGuyHimself has been pushing the boundaries of electronic music for over 4 years. Specializing in high-energy techno, crushing hardstyle, and mind-bending electronic soundscapes.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Based across Europe, this DJ has mastered the art of reading crowds and delivering exactly what the dancefloor craves. Every set is a journey through sound, taking listeners from deep, hypnotic grooves to explosive peak-time madness.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  The signature style blends raw techno power with hardstyle intensity, creating an unforgettable experience that leaves audiences wanting more.
                </p>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden border border-red-500/30 shadow-2xl shadow-red-500/20">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b4fb3153-9c7e-4f19-a482-8ea1d65368ea.png" 
                    alt="TheBadGuyHimself professional DJ portrait with studio setup"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-cyan-500/20 rounded-lg blur-xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-orbitron font-bold text-cyan-400 mb-16">
              Performance Stats
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="text-5xl font-bold text-red-500 neon-text">4+</div>
                <div className="text-xl text-gray-300">Years Experience</div>
              </div>
              
              <div className="space-y-4">
                <div className="text-5xl font-bold text-cyan-400 neon-text">100K+</div>
                <div className="text-xl text-gray-300">Tracks Played</div>
              </div>
              
              <div className="space-y-4">
                <div className="text-5xl font-bold text-green-400 neon-text">50+</div>
                <div className="text-xl text-gray-300">Live Performances</div>
              </div>
              
              <div className="space-y-4">
                <div className="text-5xl font-bold text-purple-400 neon-text">∞</div>
                <div className="text-xl text-gray-300">Energy Level</div>
              </div>
            </div>
          </div>
        </section>

        {/* Music Style Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-orbitron font-bold text-center text-red-500 mb-16">
              Musical DNA
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-red-900/20 to-transparent border border-red-500/30 rounded-lg p-8 hover:border-red-500/60 transition-all duration-300">
                <h3 className="text-2xl font-bold text-red-400 mb-4">🔥 Techno</h3>
                <p className="text-gray-300">
                  Raw, driving techno beats that penetrate deep into your soul. Industrial soundscapes meets underground groove.
                </p>
              </div>
              
              <div className="bg-gradient-to-b from-cyan-900/20 to-transparent border border-cyan-500/30 rounded-lg p-8 hover:border-cyan-500/60 transition-all duration-300">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">⚡ Hardstyle</h3>
                <p className="text-gray-300">
                  Crushing kicks and euphoric melodies that lift the crowd to another dimension. Pure energy in audio form.
                </p>
              </div>
              
              <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/30 rounded-lg p-8 hover:border-purple-500/60 transition-all duration-300">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">🌊 Electronic</h3>
                <p className="text-gray-300">
                  Experimental sounds and cutting-edge production techniques that push electronic music into the future.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Equipment Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-black to-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-orbitron font-bold text-center text-cyan-400 mb-16">
              Professional Setup
            </h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-red-500">🎛️ DJ Equipment</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Pioneer CDJ-3000 x2</li>
                    <li>• Pioneer DJM-900NXS2</li>
                    <li>• Technics SL-1200MK7 Turntables</li>
                    <li>• Native Instruments Traktor Pro 3</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-cyan-500">🎧 Audio Gear</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Sennheiser HD25 Headphones</li>
                    <li>• Pioneer HRM-7 Studio Monitors</li>
                    <li>• Focusrite Scarlett 18i20 Interface</li>
                    <li>• Custom Flight Cases</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden border border-cyan-500/30">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6553352f-94fa-4bc3-bf2d-b68432d64f90.png" 
                    alt="Professional DJ equipment setup with Pioneer CDJs and mixer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-orbitron font-bold text-white mb-8">
              Ready to Experience the Energy?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Book TheBadGuyHimself for your next event and witness the power of true underground electronic music.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild className="btn-cyber text-lg px-8 py-4">
                <Link href="/bookings">
                  📅 Book Performance
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="btn-cyber-secondary text-lg px-8 py-4">
                <Link href="/music">
                  🎵 Listen to Mixes
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="btn-cyber-secondary text-lg px-8 py-4">
                <Link href="/contact">
                  📞 Get in Touch
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