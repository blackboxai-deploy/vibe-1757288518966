'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const contactCategories = [
  'Booking Inquiry',
  'Collaboration',
  'Press/Media',
  'Technical Support',
  'Fan Mail',
  'Business Partnership',
  'Other'
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="text-6xl mb-8">📧</div>
            <h1 className="text-4xl font-orbitron font-bold text-green-400 mb-8">
              Message Sent Successfully!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for reaching out! Your message has been received and TheBadGuyHimself will get back to you within 24-48 hours.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', subject: '', category: '', message: '' });
              }}
              className="btn-cyber"
            >
              Send Another Message
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold neon-text mb-8">
            GET IN TOUCH
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 neon-text-secondary mb-8">
            Connect with TheBadGuyHimself
          </p>
        </section>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="bg-gradient-to-b from-gray-900/50 to-black/50 border border-red-500/30 rounded-lg p-8">
              <h2 className="text-3xl font-orbitron font-bold text-red-500 mb-8">
                Send a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      required
                    >
                      <option value="">Select category</option>
                      {contactCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="Message subject"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Your message..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-cyber text-lg py-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                
                <p className="text-sm text-gray-400 text-center">
                  * Required fields. Response time: 24-48 hours
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="bg-gradient-to-b from-cyan-900/20 to-transparent border border-cyan-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-orbitron font-bold text-cyan-400 mb-6">
                Direct Contact
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-gray-300">booking@baddbeatz.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📱</div>
                  <div>
                    <div className="text-white font-semibold">WhatsApp</div>
                    <div className="text-gray-300">+31 6 1234 5678</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <div className="text-white font-semibold">Location</div>
                    <div className="text-gray-300">Netherlands/Europe</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <div className="text-white font-semibold">Response Time</div>
                    <div className="text-gray-300">24-48 hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-orbitron font-bold text-purple-400 mb-6">
                Follow the Journey
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://soundcloud.com/thebadguyhimself" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="text-2xl">🎵</div>
                  <div>
                    <div className="text-white font-semibold">SoundCloud</div>
                    <div className="text-gray-300 text-sm">Latest Mixes</div>
                  </div>
                </a>
                
                <a 
                  href="https://youtube.com/@thebadguyhimself" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="text-2xl">📹</div>
                  <div>
                    <div className="text-white font-semibold">YouTube</div>
                    <div className="text-gray-300 text-sm">Live Streams</div>
                  </div>
                </a>
                
                <a 
                  href="https://instagram.com/thebadguyhimself" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="text-2xl">📸</div>
                  <div>
                    <div className="text-white font-semibold">Instagram</div>
                    <div className="text-gray-300 text-sm">Behind Scenes</div>
                  </div>
                </a>
                
                <a 
                  href="https://facebook.com/thebadguyhimself" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="text-2xl">👥</div>
                  <div>
                    <div className="text-white font-semibold">Facebook</div>
                    <div className="text-gray-300 text-sm">Events</div>
                  </div>
                </a>
                
                <a 
                  href="https://twitter.com/thebadguyhimself" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="text-2xl">🐦</div>
                  <div>
                    <div className="text-white font-semibold">Twitter</div>
                    <div className="text-gray-300 text-sm">Updates</div>
                  </div>
                </a>
                
                <a 
                  href="https://discord.gg/thebadguyhimself" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="text-2xl">💬</div>
                  <div>
                    <div className="text-white font-semibold">Discord</div>
                    <div className="text-gray-300 text-sm">Community</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-b from-green-900/20 to-transparent border border-green-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-orbitron font-bold text-green-400 mb-6">
                Quick Actions
              </h3>
              
              <div className="space-y-4">
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  📅 Book Performance
                </Button>
                <Button className="w-full" variant="outline">
                  🎵 Request Custom Mix
                </Button>
                <Button className="w-full" variant="outline">
                  📰 Press Kit Download
                </Button>
                <Button className="w-full" variant="outline">
                  💼 Business Partnership
                </Button>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-gradient-to-b from-yellow-900/20 to-transparent border border-yellow-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-orbitron font-bold text-yellow-400 mb-6">
                Frequently Asked
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-white font-semibold">🎧 Do you take track requests?</div>
                  <div className="text-gray-300">Yes! Send them via live chat or social media.</div>
                </div>
                
                <div>
                  <div className="text-white font-semibold">📅 How far in advance should I book?</div>
                  <div className="text-gray-300">At least 4-6 weeks for major events.</div>
                </div>
                
                <div>
                  <div className="text-white font-semibold">🌍 Do you travel internationally?</div>
                  <div className="text-gray-300">Yes! Available throughout Europe and beyond.</div>
                </div>
                
                <div>
                  <div className="text-white font-semibold">🎵 Can you play other genres?</div>
                  <div className="text-gray-300">Techno/Hardstyle focus, but flexible for events.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}