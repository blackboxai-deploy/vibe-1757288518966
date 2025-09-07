export function AiChat() {
  return (
    <section className="cyber-card p-8">
      <h2 className="text-3xl font-orbitron font-bold text-red-500 text-center mb-6">
        🎤 Ask the DJ (Premium Feature)
      </h2>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-300 text-center mb-4">
          Curious about TheBadGuyHimself's setup, vibe, or availability? Ask below!
        </p>
        <p className="text-sm text-yellow-400 text-center mb-8">
          Responses come from an AI and may contain errors.
        </p>
        
        <div className="space-y-4">
          <textarea 
            placeholder="Type your question..."
            className="w-full p-4 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
            rows={4}
          />
          
          <div className="flex justify-center">
            <button className="btn-cyber px-8 py-3">
              Ask
            </button>
          </div>
          
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
            <p className="text-gray-400 text-center">
              AI responses will appear here...
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-red-400 text-sm">
              This is a premium feature. Please login and upgrade to premium to use the AI chat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}