/**
 * SEO Enhancement Script
 * Adds structured data, improves meta tags, and generates sitemap
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Structured data for the DJ/Musician
 */
const musicianSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "TheBadGuyHimself",
  "alternateName": "BaddBeatz",
  "url": "https://baddbeatz.com",
  "image": "https://baddbeatz.com/assets/images/TBG-himself.jpeg",
  "logo": "https://baddbeatz.com/assets/images/Logo.png",
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
    "url": "https://baddbeatz.com/about.html",
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
};

/**
 * Event schema for live performances
 */
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  "name": "BaddBeatz Live Stream",
  "performer": {
    "@type": "MusicGroup",
    "name": "TheBadGuyHimself"
  },
  "description": "Live electronic music streaming with real-time interaction",
  "url": "https://baddbeatz.com/live.html",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://baddbeatz.com/live.html"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://baddbeatz.com/live.html"
  },
  "organizer": {
    "@type": "MusicGroup",
    "name": "TheBadGuyHimself",
    "url": "https://baddbeatz.com"
  }
};

/**
 * Page-specific meta data
 */
const pageMetaData = {
  'index.html': {
    title: 'TheBadGuyHimself - Electronic Music DJ | BaddBeatz',
    description: 'Experience high-energy underground techno, hardstyle, and electronic music with TheBadGuyHimself. Book DJ services, listen to latest mixes, and join live streams.',
    keywords: 'DJ, electronic music, techno, hardstyle, house music, live streaming, European DJ, music producer, BaddBeatz',
    schema: [musicianSchema]
  },
  'about.html': {
    title: 'About TheBadGuyHimself | Professional Electronic Music DJ',
    description: 'Learn about TheBadGuyHimself, a professional DJ with 4+ years experience electrifying dancefloors across Europe with explosive techno and rawstyle.',
    keywords: 'about DJ, electronic music artist, techno DJ biography, European DJ, music producer story',
    schema: [musicianSchema]
  },
  'music.html': {
    title: 'Music & Mixes | TheBadGuyHimself Electronic DJ Sets',
    description: 'Listen to the latest electronic music mixes, techno sets, and hardstyle tracks by TheBadGuyHimself. Stream high-quality DJ sets and exclusive releases.',
    keywords: 'DJ mixes, techno music, hardstyle tracks, electronic music sets, free DJ mixes, streaming music',
    schema: [musicianSchema, {
      "@context": "https://schema.org",
      "@type": "MusicPlaylist",
      "name": "BaddBeatz Mixes",
      "creator": {
        "@type": "MusicGroup",
        "name": "TheBadGuyHimself"
      },
      "url": "https://baddbeatz.com/music.html"
    }]
  },
  'live.html': {
    title: 'Live Stream | Watch TheBadGuyHimself DJ Sets Online',
    description: 'Join live electronic music streams featuring techno, hardstyle, and house music. Interactive chat, real-time requests, and multi-platform streaming.',
    keywords: 'live DJ stream, electronic music live, techno streaming, online DJ sets, live music performance',
    schema: [musicianSchema, eventSchema]
  },
  'bookings.html': {
    title: 'Book TheBadGuyHimself | Professional DJ Services',
    description: 'Book TheBadGuyHimself for clubs, festivals, private events, and corporate functions. Professional electronic music DJ services across Europe.',
    keywords: 'book DJ, hire electronic music DJ, techno DJ booking, event DJ services, festival DJ',
    schema: [musicianSchema, {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "DJ Booking Services",
      "provider": {
        "@type": "MusicGroup",
        "name": "TheBadGuyHimself"
      },
      "areaServed": "Europe",
      "description": "Professional DJ services for clubs, festivals, and private events"
    }]
  },
  'contact.html': {
    title: 'Contact TheBadGuyHimself | Get in Touch',
    description: 'Contact TheBadGuyHimself for bookings, collaborations, or inquiries. Connect with a professional electronic music DJ for your next event.',
    keywords: 'contact DJ, electronic music inquiries, DJ booking contact, music collaboration',
    schema: [musicianSchema]
  }
};

/**
 * Generate robots.txt content
 */
const robotsTxtContent = `# BaddBeatz Robots.txt
# https://baddbeatz.com

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: *.pdf$

# Sitemaps
Sitemap: https://baddbeatz.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Popular search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /
`;

/**
 * Generate security.txt content
 */
const securityTxtContent = `# BaddBeatz Security Policy
# https://baddbeatz.com/.well-known/security.txt

Contact: security@baddbeatz.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: en, de
Canonical: https://baddbeatz.com/.well-known/security.txt
Policy: https://baddbeatz.com/security-policy.html
`;

/**
 * Add structured data to HTML
 * @param {string} html - HTML content
 * @param {Array} schemas - Schema objects to add
 * @returns {string} Updated HTML
 */
function addStructuredData(html, schemas) {
  const scriptTags = schemas.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  ).join('\n');
  
  return html.replace('</head>', `${scriptTags}\n</head>`);
}

/**
 * Update meta tags in HTML
 * @param {string} html - HTML content
 * @param {Object} metaData - Meta data object
 * @returns {string} Updated HTML
 */
