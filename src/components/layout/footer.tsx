import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7389318d-23af-4aee-97e5-4a13bd0eaa55.png"
                alt="BaddBeatz Logo" 
                className="h-12 w-auto mr-3"
              />
              <h3 className="text-2xl font-orbitron font-bold text-red-500">BaddBeatz</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Professional DJ portfolio featuring high-energy underground techno, hardstyle, 
              and electronic music. Experience the energy that defines underground electronic music.
            </p>
            <div className="flex space-x-4">
              <a href="https://soundcloud.com/thebadguyhimself" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                SoundCloud
              </a>
              <a href="https://www.youtube.com/@TheBadGuyHimself" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                YouTube
              </a>
              <a href="https://www.instagram.com/thebadguyhimself" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                Instagram
              </a>
              <a href="https://twitter.com/thebadguyhimself" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/music" className="text-gray-400 hover:text-white transition-colors">Music</Link></li>
              <li><Link href="/videos" className="text-gray-400 hover:text-white transition-colors">Videos</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/bookings" className="text-gray-400 hover:text-white transition-colors">Bookings</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/copyright" className="text-gray-400 hover:text-white transition-colors">Copyright</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 TheBadGuyHimself. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            Made with ❤️ for the electronic music community
          </p>
        </div>
      </div>
    </footer>
  );
}