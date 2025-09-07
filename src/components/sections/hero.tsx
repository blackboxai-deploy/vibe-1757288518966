'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/869b793f-be41-4cee-9635-fa2874d458f3.png" 
          alt="TheBadGuyHimself performing with vibrant lights"
          className="w-full h-full object-cover opacity-60"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold neon-text mb-6 glitch animate-fade-in-up">
          BADDBEATS by THEBADGUYHIMSELF
        </h1>
        
        <p className="text-xl md:text-2xl text-cyan-400 neon-text-secondary mb-12 font-light animate-fade-in-up">
          High-energy underground techno and hardstyle
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
          <Button asChild className="btn-cyber text-lg px-8 py-4">
            <Link href="/music">
              🎧 Listen to Mixes
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="btn-cyber-secondary text-lg px-8 py-4">
            <Link href="/gallery">
              📸 View Gallery
            </Link>
          </Button>
          
          <Button asChild className="btn-cyber text-lg px-8 py-4">
            <Link href="/bookings">
              📩 Book Now
            </Link>
          </Button>
        </div>

        {/* Animated audio bars */}
        <div className="mt-16 flex justify-center animate-fade-in-up">
          <div className="audio-bars">
            <div className="h-2"></div>
            <div className="h-4"></div>
            <div className="h-6"></div>
            <div className="h-3"></div>
            <div className="h-8"></div>
            <div className="h-2"></div>
            <div className="h-5"></div>
            <div className="h-4"></div>
            <div className="h-7"></div>
            <div className="h-3"></div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-1">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
      </div>
    </section>
  );
}