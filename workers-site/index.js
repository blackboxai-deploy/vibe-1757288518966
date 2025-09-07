import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

// Security headers for all responses
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.youtube.com https://w.soundcloud.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https://api.openai.com; frame-src 'self' https://www.youtube.com https://w.soundcloud.com; object-src 'none';",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add CORS headers for API requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Handle AI API requests
    if (url.pathname === '/api/ask' && request.method === 'POST') {
      try {
        let question;
        try {
          const json = await request.json();
          question = json.question;
        } catch (e) {
          return new Response(
            JSON.stringify({ error: 'Invalid JSON in request body' }),
            { 
              status: 400, 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders,
                ...securityHeaders
              } 
            }
          );
        }

        // Ensure a valid, non-empty question string
        if (typeof question !== 'string' || question.trim() === '') {
          return new Response(
            JSON.stringify({ error: 'Question must be a non-empty string' }),
            { 
              status: 400, 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders,
                ...securityHeaders
              } 
            }
          );
        }

        // Basic rate limiting by client IP (only if RATE_LIMIT KV is available)
        if (env.RATE_LIMIT) {
          const ip = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    'unknown';
          const key = `ip:${ip}`;
          let count = parseInt((await env.RATE_LIMIT.get(key)) || '0');
          if (count >= 20) {
            return new Response(
              JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
              { 
                status: 429, 
                headers: { 
                  'Content-Type': 'application/json',
                  ...corsHeaders,
                  ...securityHeaders
                } 
              }
            );
          }
          count++;
          await env.RATE_LIMIT.put(key, String(count), { expirationTtl: 60 });
        }

        const openaiKey = env.OPENAI_API_KEY;
        if (!openaiKey) {
          return new Response(
            JSON.stringify({ error: 'AI service temporarily unavailable' }),
            { 
              status: 500, 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders,
                ...securityHeaders
              } 
            }
          );
        }

        // Enhanced system prompt for BaddBeatz context
        const systemPrompt = `You are an AI assistant for BaddBeatz, the electronic music platform featuring TheBadGuyHimself.

About BaddBeatz:
- Specializes in electronic music: techno, hardstyle, house, trance
- Offers DJ services for events, parties, and live streaming
- Features original mixes and curated playlists
- Based in Europe with international reach
- Known for high-energy underground electronic music

Answer questions about:
- Music recommendations and genres
- DJ booking and services
- Electronic music culture and events
- Technical DJ equipment and mixing
- BaddBeatz platform features

Keep responses helpful, enthusiastic, and professional. Match the electronic music scene vibe.`;

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: question }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        if (!aiRes.ok) {
          const errorText = await aiRes.text();
          console.error('OpenAI API error:', aiRes.status, errorText);
          return new Response(
            JSON.stringify({ error: 'AI service temporarily unavailable' }),
            { 
              status: 500, 
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders,
                ...securityHeaders
              } 
            }
          );
        }

        const aiResJson = await aiRes.json();
        return new Response(JSON.stringify(aiResJson), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...securityHeaders
          }
        });
      } catch (err) {
        console.error('Error during AI request:', err);
        return new Response(
          JSON.stringify({ error: 'AI request failed' }), 
          {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders
            }
          }
        );
      }
    }

    // Handle static asset requests
    try {
      const options = {
        mapRequestToAsset: mapRequestToAsset,
      };

      // Customize asset handling
      if (url.pathname.endsWith('/')) {
        // Serve index.html for directory requests
        const indexRequest = new Request(url.origin + url.pathname + 'index.html', request);
        const response = await getAssetFromKV({
          request: indexRequest,
          waitUntil: ctx.waitUntil.bind(ctx),
        }, options);
        
        return new Response(response.body, {
          ...response,
          headers: {
            ...response.headers,
            ...securityHeaders,
          },
        });
      }

      const response = await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
      }, options);

      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          ...securityHeaders,
        },
      });
    } catch (e) {
      // Try to serve 404.html for not found errors
      try {
        const notFoundRequest = new Request(url.origin + '/404.html', request);
        const response = await getAssetFromKV({
          request: notFoundRequest,
          waitUntil: ctx.waitUntil.bind(ctx),
        });
        
        return new Response(response.body, {
          ...response,
          status: 404,
          headers: {
            ...response.headers,
            ...securityHeaders,
          },
        });
      } catch (err) {
        // Fallback 404 response
        const html404 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found | BaddBeatz</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
            color: #fff;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        h1 { color: #ff0033; font-size: 3rem; }
        p { color: #00ffff; font-size: 1.2rem; }
        a { color: #ff0033; text-decoration: none; }
        a:hover { color: #00ffff; }
    </style>
</head>
<body>
    <h1>404 - Track Not Found</h1>
    <p>The page you're looking for doesn't exist in our playlist.</p>
    <p><a href="/">← Back to BaddBeatz</a></p>
</body>
</html>`;
        
        return new Response(html404, {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
            ...securityHeaders,
          },
        });
      }
    }
  }
};
