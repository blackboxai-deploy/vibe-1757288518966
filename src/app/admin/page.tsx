'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRequireAdmin } from '@/hooks/use-auth';

interface Mix {
  id: string;
  title: string;
  duration: string;
  plays: number;
  likes: number;
  status: 'published' | 'draft' | 'private';
  uploadDate: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'dj';
  joinDate: string;
  status: 'active' | 'suspended' | 'banned';
}

interface Booking {
  id: string;
  eventName: string;
  clientName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  fee: number;
}

export default function AdminPage() {
  const { loading } = useRequireAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Simulate loading admin data
    const loadAdminData = async () => {
      setDataLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMixes([
        {
          id: '1',
          title: 'Underground Techno Mix #47',
          duration: '45:22',
          plays: 12543,
          likes: 892,
          status: 'published',
          uploadDate: '2024-12-01',
        },
        {
          id: '2',
          title: 'Hardstyle Mayhem Vol. 12',
          duration: '52:15',
          plays: 8742,
          likes: 654,
          status: 'published',
          uploadDate: '2024-11-28',
        },
        {
          id: '3',
          title: 'Electronic Fusion (Draft)',
          duration: '38:44',
          plays: 0,
          likes: 0,
          status: 'draft',
          uploadDate: '2024-12-05',
        },
      ]);

      setUsers([
        {
          id: '1',
          username: 'ElectroFan2024',
          email: 'fan@example.com',
          role: 'user',
          joinDate: '2024-01-15',
          status: 'active',
        },
        {
          id: '2',
          username: 'TechnoLover',
          email: 'lover@example.com',
          role: 'user',
          joinDate: '2024-03-22',
          status: 'active',
        },
        {
          id: '3',
          username: 'SpamBot123',
          email: 'spam@example.com',
          role: 'user',
          joinDate: '2024-12-01',
          status: 'suspended',
        },
      ]);

      setBookings([
        {
          id: '1',
          eventName: 'New Year Electronic Festival',
          clientName: 'Event Productions Inc',
          date: '2024-12-31',
          status: 'confirmed',
          fee: 2500,
        },
        {
          id: '2',
          eventName: 'Private Party',
          clientName: 'John Smith',
          date: '2024-12-15',
          status: 'pending',
          fee: 800,
        },
      ]);

      setDataLoading(false);
    };

    if (!loading) {
      loadAdminData();
    }
  }, [loading]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400 text-xl">Verifying admin access...</p>
          </div>
        </main>
      </>
    );
  }

  const getStatusBadge = (status: string, type: 'mix' | 'user' | 'booking') => {
    const baseClasses = 'px-2 py-1 text-xs rounded-full font-medium';
    
    if (type === 'mix') {
      switch (status) {
        case 'published':
          return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
        case 'draft':
          return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
        case 'private':
          return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`;
      }
    }
    
    if (type === 'user') {
      switch (status) {
        case 'active':
          return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
        case 'suspended':
          return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
        case 'banned':
          return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      }
    }
    
    if (type === 'booking') {
      switch (status) {
        case 'confirmed':
          return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
        case 'pending':
          return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
        case 'cancelled':
          return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      }
    }
    
    return baseClasses;
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Header */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold neon-text mb-4">
                Admin Panel
              </h1>
              <p className="text-xl text-cyan-400">
                Manage content, users, and bookings
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs */}
        <section className="px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'mixes', label: 'Mixes', icon: '🎵' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'bookings', label: 'Bookings', icon: '📅' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  } transition-colors`}
                >
                  {tab.icon} {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {dataLoading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading admin data...</p>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    <div className="bg-gradient-to-br from-red-900/30 to-red-600/10 border border-red-500/30 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-red-400 mb-2">Total Mixes</h3>
                      <div className="text-3xl font-bold text-white">{mixes.length}</div>
                      <div className="text-sm text-red-400 mt-2">
                        {mixes.filter(m => m.status === 'published').length} published
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-600/10 border border-cyan-500/30 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-cyan-400 mb-2">Active Users</h3>
                      <div className="text-3xl font-bold text-white">
                        {users.filter(u => u.status === 'active').length}
                      </div>
                      <div className="text-sm text-cyan-400 mt-2">
                        {users.length} total users
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-900/30 to-green-600/10 border border-green-500/30 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-green-400 mb-2">Confirmed Bookings</h3>
                      <div className="text-3xl font-bold text-white">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </div>
                      <div className="text-sm text-green-400 mt-2">
                        {bookings.filter(b => b.status === 'pending').length} pending
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/10 border border-purple-500/30 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-purple-400 mb-2">Total Revenue</h3>
                      <div className="text-3xl font-bold text-white">
                        ${bookings.reduce((sum, b) => sum + b.fee, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-400 mt-2">This month</div>
                    </div>
                  </motion.div>
                )}

                {/* Mixes Tab */}
                {activeTab === 'mixes' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-orbitron font-bold text-red-500">
                        Manage Mixes
                      </h2>
                      <Button className="btn-cyber">
                        ➕ Upload New Mix
                      </Button>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-800/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Duration
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Plays
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {mixes.map((mix) => (
                              <tr key={mix.id} className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{mix.title}</div>
                                  <div className="text-sm text-gray-400">{mix.uploadDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {mix.duration}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {mix.plays.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={getStatusBadge(mix.status, 'mix')}>
                                    {mix.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <Button size="sm" variant="outline">
                                    ✏️ Edit
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-400">
                                    🗑️ Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-500">
                      User Management
                    </h2>
                    
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-800/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Join Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{user.username}</div>
                                  <div className="text-sm text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {user.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={getStatusBadge(user.status, 'user')}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {new Date(user.joinDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <Button size="sm" variant="outline">
                                    👁️ View
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-yellow-400">
                                    ⏸️ Suspend
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-400">
                                    🚫 Ban
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-orbitron font-bold text-green-500">
                      Booking Management
                    </h2>
                    
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-800/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Event
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Client
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Fee
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {bookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-gray-800/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{booking.eventName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {booking.clientName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {new Date(booking.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                                  ${booking.fee}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={getStatusBadge(booking.status, 'booking')}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <Button size="sm" variant="outline" className="text-green-400">
                                    ✅ Confirm
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-400">
                                    ❌ Cancel
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Other tabs placeholder */}
                {['analytics', 'settings'].includes(activeTab) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-4">
                      {activeTab === 'analytics' ? 'Analytics' : 'Settings'} Coming Soon
                    </h2>
                    <p className="text-gray-400">
                      This section is under development and will be available soon.
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}