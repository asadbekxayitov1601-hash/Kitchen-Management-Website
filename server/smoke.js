// Simple smoke test script for the auth endpoints
(async () => {
  try {
    const base = 'http://localhost:4000';

    console.log('Calling /api/signup');
    const s = await fetch(`${base}/api/signup`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test@example.com', password: 'pass123' }),
    });
    const sBody = await s.text();
    console.log('signup status', s.status);
    console.log('signup body', sBody);

    console.log('Calling /api/login');
    const l = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'pass123' }),
    });
    const lBody = await l.text();
    console.log('login status', l.status);
    console.log('login body', lBody);

    process.exit(0);
  } catch (err) {
    console.error('smoke test error', err);
    process.exit(2);
  }
})();
