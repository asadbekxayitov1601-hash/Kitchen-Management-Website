import { PantryItem } from '../types/kitchen';
import { authFetch } from '../auth/authFetch';

// Convert numeric IDs from server to string IDs for frontend
function convertToPantryItem(item: any): PantryItem {
  return {
    ...item,
    id: String(item.id),
  };
}

export async function getPantry(): Promise<PantryItem[]> {
  const res = await authFetch('/api/pantry');
  if (!res.ok) throw new Error('Failed to load pantry');
  const data = await res.json();
  return data.map(convertToPantryItem);
}

export async function addPantryItem(item: Omit<PantryItem, 'id'>): Promise<PantryItem> {
  const res = await authFetch('/api/pantry', {
    method: 'POST',
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add pantry item');
  const data = await res.json();
  return convertToPantryItem(data);
}

export async function updatePantryItem(id: string, patch: Partial<PantryItem>): Promise<PantryItem> {
  const res = await authFetch(`/api/pantry/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update pantry item');
  const data = await res.json();
  return convertToPantryItem(data);
}

export async function deletePantryItem(id: string): Promise<void> {
  const res = await authFetch(`/api/pantry/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete pantry item');
}
