/**
 * Service for managing food items with expiration dates
 */

export interface FoodItem {
  /**
   * The name of the food item
   */
  name: string;
  /**
   * The expiration date of the food item (ISO string format)
   */
  expirationDate: string;
  /**
   * The date when the item was added (ISO string format)
   */
  addedDate: string;
}

// Local storage key for food items
const FOOD_ITEMS_STORAGE_KEY = 'fridge-chef-food-items';

/**
 * Get all food items from local storage
 */
export function getFoodItems(): FoodItem[] {
  if (typeof window === 'undefined') return [];
  
  const storedItems = localStorage.getItem(FOOD_ITEMS_STORAGE_KEY);
  return storedItems ? JSON.parse(storedItems) : [];
}

/**
 * Add a new food item
 */
export function addFoodItem(item: FoodItem): FoodItem[] {
  const items = getFoodItems();
  const newItems = [...items, item];
  localStorage.setItem(FOOD_ITEMS_STORAGE_KEY, JSON.stringify(newItems));
  return newItems;
}

/**
 * Remove a food item by name
 */
export function removeFoodItem(itemName: string): FoodItem[] {
  const items = getFoodItems();
  const newItems = items.filter(item => item.name !== itemName);
  localStorage.setItem(FOOD_ITEMS_STORAGE_KEY, JSON.stringify(newItems));
  return newItems;
}

/**
 * Update a food item
 */
export function updateFoodItem(updatedItem: FoodItem): FoodItem[] {
  const items = getFoodItems();
  const newItems = items.map(item => 
    item.name === updatedItem.name ? updatedItem : item
  );
  localStorage.setItem(FOOD_ITEMS_STORAGE_KEY, JSON.stringify(newItems));
  return newItems;
}

/**
 * Get food items that are expiring soon (within the specified days)
 */
export function getExpiringItems(daysThreshold: number = 3): FoodItem[] {
  const items = getFoodItems();
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  return items.filter(item => {
    const expirationDate = new Date(item.expirationDate);
    return expirationDate <= thresholdDate && expirationDate >= today;
  });
}

/**
 * Get expired food items
 */
export function getExpiredItems(): FoodItem[] {
  const items = getFoodItems();
  const today = new Date();
  
  return items.filter(item => {
    const expirationDate = new Date(item.expirationDate);
    return expirationDate < today;
  });
}

/**
 * Check if there are any expiring or expired items
 */
export function hasExpiringOrExpiredItems(): boolean {
  const expiringItems = getExpiringItems();
  const expiredItems = getExpiredItems();
  
  return expiringItems.length > 0 || expiredItems.length > 0;
}