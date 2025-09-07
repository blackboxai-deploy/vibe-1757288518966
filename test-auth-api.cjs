const http = require('http');

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Test123!@#'
};

// Helper function to make HTTP requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('Testing Authentication API...\n');
  
  // Test 1: Register a new user
  console.log('1. Testing user registration...');
  try {
    const registerResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testUser);
    
    console.log(`   Status: ${registerResult.status}`);
    console.log(`   Response:`, registerResult.data);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 2: Login with the registered user
  console.log('\n2. Testing user login...');
  try {
    const loginResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log(`   Status: ${loginResult.status}`);
    console.log(`   Response:`, loginResult.data);
    
    // Save token for next test
    if (loginResult.data.token) {
      const token = loginResult.data.token;
      
      // Test 3: Verify token
      console.log('\n3. Testing token verification...');
      const verifyResult = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/verify',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`   Status: ${verifyResult.status}`);
      console.log(`   Response:`, verifyResult.data);
      
      // Test 4: Logout
      console.log('\n4. Testing logout...');
      const logoutResult = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/logout',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`   Status: ${logoutResult.status}`);
      console.log(`   Response:`, logoutResult.data);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 5: Test rate limiting
  console.log('\n5. Testing rate limiting (5 rapid login attempts)...');
  for (let i = 1; i <= 5; i++) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
      
      console.log(`   Attempt ${i}: Status ${result.status}`);
      if (result.status === 429) {
        console.log(`   Rate limit triggered!`);
      }
    } catch (error) {
      console.log(`   Attempt ${i}: Error - ${error.message}`);
    }
  }
  
  console.log('\n✅ API testing completed!');
}

// Run the tests
runTests().catch(console.error);
