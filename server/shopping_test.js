(async () => {
  try {
    const base = 'http://localhost:4000';
    const login = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'alicepass' }),
    });
    const ld = await login.json();
    console.log('login status', login.status);
    const token = ld.token;
    const s = await fetch(`${base}/api/shopping`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('shopping status', s.status);
    console.log('shopping body', await s.text());
  } catch (e) {
    console.error(e);
  }
})();
