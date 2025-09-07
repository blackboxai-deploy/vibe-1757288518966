export function LatestVideos() {
  return (
    <section className="cyber-card p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-orbitron font-bold text-red-500 mb-4">
          🎥 Latest Videos
        </h2>
        <p className="text-gray-300 mb-6">
          Check out my latest mixes and performances
        </p>
        <a 
          href="https://www.youtube.com/@TheBadGuyHimself/videos" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-cyber-secondary inline-flex items-center gap-2"
        >
          <span>▶️</span>
          Visit My YouTube Channel
        </a>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
          <p className="text-gray-400">YouTube Player - Coming Soon</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">Video {i}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-cyan-400 mb-4">
            🔔 Don't miss any new content!
          </p>
          <a 
            href="https://www.youtube.com/@TheBadGuyHimself?sub_confirmation=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-cyber"
          >
            Subscribe to TheBadGuyHimself
          </a>
        </div>
      </div>
    </section>
  );
}