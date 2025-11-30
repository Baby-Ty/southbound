// Fallback storage using localStorage for development when CosmosDB is not configured
// This allows testing the route builder without setting up CosmosDB

import { SavedRoute, StopPlan } from './cosmos';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'sb_saved_routes_fallback';

// In-memory storage for server-side (will be lost on restart)
let memoryStorage: SavedRoute[] = [];

function getStorage(): SavedRoute[] {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  } else {
    // Server-side: use memory (temporary)
    return memoryStorage;
  }
}

function saveStorage(routes: SavedRoute[]) {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  } else {
    // Server-side: use memory
    memoryStorage = routes;
  }
}

export async function saveRouteFallback(
  routeData: Omit<SavedRoute, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SavedRoute> {
  const routes = getStorage();
  
  const route: SavedRoute = {
    ...routeData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  routes.push(route);
  saveStorage(routes);
  
  return route;
}

export async function getRouteFallback(routeId: string): Promise<SavedRoute | null> {
  const routes = getStorage();
  return routes.find((r) => r.id === routeId) || null;
}

export async function updateRouteFallback(
  routeId: string,
  updates: Partial<SavedRoute>
): Promise<SavedRoute> {
  const routes = getStorage();
  const index = routes.findIndex((r) => r.id === routeId);
  
  if (index === -1) {
    throw new Error(`Route ${routeId} not found`);
  }

  const updated: SavedRoute = {
    ...routes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  routes[index] = updated;
  saveStorage(routes);
  
  return updated;
}

export async function getAllRoutesFallback(filters?: {
  status?: SavedRoute['status'];
  email?: string;
  region?: string;
}): Promise<SavedRoute[]> {
  let routes = getStorage();
  
  if (filters?.status) {
    routes = routes.filter((r) => r.status === filters.status);
  }
  
  if (filters?.email) {
    routes = routes.filter((r) => r.email === filters.email);
  }
  
  if (filters?.region) {
    routes = routes.filter((r) => r.region === filters.region);
  }
  
  return routes.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deleteRouteFallback(routeId: string): Promise<void> {
  const routes = getStorage();
  const filtered = routes.filter((r) => r.id !== routeId);
  saveStorage(filtered);
}

