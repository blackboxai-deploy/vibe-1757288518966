'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-500/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d09039f0-8694-43a9-ae46-d9f8e1d30f05.png"
                alt="BaddBeatz Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/music" className="nav-link">Music</Link>
              <Link href="/playlist" className="nav-link">Playlist</Link>
              <Link href="/videos" className="nav-link">Videos</Link>
              <Link href="/gallery" className="nav-link">Gallery</Link>
              <Link href="/bookings" className="nav-link">Bookings</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
              <Link href="/files" className="nav-link">Files</Link>
              <Link href="/login" className="nav-link nav-link-special">🎵 Join Community</Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="block h-6 w-6">
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 rounded-lg mt-2">
            <Link href="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="mobile-nav-link" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/music" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Music</Link>
            <Link href="/playlist" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Playlist</Link>
            <Link href="/videos" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Videos</Link>
            <Link href="/gallery" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link href="/bookings" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Bookings</Link>
            <Link href="/contact" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link href="/files" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Files</Link>
            <Link href="/login" className="mobile-nav-link mobile-nav-link-special" onClick={() => setIsOpen(false)}>🎵 Join Community</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}