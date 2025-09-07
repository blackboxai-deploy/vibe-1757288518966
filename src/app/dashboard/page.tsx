'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useStreamSocket } from '@/hooks/use-socket';

interface DashboardStats {
  totalPlays: number;
  liveViewers: number;
  upcomingEvents: number;
  totalFollowers: number;
}

interface RecentActivity {
  id: string;
  type: 'play' | 'follow' | 'booking' | 'comment';
  description: string;
  timestamp: string;
  user?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPlays: 0,
    liveViewers: 0,
    upcomingEvents: 0,
    totalFollowers: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real-time socket connection
  const { viewers, messages } = useStreamSocket();
  
  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalPlays: 125430,
        liveViewers: viewers || 247,
        upcomingEvents: 3,
        totalFollowers: 8924,
      });

      setRecentActivity([
        {
          id: '1',
          type: 'play',
          description: 'Underground Techno Mix #47 reached 1K plays',
          timestamp: '2 minutes ago',
        },
        {
          id: '2',
          type: 'follow',
          description: 'ElectroFan2024 started following you',
          timestamp: '15 minutes ago',
          user: 'ElectroFan2024',
        },
        {
          id: '3',
          type: 'booking',
          description: 'New booking request for December 15th',
          timestamp: '1 hour ago',
        },
        {
          id: '4',
          type: 'comment',
          description: 'TechnoLover commented on Hardstyle Mayhem Vol. 12',
          timestamp: '2 hours ago',
          user: 'TechnoLover',
        },
        {
          id: '5',
          type: 'play',
          description: 'Electronic Fusion hit 500 plays milestone',
          timestamp: '3 hours ago',
        },
      ]);

      setLoading(false);
    };

    loadDashboardData();
  }, [viewers]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return '🎵';
      case 'follow':
        return '👥';
      case 'booking':
        return '📅';
      case 'comment':
        return '💬';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-400 text-xl">Loading dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Header */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-orbitron font-bold neon-text mb-2">
                  DJ Dashboard
                </h1>
                <p className="text-xl text-cyan-400">
                  Welcome back, TheBadGuyHimself
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button asChild className="btn-cyber">
                  <Link href="/live">
                    🔴 Go Live
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="btn-cyber-secondary">
                  <Link href="/music">
                    🎵 Upload Mix
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="bg-gradient-to-br from-red-900/30 to-red-600/10 border border-red-500/30 rounded-lg p-6 hover:border-red-500 transition-all duration-300"
                variants={fadeInUp}
              >
                <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
                  {stats.totalPlays.toLocaleString()}
                </div>
                <div className="text-gray-300 text-sm md:text-base">Total Plays</div>
                <div className="text-xs text-red-400 mt-2">+12% this month</div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-cyan-900/30 to-cyan-600/10 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500 transition-all duration-300"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400">
                    {stats.liveViewers}
                  </div>
                </div>
                <div className="text-gray-300 text-sm md:text-base">Live Viewers</div>
                <div className="text-xs text-cyan-400 mt-2">Currently active</div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-green-900/30 to-green-600/10 border border-green-500/30 rounded-lg p-6 hover:border-green-500 transition-all duration-300"
                variants={fadeInUp}
              >
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                  {stats.upcomingEvents}
                </div>
                <div className="text-gray-300 text-sm md:text-base">Upcoming Events</div>
                <div className="text-xs text-green-400 mt-2">Next: Dec 15th</div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-purple-900/30 to-purple-600/10 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 transition-all duration-300"
                variants={fadeInUp}
              >
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                  {stats.totalFollowers.toLocaleString()}
                </div>
                <div className="text-gray-300 text-sm md:text-base">Followers</div>
                <div className="text-xs text-purple-400 mt-2">+5% this week</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
            
            {/* Recent Activity */}
            <motion.div 
              className="lg:col-span-2"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-orbitron font-bold text-red-500 mb-6">
                Recent Activity
              </h2>
              
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="text-2xl">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300">{activity.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-6">
                  View All Activity
                </Button>
              </div>
            </motion.div>

            {/* Quick Actions & Live Chat */}
            <motion.div 
              className="space-y-8"
              variants={fadeInUp}
            >
              {/* Quick Actions */}
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-cyan-500 mb-6">
                  Quick Actions
                </h2>
                
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
                  <Button asChild className="w-full btn-cyber">
                    <Link href="/admin">
                      ⚙️ Admin Panel
                    </Link>
                  </Button>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/bookings">
                      📅 Manage Bookings
                    </Link>
                  </Button>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/analytics">
                      📊 View Analytics
                    </Link>
                  </Button>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/settings">
                      🔧 Settings
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Live Chat Preview */}
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-green-500 mb-6">
                  Live Chat
                </h2>
                
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <div className="h-64 overflow-y-auto space-y-3 mb-4">
                    {messages.slice(-5).map((message, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-cyan-400">{message.username}:</span>
                        <span className="text-gray-300 ml-2">{message.content}</span>
                      </div>
                    ))}
                    
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No recent messages
                      </div>
                    )}
                  </div>
                  
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/live">
                      💬 Join Live Chat
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}