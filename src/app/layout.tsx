import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { Providers } from '@/components/providers';
// import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'BaddBeatz - Professional DJ Portfolio & Music Platform',
    template: '%s | BaddBeatz'
  },
  description: 'Experience high-energy underground techno, hardstyle, and electronic music with TheBadGuyHimself. Book DJ services, listen to latest mixes, and join live streams.',
  keywords: ['DJ', 'electronic music', 'techno', 'hardstyle', 'house music', 'live streaming', 'European DJ', 'music producer', 'BaddBeatz'],
  authors: [{ name: 'TheBadGuyHimself', url: 'https://baddbeatz.com' }],
  creator: 'TheBadGuyHimself',
  publisher: 'BaddBeatz',
  metadataBase: new URL('https://baddbeatz.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://baddbeatz.com',
    siteName: 'BaddBeatz',
    title: 'BaddBeatz - Professional DJ Portfolio & Music Platform',
    description: 'Experience high-energy underground techno, hardstyle, and electronic music with TheBadGuyHimself.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BaddBeatz - TheBadGuyHimself DJ Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thebadguyhimself',
    creator: '@thebadguyhimself',
    title: 'BaddBeatz - Professional DJ Portfolio & Music Platform',
    description: 'Experience high-energy underground techno, hardstyle, and electronic music.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'Music & Entertainment',
  other: {
    'theme-color': '#ff0033',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'BaddBeatz',
    'application-name': 'BaddBeatz',
    'msapplication-TileColor': '#ff0033',
    'msapplication-navbutton-color': '#ff0033',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://soundcloud.com" />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://api.baddbeatz.com" />
        <link rel="dns-prefetch" href="https://cdn.baddbeatz.com" />
        
        {/* PWA Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff0033" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "TheBadGuyHimself",
              "alternateName": "BaddBeatz",
              "url": "https://baddbeatz.com",
              "image": "https://baddbeatz.com/images/TBG-himself.jpeg",
              "logo": "https://baddbeatz.com/images/Logo.png",
              "description": "Professional DJ specializing in underground techno, hardstyle, and electronic music across Europe",
              "genre": ["Electronic", "Techno", "Hardstyle", "House", "Hardcore"],
              "foundingDate": "2020",
              "foundingLocation": {
                "@type": "Place",
                "name": "Europe"
              },
              "member": {
                "@type": "Person",
                "name": "TheBadGuyHimself",
                "url": "https://baddbeatz.com/about",
                "jobTitle": "DJ/Producer"
              },
              "sameAs": [
                "https://soundcloud.com/thebadguyhimself",
                "https://www.youtube.com/@TheBadGuyHimself",
                "https://www.facebook.com/thebadguyhimself",
                "https://www.instagram.com/thebadguyhimself",
                "https://twitter.com/thebadguyhimself",
                "https://www.tiktok.com/@thebadguyhimself"
              ]
            })
          }}
        />
      </head>
      <body className="font-inter bg-black text-white min-h-screen antialiased">
        <Providers>
          {children}
          {/* <Toaster 
            position="bottom-right"
            theme="dark"
            richColors
            expand
            visibleToasts={5}
            closeButton
          /> */}
        </Providers>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}