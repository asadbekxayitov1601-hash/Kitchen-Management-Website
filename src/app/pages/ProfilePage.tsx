import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { authFetch } from '../auth/authFetch';
import { Crown, User as UserIcon, LogOut, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, refresh, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  // We can trust `user` from context since it's refreshed on mount in AuthProvider usually, 
  // but if we need fresh data from server, we can just rely on `refresh()` which calls `/api/me`.

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your Pro subscription? You will lose access immediately.')) return;

    setLoading(true);
    try {
      const res = await authFetch('/api/subscribe/cancel', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to cancel');

      await refresh();
      toast.success('Subscription cancelled');
    } catch (e: any) {
      toast.error(e.message || 'Error cancelling subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-12 text-center">Please sign in to view profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10" />
            )}
            {user.isPro && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-1.5 border-4 border-white shadow-sm">
                <Crown className="w-5 h-5 text-white fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
            <p className="text-gray-500 mb-4">{user.email}</p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {user.isAdmin && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                  Admin
                </span>
              )}
              {user.isPro ? (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1.5">
                  <Crown className="w-3 h-3 fill-current" /> Pro Member
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-200">
                  Free Plan
                </span>
              )}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Subscription / Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Subscription & Billing</h2>
          </div>

          <div className="p-6 space-y-6">
            {user.isPro ? (
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Crown className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pro Subscription Active</h3>
                    <p className="text-sm text-amber-700">You have full access to all features</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You are currently on the free plan.</p>
                {/* Could add upgrade button here, but header/modal usually handles upgrade */}
              </div>
            )}

            {/* Card Info */}
            {user.cardLast4 && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-12 h-8 bg-gray-300 rounded relative overflow-hidden flex-shrink-0">
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/50" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 font-mono">•••• •••• •••• {user.cardLast4}</p>
                  <p className="text-xs text-gray-500">Linked Card for payments</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
