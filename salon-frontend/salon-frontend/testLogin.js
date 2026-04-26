const fetch = require('node-fetch'); // wait, run natively with Node 18+

async function test() {
  try {
    const res = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "systemadmin@gmail.com", password: "admin123" })
    });
    const status = res.status;
    const data = await res.json().catch(() => null);
    console.log("Status:", status);
    console.log("Data:", data);
    
    if (data && data.token) {
        let token = data.token;
        let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        console.log("Decoded:", Buffer.from(base64, 'base64').toString('utf8'));
    }
  } catch(e) {
    console.error("Test error:", e);
  }
}

test();
