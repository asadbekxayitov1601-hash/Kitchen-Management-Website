import { useDrop } from 'react-dnd';
import { ShoppingCart, Trash2, Check } from 'lucide-react';
import { ShoppingListItem } from '../types/kitchen';
import { motion, AnimatePresence } from 'motion/react';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string) => void;
}

export function ShoppingList({ items, onToggleItem, onRemoveItem, onAddItem }: ShoppingListProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'pantry-item',
    drop: (item: { id: string; name: string }) => {
      onAddItem(item.name);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const activeItems = items.filter((item) => !item.checked);
  const completedItems = items.filter((item) => item.checked);

  return (
    <div
      ref={drop}
      className={`h-full bg-white/60 backdrop-blur-md border-l border-primary/10 overflow-y-auto transition-all ${
        isOver ? 'bg-primary/5' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Shopping List</h2>
            <p className="text-xs text-gray-600">{activeItems.length} items needed</p>
          </div>
        </div>

        {isOver && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-[16px] bg-emerald-100 border border-emerald-300"
          >
            <p className="text-xs text-emerald-900">Drop here to add to list</p>
          </motion.div>
        )}

        <div className="space-y-4">
          {activeItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 px-2">To Buy</h3>
              <AnimatePresence>
                {activeItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="rounded-[20px] p-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 hover:border-emerald-500 transition-colors shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-900">{item.name}</h4>
                        {item.quantity && (
                          <p className="text-xs text-gray-600 mt-0.5">{item.quantity}</p>
                        )}
                        {item.recipeName && (
                          <p className="text-xs text-violet-600 mt-1">For: {item.recipeName}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {completedItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 px-2">Completed</h3>
              <AnimatePresence>
                {completedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-[20px] p-4 bg-green-50/80 backdrop-blur-sm border border-green-200"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center shrink-0"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-600 line-through">{item.name}</h4>
                        {item.quantity && (
                          <p className="text-xs text-gray-500 mt-0.5 line-through">
                            {item.quantity}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Your shopping list is empty</p>
              <p className="text-xs text-gray-400 mt-1">
                Drag items from pantry or add from recipes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
