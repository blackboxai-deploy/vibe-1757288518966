import { Hero } from '@/components/sections/hero';
import { FeaturedMix } from '@/components/sections/featured-mix';
import { LatestVideos } from '@/components/sections/latest-videos';
import { AiChat } from '@/components/sections/ai-chat';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
          <section className="fade-in">
            <h2 className="text-3xl font-orbitron font-bold text-red-500 text-center mb-8">
              Who is TheBadGuyHimself?
            </h2>
            <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
              With over 4 years of electrifying dancefloors, he blends explosive techno, rawstyle bangers, 
              and seamless transitions to keep crowds locked in the groove. Experience the energy that 
              defines underground electronic music.
            </p>
          </section>
          
          <FeaturedMix />
          <LatestVideos />
          <AiChat />
        </div>
      </main>
      <Footer />
    </>
  );
}