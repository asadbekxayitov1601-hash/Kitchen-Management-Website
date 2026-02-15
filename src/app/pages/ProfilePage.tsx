import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { authFetch } from '../auth/authFetch';

export function ProfilePage() {
  const { user, loading } = useAuth();
  const [remoteUser, setRemoteUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authFetch('/api/me');
        if (!mounted) return;
        if (!res.ok) {
          setError('Failed to fetch profile');
          return;
        }
        const data = await res.json();
        setRemoteUser(data.user);
      } catch (e: any) {
        setError(e.message || 'Error');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl mb-4">Profile</h2>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg mb-2">Local auth state</h3>
        {user ? (
          <div>
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
          </div>
        ) : (
          <div>Not signed in</div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-lg mb-2">Server /api/me</h3>
        {error && <div className="text-red-600">{error}</div>}
        {remoteUser ? (
          <div>
            <div><strong>ID:</strong> {remoteUser.id}</div>
            <div><strong>Name:</strong> {remoteUser.name}</div>
            <div><strong>Email:</strong> {remoteUser.email}</div>
            <div><strong>Created:</strong> {new Date(remoteUser.createdAt).toLocaleString()}</div>
          </div>
        ) : (
          <div>Loading server profile...</div>
        )}
      </div>
    </div>
  );
}
