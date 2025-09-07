export function FeaturedMix() {
  return (
    <section className="cyber-card p-8">
      <h2 className="text-3xl font-orbitron font-bold text-red-500 text-center mb-8">
        🔥 Featured Mix
      </h2>
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
          <p className="text-gray-400">SoundCloud Player - Coming Soon</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            <a href="https://soundcloud.com/thebadguyhimself" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
              TBGxTheBadGuy
            </a>
            {' · '}
            <a href="https://soundcloud.com/thebadguyhimself/sets/house-mixes-2024" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
              House mixes 2024
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}