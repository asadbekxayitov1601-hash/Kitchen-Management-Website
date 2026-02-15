import { useDrag } from 'react-dnd';
import { Package, ChevronRight } from 'lucide-react';
import { PantryItem, IngredientStatus } from '../types/kitchen';

interface PantrySidebarProps {
  items: PantryItem[];
  onStatusChange: (id: string, status: IngredientStatus) => void;
  isCollapsed?: boolean;
}

interface PantryItemCardProps {
  item: PantryItem;
  onStatusChange: (status: IngredientStatus) => void;
}

function PantryItemCard({ item, onStatusChange }: PantryItemCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'pantry-item',
    item: { id: item.id, name: item.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const statusColors = {
    'in-stock': 'bg-green-500',
    'low': 'bg-yellow-500',
    'out': 'bg-red-500',
  };

  const statusBgColors = {
    'in-stock': 'bg-green-50',
    'low': 'bg-yellow-50',
    'out': 'bg-red-50',
  };

  const handleClick = () => {
    const statuses: IngredientStatus[] = ['in-stock', 'low', 'out'];
    const currentIndex = statuses.indexOf(item.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    onStatusChange(statuses[nextIndex]);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`group cursor-pointer transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`rounded-[24px] p-4 backdrop-blur-md ${statusBgColors[item.status]} border border-white/40 shadow-sm hover:shadow-md transition-all`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-sm text-gray-900">{item.name}</h4>
            {item.quantity && (
              <p className="text-xs text-gray-600 mt-1">{item.quantity}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PantrySidebar({ items, onStatusChange, isCollapsed = false }: PantrySidebarProps) {
  const categories = Array.from(new Set(items.map((item) => item.category)));

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-20 z-40">
        <button className="bg-white/80 backdrop-blur-md rounded-r-[24px] p-3 shadow-lg border border-l-0 border-white/40">
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/60 backdrop-blur-md border-r border-primary/10 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Pantry</h2>
            <p className="text-xs text-gray-600">{items.length} items</p>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            return (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <PantryItemCard
                      key={item.id}
                      item={item}
                      onStatusChange={(status) => onStatusChange(item.id, status)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-[24px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <p className="text-xs text-blue-900">
            💡 <strong>Tip:</strong> Click items to change status or drag to add to shopping list
          </p>
        </div>
      </div>
    </div>
  );
}
