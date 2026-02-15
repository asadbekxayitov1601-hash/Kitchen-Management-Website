import { ShoppingListItem } from '../types/kitchen';
import { authFetch } from '../auth/authFetch';

// Convert numeric IDs from server to string IDs for frontend
function convertToShoppingItem(item: any): ShoppingListItem {
  return {
    ...item,
    id: String(item.id),
  };
}

export async function getShoppingList(): Promise<ShoppingListItem[]> {
  const res = await authFetch('/api/shopping');
  if (!res.ok) throw new Error('Failed to load shopping list');
  const data = await res.json();
  return data.map(convertToShoppingItem);
}

export async function addShoppingItem(item: Omit<ShoppingListItem, 'id' | 'checked'>): Promise<ShoppingListItem> {
  const payload = { ...item, checked: false } as ShoppingListItem;
  const res = await authFetch('/api/shopping', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add shopping item');
  const data = await res.json();
  return convertToShoppingItem(data);
}

export async function updateShoppingItem(id: string, patch: Partial<ShoppingListItem>): Promise<ShoppingListItem> {
  const res = await authFetch(`/api/shopping/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update shopping item');
  const data = await res.json();
  return convertToShoppingItem(data);
}

export async function deleteShoppingItem(id: string): Promise<void> {
  const res = await authFetch(`/api/shopping/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete shopping item');
}
