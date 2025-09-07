// Lightweight smoke test for backend/auth-server.js using Node 20+ (global fetch).
// - Spawns the server on an ephemeral port
// - Registers a user, logs in, verifies token, checks /health
// - Cleans up the child process
//
// Run: node scripts/backend_smoke.cjs
const { spawn } = require('child_process');
const http = require('http');

const PORT = 3011; // avoid conflicts
const BASE = `http://127.0.0.1:${PORT}`;

async function waitForHealthy(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/health`);
      if (res.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error('Backend health check timed out');
}

async function run() {
  console.log('[backend_smoke] Starting backend/auth-server.js ...');
  const child = spawn(
    process.execPath,
    ['backend/auth-server.js'],
    {
      env: {
        ...process.env,
        PORT: String(PORT),
        FRONTEND_URL: 'http://localhost',
        JWT_SECRET: 'test-secret-smoke'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  child.stdout.on('data', d => process.stdout.write(`[backend] ${d}`));
  child.stderr.on('data', d => process.stderr.write(`[backend-err] ${d}`));

  let exited = false;
  child.on('exit', (code) => {
    exited = true;
    console.log(`[backend_smoke] backend exited with code ${code}`);
  });

  try {
    await waitForHealthy(20000);
    console.log('[backend_smoke] Health OK');

    // Register user
    const regRes = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: 'UserSmoke',
        email: 'smoke@example.com',
        password: 'GoodPass1' // meets policy
      })
    });
    if (regRes.status !== 201) {
      const t = await regRes.text();
      throw new Error(`Register failed ${regRes.status}: ${t}`);
    }
    console.log('[backend_smoke] Register OK');

    // Login user
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'smoke@example.com',
        password: 'GoodPass1'
      })
    });
    if (!loginRes.ok) {
      const t = await loginRes.text();
      throw new Error(`Login failed ${loginRes.status}: ${t}`);
    }
    const loginBody = await loginRes.json();
    if (!loginBody.token) throw new Error('Login response missing token');
    const token = loginBody.token;
    console.log('[backend_smoke] Login OK');

    // Verify token
    const verifyRes = await fetch(`${BASE}/api/auth/verify`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    if (!verifyRes.ok) {
      const t = await verifyRes.text();
      throw new Error(`Verify failed ${verifyRes.status}: ${t}`);
    }
    const verifyBody = await verifyRes.json();
    if (!verifyBody.valid) throw new Error('Verify response invalid=false');
    console.log('[backend_smoke] Verify OK');

    console.log('[backend_smoke] All checks passed');
    return 0;
  } catch (e) {
    console.error('[backend_smoke] FAILED:', e.message || e);
    return 1;
  } finally {
    if (!exited) {
      // Try graceful shutdown
      try { child.kill('SIGINT'); } catch {}
      // Force kill if needed after short delay
      setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 1500);
    }
  }
}

run().then(code => {
  process.exitCode = code;
}).catch(err => {
  console.error('[backend_smoke] UNEXPECTED:', err);
  process.exitCode = 2;
});