function updateMetaTags(html, metaData) {
  // Update title
  html = html.replace(/<title>.*?<\/title>/, `<title>${metaData.title}</title>`);
  
  // Update or add meta description
  if (html.includes('name="description"')) {
    html = html.replace(
      /<meta name="description" content=".*?".*?>/,
      `<meta name="description" content="${metaData.description}">`
    );
  } else {
    html = html.replace(
      '<meta charset="UTF-8">',
      `<meta charset="UTF-8">\n  <meta name="description" content="${metaData.description}">`
    );
  }
  
  // Add keywords meta tag
  if (!html.includes('name="keywords"')) {
    html = html.replace(
      '<meta name="description"',
      `<meta name="keywords" content="${metaData.keywords}">\n  <meta name="description"`
    );
  }
  
  // Add canonical URL
  const filename = path.basename(metaData.filename || 'index.html');
  const canonicalUrl = `https://baddbeatz.com/${filename === 'index.html' ? '' : filename}`;
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      '</head>',
      `  <link rel="canonical" href="${canonicalUrl}">\n</head>`
    );
  }
  
  // Update Open Graph tags
  html = html.replace(
    /<meta property="og:title" content=".*?".*?>/,
    `<meta property="og:title" content="${metaData.title}">`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?".*?>/,
    `<meta property="og:description" content="${metaData.description}">`
  );
  
  // Update Twitter Card tags
  html = html.replace(
    /<meta name="twitter:title" content=".*?".*?>/,
    `<meta name="twitter:title" content="${metaData.title}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?".*?>/,
    `<meta name="twitter:description" content="${metaData.description}">`
  );
  
  // Add additional meta tags
  const additionalMeta = [
    '<meta name="author" content="TheBadGuyHimself">',
    '<meta name="robots" content="index, follow">',
    '<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
    '<meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
    '<meta name="theme-color" content="#00ffff">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
    '<meta name="format-detection" content="telephone=no">'
  ];
  
  // Add if not present
  additionalMeta.forEach(tag => {
    if (!html.includes(tag)) {
      html = html.replace('</head>', `  ${tag}\n</head>`);
    }
  });
  
  return html;
}

/**
 * Generate XML sitemap
 */
async function generateSitemap() {
  const pages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: 'about.html', priority: '0.8', changefreq: 'monthly' },
    { url: 'music.html', priority: '0.9', changefreq: 'weekly' },
    { url: 'live.html', priority: '0.9', changefreq: 'daily' },
    { url: 'playlist.html', priority: '0.7', changefreq: 'weekly' },
    { url: 'video.html', priority: '0.8', changefreq: 'weekly' },
    { url: 'gallery.html', priority: '0.7', changefreq: 'weekly' },
    { url: 'bookings.html', priority: '0.9', changefreq: 'monthly' },
    { url: 'contact.html', priority: '0.8', changefreq: 'monthly' },
    { url: 'login.html', priority: '0.6', changefreq: 'monthly' },
    { url: 'privacy.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'terms.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'disclaimer.html', priority: '0.3', changefreq: 'yearly' },
    { url: 'copyright.html', priority: '0.3', changefreq: 'yearly' }
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>https://baddbeatz.com/${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return sitemap;
}

/**
 * Main SEO enhancement function
 */
async function enhanceSEO() {
  console.log('🚀 Starting SEO enhancements...\n');
  
  try {
    // Process HTML files
    console.log('📝 Updating HTML files with SEO enhancements...');
    
    for (const [filename, metaData] of Object.entries(pageMetaData)) {
      try {
        let html = await fs.readFile(filename, 'utf8');
        
        // Add filename to metadata
        metaData.filename = filename;
        
        // Update meta tags
        html = updateMetaTags(html, metaData);
        
        // Add structured data
        if (metaData.schema) {
          html = addStructuredData(html, metaData.schema);
        }
        
        // Write updated HTML
        await fs.writeFile(filename, html);
        console.log(`  ✓ ${filename}`);
      } catch (error) {
        console.log(`  ✗ ${filename} - ${error.message}`);
      }
    }
    
    // Generate sitemap
    console.log('\n📍 Generating sitemap.xml...');
    const sitemap = await generateSitemap();
    await fs.writeFile('sitemap.xml', sitemap);
    console.log('  ✓ sitemap.xml created');
    
    // Update robots.txt
    console.log('\n🤖 Updating robots.txt...');
    await fs.writeFile('robots.txt', robotsTxtContent);
    console.log('  ✓ robots.txt updated');
    
    // Create .well-known directory and security.txt
    console.log('\n🔒 Creating security.txt...');
    await fs.mkdir('.well-known', { recursive: true });
    await fs.writeFile('.well-known/security.txt', securityTxtContent);
    console.log('  ✓ .well-known/security.txt created');
    
    // Create SEO report
    const report = {
      timestamp: new Date().toISOString(),
      pagesUpdated: Object.keys(pageMetaData).length,
      structuredDataAdded: true,
      sitemapGenerated: true,
      robotsTxtUpdated: true,
      securityTxtCreated: true,
      recommendations: [
        'Submit sitemap to Google Search Console',
        'Submit sitemap to Bing Webmaster Tools',
        'Monitor Core Web Vitals',
        'Set up Google Analytics',
        'Create and submit video sitemap for YouTube content',
        'Implement breadcrumb navigation',
        'Add FAQ schema for common questions'
      ]
    };
    
    await fs.writeFile('seo-enhancement-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n✨ SEO enhancements complete!');
    console.log('\n📊 Next steps:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    
  } catch (error) {
    console.error('❌ Error during SEO enhancement:', error);
    process.exit(1);
  }
}

// Run SEO enhancements
enhanceSEO();
