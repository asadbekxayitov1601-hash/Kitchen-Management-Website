import { Home, Package, ShoppingCart, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activeTab: 'recipes' | 'pantry' | 'shopping';
  onTabChange: (tab: 'recipes' | 'pantry' | 'shopping') => void;
  onSyncClick: () => void;
  shoppingItemCount: number;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onSyncClick,
  shoppingItemCount,
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-4 py-3">
        <button
          onClick={() => onTabChange('recipes')}
          className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-[16px] transition-all"
        >
          {activeTab === 'recipes' && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-[16px]"
            />
          )}
          <Home
            className={`w-5 h-5 relative z-10 ${
              activeTab === 'recipes' ? 'text-amber-700' : 'text-gray-500'
            }`}
          />
          <span
            className={`text-xs relative z-10 ${
              activeTab === 'recipes' ? 'text-amber-900' : 'text-gray-600'
            }`}
          >
            Recipes
          </span>
        </button>

        <button
          onClick={() => onTabChange('pantry')}
          className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-[16px] transition-all"
        >
          {activeTab === 'pantry' && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-[16px]"
            />
          )}
          <Package
            className={`w-5 h-5 relative z-10 ${
              activeTab === 'pantry' ? 'text-emerald-700' : 'text-gray-500'
            }`}
          />
          <span
            className={`text-xs relative z-10 ${
              activeTab === 'pantry' ? 'text-emerald-900' : 'text-gray-600'
            }`}
          >
            Pantry
          </span>
        </button>

        <button
          onClick={() => onTabChange('shopping')}
          className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-[16px] transition-all"
        >
          {activeTab === 'shopping' && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100 rounded-[16px]"
            />
          )}
          <div className="relative">
            <ShoppingCart
              className={`w-5 h-5 relative z-10 ${
                activeTab === 'shopping' ? 'text-violet-700' : 'text-gray-500'
              }`}
            />
            {shoppingItemCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px]">{shoppingItemCount}</span>
              </div>
            )}
          </div>
          <span
            className={`text-xs relative z-10 ${
              activeTab === 'shopping' ? 'text-violet-900' : 'text-gray-600'
            }`}
          >
            Shopping
          </span>
        </button>

        <button
          onClick={onSyncClick}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-[16px] transition-all hover:bg-blue-50"
        >
          <QrCode className="w-5 h-5 text-blue-600" />
          <span className="text-xs text-blue-700">Sync</span>
        </button>
      </div>
    </div>
  );
}
