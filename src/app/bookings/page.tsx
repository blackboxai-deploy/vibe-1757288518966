'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

interface BookingForm {
  eventName: string;
  eventDate: string;
  eventType: string;
  venue: string;
  expectedGuests: string;
  duration: string;
  budget: string;
  musicStyle: string[];
  specialRequests: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
}

const eventTypes = [
  'Club Night',
  'Private Party',
  'Wedding',
  'Corporate Event',
  'Festival',
  'Birthday Party',
  'Rave/Underground Event',
  'Other'
];

const musicStyles = [
  'Techno',
  'Hardstyle',
  'House',
  'Electronic',
  'Hardcore',
  'Trance',
  'Progressive',
  'Industrial'
];

export default function BookingsPage() {
  const [formData, setFormData] = useState<BookingForm>({
    eventName: '',
    eventDate: '',
    eventType: '',
    venue: '',
    expectedGuests: '',
    duration: '',
    budget: '',
    musicStyle: [],
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    organization: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMusicStyleChange = (style: string) => {
    setFormData(prev => ({
      ...prev,
      musicStyle: prev.musicStyle.includes(style)
        ? prev.musicStyle.filter(s => s !== style)
        : [...prev.musicStyle, style]
    }));
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
            <div className="text-6xl mb-8">✅</div>
            <h1 className="text-4xl font-orbitron font-bold text-green-400 mb-8">
              Booking Request Submitted!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your booking request. TheBadGuyHimself will review your details and get back to you within 24 hours.
            </p>
            <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">What happens next?</h3>
              <ul className="text-left text-gray-300 space-y-2">
                <li>• Your request has been sent to TheBadGuyHimself</li>
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Expect a detailed response within 24 hours</li>
                <li>• We'll discuss pricing, availability, and requirements</li>
              </ul>
            </div>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  eventName: '', eventDate: '', eventType: '', venue: '', expectedGuests: '',
                  duration: '', budget: '', musicStyle: [], specialRequests: '', contactName: '',
                  contactEmail: '', contactPhone: '', organization: ''
                });
              }}
              className="btn-cyber"
            >
              Submit Another Booking
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
            BOOK PERFORMANCE
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 neon-text-secondary mb-8">
            Bring Underground Electronic Energy to Your Event
          </p>
          <div className="max-w-4xl mx-auto">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0fa32193-cfd5-44ce-95f4-5c9c58cc5dcc.png" 
              alt="TheBadGuyHimself performing at packed venue with laser lights"
              className="w-full rounded-lg border border-red-500/30 shadow-2xl"
              loading="eager"
            />
          </div>
        </section>

        {/* Booking Form */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-gray-900/50 to-black/50 border border-red-500/30 rounded-lg p-8">
            <h2 className="text-3xl font-orbitron font-bold text-red-500 mb-8 text-center">
              Event Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Enter event name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Event Type *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    required
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Expected Guests</label>
                  <select
                    name="expectedGuests"
                    value={formData.expectedGuests}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select guest count</option>
                    <option value="50-100">50-100</option>
                    <option value="100-250">100-250</option>
                    <option value="250-500">250-500</option>
                    <option value="500-1000">500-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Venue Details *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="Venue name and city"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Performance Duration</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select duration</option>
                    <option value="1-2 hours">1-2 hours</option>
                    <option value="2-3 hours">2-3 hours</option>
                    <option value="3-4 hours">3-4 hours</option>
                    <option value="4+ hours">4+ hours</option>
                    <option value="All night">All night</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under €1,000">Under €1,000</option>
                    <option value="€1,000-€2,500">€1,000-€2,500</option>
                    <option value="€2,500-€5,000">€2,500-€5,000</option>
                    <option value="€5,000-€10,000">€5,000-€10,000</option>
                    <option value="€10,000+">€10,000+</option>
                  </select>
                </div>
              </div>

              {/* Music Style Preferences */}
              <div>
                <label className="block text-white font-semibold mb-4">Preferred Music Styles (select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {musicStyles.map(style => (
                    <label key={style} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.musicStyle.includes(style)}
                        onChange={() => handleMusicStyleChange(style)}
                        className="w-4 h-4 text-red-500 bg-black border-gray-600 rounded focus:ring-red-500"
                      />
                      <span className="text-white">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Special Requests / Additional Information</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none resize-none"
                  placeholder="Equipment requirements, special song requests, event theme, etc."
                />
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Organization/Company</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder="Company or organization name"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-cyber text-lg px-12 py-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
                <p className="text-sm text-gray-400 mt-4">
                  * Required fields. You'll receive a confirmation email within 24 hours.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Pricing Info */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-orbitron font-bold text-cyan-400 text-center mb-16">
              Performance Packages
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-gray-800/50 to-transparent border border-gray-500/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Club Set</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-6">€1,500+</div>
                <ul className="text-left text-gray-300 space-y-2 mb-6">
                  <li>• 2-3 hour performance</li>
                  <li>• Professional equipment</li>
                  <li>• Techno/Electronic focus</li>
                  <li>• Sound check included</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-b from-red-900/50 to-transparent border border-red-500/30 rounded-lg p-8 text-center transform scale-105">
                <h3 className="text-2xl font-bold text-white mb-4">Premium Event</h3>
                <div className="text-4xl font-bold text-red-400 mb-6">€3,500+</div>
                <ul className="text-left text-gray-300 space-y-2 mb-6">
                  <li>• 4+ hour performance</li>
                  <li>• Full production setup</li>
                  <li>• Multi-genre capability</li>
                  <li>• Custom mix preparation</li>
                  <li>• Technical support</li>
                </ul>
                <div className="text-red-400 font-bold">Most Popular</div>
              </div>
              
              <div className="bg-gradient-to-b from-purple-900/50 to-transparent border border-purple-500/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Festival Main Stage</h3>
                <div className="text-4xl font-bold text-purple-400 mb-6">€7,500+</div>
                <ul className="text-left text-gray-300 space-y-2 mb-6">
                  <li>• Main stage performance</li>
                  <li>• Full production rider</li>
                  <li>• Live streaming setup</li>
                  <li>• Exclusive track previews</li>
                  <li>• VIP meet & greet</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}