'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'performance' | 'studio' | 'event' | 'behind-scenes';
  date: string;
  venue?: string;
  location?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Underground Techno Night',
    description: 'Epic night at Amsterdam Underground with 2000+ ravers',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/67ba5cc7-5a35-4403-acba-484eb49394e0.png',
    category: 'performance',
    date: '2024-03-15',
    venue: 'Amsterdam Underground',
    location: 'Amsterdam, Netherlands'
  },
  {
    id: '2',
    title: 'Studio Session',
    description: 'Working on new hardstyle tracks in the studio',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cdd5f464-6058-43b5-b9a0-ea779c47dde3.png',
    category: 'studio',
    date: '2024-03-10',
    venue: 'BaddBeatz Studio'
  },
  {
    id: '3',
    title: 'Festival Main Stage',
    description: 'Headlining at Electronic Dreams Festival',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2b2be7df-d64c-4471-9da4-eac3d2fd7404.png',
    category: 'performance',
    date: '2024-02-28',
    venue: 'Electronic Dreams Festival',
    location: 'Berlin, Germany'
  },
  {
    id: '4',
    title: 'Behind the Scenes',
    description: 'Preparing for the big show backstage',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/10d5e403-38c6-4eb0-b0e6-28d4b67a25d3.png',
    category: 'behind-scenes',
    date: '2024-02-25'
  },
  {
    id: '5',
    title: 'Private Event VIP',
    description: 'Exclusive corporate event in Rotterdam',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/db0bbd34-e2ba-421e-9b38-446c57717204.png',
    category: 'event',
    date: '2024-02-20',
    venue: 'Maas Tower Penthouse',
    location: 'Rotterdam, Netherlands'
  },
  {
    id: '6',
    title: 'Equipment Showcase',
    description: 'Latest addition to the DJ arsenal - Pioneer CDJ-3000',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f32f2421-8c4c-469e-8fcf-93fc752a12e8.png',
    category: 'studio',
    date: '2024-02-15'
  },
  {
    id: '7',
    title: 'Warehouse Rave',
    description: 'Underground warehouse party with 1500 attendees',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/440637d9-1722-4fbb-9ec9-696ac327474f.png',
    category: 'performance',
    date: '2024-02-10',
    venue: 'Warehouse X',
    location: 'Utrecht, Netherlands'
  },
  {
    id: '8',
    title: 'Meet & Greet',
    description: 'Connecting with fans after the show',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/97815799-bead-4336-b939-d353d00b579c.png',
    category: 'behind-scenes',
    date: '2024-02-05'
  },
  {
    id: '9',
    title: 'Outdoor Festival',
    description: 'Summer festival vibes under the stars',
    imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0312d9cd-5aa8-425e-a8da-4586e56792d8.png',
    category: 'performance',
    date: '2024-01-30',
    venue: 'Summer Electronic Fest',
    location: 'Eindhoven, Netherlands'
  }
];

const categories = [
  { key: 'all', label: 'All Photos', icon: '📷' },
  { key: 'performance', label: 'Live Performances', icon: '🎤' },
  { key: 'studio', label: 'Studio Sessions', icon: '🎛️' },
  { key: 'event', label: 'Events', icon: '🎉' },
  { key: 'behind-scenes', label: 'Behind the Scenes', icon: '🎬' }
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold neon-text mb-8">
            GALLERY
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 neon-text-secondary mb-8">
            Visual Journey Through Electronic Music
          </p>
        </section>

        {/* Category Filter */}
        <section className="max-w-6xl mx-auto mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <Button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-transparent border-gray-600 text-gray-300 hover:border-red-500 hover:text-white'
                }`}
              >
                {category.icon} {category.label}
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Showing {filteredItems.length} {selectedCategory === 'all' ? 'photos' : `${selectedCategory} photos`}
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-black/50 border border-gray-600 hover:border-red-500 transition-all duration-300"
                onClick={() => openLightbox(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                    {item.venue && (
                      <p className="text-cyan-400 text-xs">📍 {item.venue}</p>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded capitalize">
                  {item.category.replace('-', ' ')}
                </div>

                {/* Date Badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-500 neon-text">50+</div>
              <div className="text-white">Live Shows</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-cyan-500 neon-text">25+</div>
              <div className="text-white">Venues</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-500 neon-text">100K+</div>
              <div className="text-white">Audience Reached</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-500 neon-text">10+</div>
              <div className="text-white">Countries</div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-full flex flex-col">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <Button onClick={closeLightbox} variant="ghost" className="text-white hover:text-red-500">
                ✕ Close
              </Button>
              <div className="text-white text-sm">
                {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} of {filteredItems.length}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              {/* Previous Button */}
              <Button
                onClick={prevImage}
                className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                ←
              </Button>

              {/* Image */}
              <div className="max-w-full max-h-[70vh]">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {/* Next Button */}
              <Button
                onClick={nextImage}
                className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                →
              </Button>
            </div>

            {/* Image Info */}
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300 mb-2">{selectedImage.description}</p>
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
                <span>📅 {new Date(selectedImage.date).toLocaleDateString()}</span>
                {selectedImage.venue && <span>🏢 {selectedImage.venue}</span>}
                {selectedImage.location && <span>📍 {selectedImage.location}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}