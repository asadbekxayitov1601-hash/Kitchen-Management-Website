import { Recipe } from '../types/kitchen';
import { authFetch } from '../auth/authFetch';

export async function getRecipes(): Promise<Recipe[]> {
    const res = await authFetch('/api/recipes');
    if (!res.ok) throw new Error('Failed to load recipes');
    return res.json();
}

export async function getPendingRecipes(): Promise<Recipe[]> {
    const res = await authFetch('/api/recipes/pending');
    if (!res.ok) throw new Error('Failed to load pending recipes');
    return res.json();
}

export async function createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
    const res = await authFetch('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error('Failed to create recipe');
    return res.json();
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
    const res = await authFetch(`/api/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error('Failed to update recipe');
    return res.json();
}

export async function updateRecipeStatus(id: string, status: 'approved' | 'rejected', isPro?: boolean): Promise<Recipe> {
    const res = await authFetch(`/api/recipes/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, isPro }),
    });
    if (!res.ok) throw new Error('Failed to update recipe status');
    return res.json();
}

export async function deleteRecipe(id: string): Promise<void> {
    const res = await authFetch(`/api/recipes/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete recipe');
}

export async function getFavorites(): Promise<Recipe[]> {
    const res = await authFetch('/api/favorites');
    if (!res.ok) throw new Error('Failed to load favorites');
    return res.json();
}

export async function addFavorite(recipeId: string): Promise<void> {
    const res = await authFetch(`/api/favorites/${recipeId}`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to add favorite');
}

export async function removeFavorite(recipeId: string): Promise<void> {
    const res = await authFetch(`/api/favorites/${recipeId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove favorite');
}
