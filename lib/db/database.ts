import { useSQLiteContext } from 'expo-sqlite';

export interface ShoppingItem {
  id?: number;
  name: string;
  isCompleted: boolean;
  barcode?: string;
  createdAt: string;
  quantity: number;
  weight?: number;
  category?: string;
  icon?: string;
  listId?: number;
}

export interface ShoppingList {
  id?: number;
  name: string;
  createdAt: string;
}

// Initialize database and create tables
export const initDatabase = async (db: ReturnType<typeof useSQLiteContext>): Promise<void> => {
  await db.execAsync(`
    DROP TABLE IF EXISTS shopping_items;
    DROP TABLE IF EXISTS shopping_lists;

    CREATE TABLE shopping_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      barcode TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      quantity INTEGER DEFAULT 1,
      weight REAL,
      category TEXT,
      icon TEXT,
      list_id INTEGER,
      FOREIGN KEY (list_id) REFERENCES shopping_lists (id) ON DELETE CASCADE
    );
  `);
};

// Add new shopping list
export const addShoppingList = async (
  db: ReturnType<typeof useSQLiteContext>,
  name: string
): Promise<ShoppingList> => {
  const result = await db.runAsync(
    'INSERT INTO shopping_lists (name) VALUES (?)',
    [name]
  );

  return {
    id: result.lastInsertRowId,
    name,
    createdAt: new Date().toLocaleString('pl-PL', { hour12: false, timeZone: 'Europe/Warsaw' })
  };
};

// Get all shopping lists
export const getShoppingLists = async (
  db: ReturnType<typeof useSQLiteContext>
): Promise<ShoppingList[]> => {
  const lists = await db.getAllAsync<{
    id: number;
    name: string;
    created_at: string;
  }>('SELECT * FROM shopping_lists ORDER BY id DESC');

  return lists.map((list) => ({
    id: list.id,
    name: list.name,
    createdAt: list.created_at
  }));
};

// Delete shopping list
export const deleteShoppingList = async (
  db: ReturnType<typeof useSQLiteContext>,
  id: number
): Promise<void> => {
  await db.runAsync('DELETE FROM shopping_lists WHERE id = ?', [id]);
};

// Add new shopping item to a list
export const addShoppingItemToList = async (
  db: ReturnType<typeof useSQLiteContext>,
  item: Omit<ShoppingItem, 'id' | 'createdAt'>,
  listId: number
): Promise<ShoppingItem> => {
  const result = await db.runAsync(
    'INSERT INTO shopping_items (name, is_completed, barcode, quantity, weight, category, icon, list_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      item.name,
      item.isCompleted ? 1 : 0,
      item.barcode || null,
      item.quantity,
      item.weight || null,
      item.category || null,
      item.icon || null,
      listId
    ]
  );

  return {
    id: result.lastInsertRowId,
    name: item.name,
    isCompleted: item.isCompleted,
    barcode: item.barcode,
    createdAt: new Date().toISOString(),
    quantity: item.quantity,
    weight: item.weight,
    category: item.category,
    icon: item.icon,
    listId
  };
};

// Get shopping items for a specific list
export const getShoppingItemsForList = async (
  db: ReturnType<typeof useSQLiteContext>,
  listId: number
): Promise<ShoppingItem[]> => {
  const items = await db.getAllAsync<{
    id: number;
    name: string;
    is_completed: number;
    barcode: string | null;
    created_at: string;
    quantity: number;
    weight: number | null;
    category: string | null;
    icon: string | null;
    list_id: number;
  }>('SELECT * FROM shopping_items WHERE list_id = ? ORDER BY is_completed ASC, category ASC NULLS LAST, name ASC', [listId]);

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    isCompleted: item.is_completed === 1,
    barcode: item.barcode || undefined,
    createdAt: item.created_at,
    quantity: item.quantity,
    weight: item.weight || undefined,
    category: item.category || undefined,
    icon: item.icon || undefined,
    listId: item.list_id
  }));
};

// Delete shopping item from a list
export const deleteShoppingItemFromList = async (
  db: ReturnType<typeof useSQLiteContext>,
  itemId: number,
  listId: number
): Promise<void> => {
  await db.runAsync('DELETE FROM shopping_items WHERE id = ? AND list_id = ?', [itemId, listId]);
};

// Add new shopping item
export const addShoppingItem = async (
  db: ReturnType<typeof useSQLiteContext>,
  item: Omit<ShoppingItem, 'id' | 'createdAt'>
): Promise<ShoppingItem> => {
  const result = await db.runAsync(
    'INSERT INTO shopping_items (name, is_completed, barcode, quantity, weight, category, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      item.name,
      item.isCompleted ? 1 : 0,
      item.barcode || null,
      item.quantity,
      item.weight || null,
      item.category || null,
      item.icon || null
    ]
  );

  return {
    id: result.lastInsertRowId,
    name: item.name,
    isCompleted: item.isCompleted,
    barcode: item.barcode,
    createdAt: new Date().toISOString(),
    quantity: item.quantity,
    weight: item.weight,
    category: item.category,
    icon: item.icon
  };
};

// Get all shopping items
export const getShoppingItems = async (
  db: ReturnType<typeof useSQLiteContext>
): Promise<ShoppingItem[]> => {
  const items = await db.getAllAsync<{
    id: number;
    name: string;
    is_completed: number;
    barcode: string | null;
    created_at: string;
    quantity: number;
    weight: number | null;
    category: string | null;
    icon: string | null;
  }>('SELECT * FROM shopping_items ORDER BY id DESC');

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    isCompleted: item.is_completed === 1,
    barcode: item.barcode || undefined,
    createdAt: item.created_at,
    quantity: item.quantity,
    weight: item.weight || undefined,
    category: item.category || undefined,
    icon: item.icon || undefined
  }));
};

// Update shopping item completion status
export const updateShoppingItemStatus = async (
  db: ReturnType<typeof useSQLiteContext>,
  id: number,
  isCompleted: boolean
): Promise<void> => {
  await db.runAsync(
    'UPDATE shopping_items SET is_completed = ? WHERE id = ?',
    [isCompleted ? 1 : 0, id]
  );
};

// Delete shopping item
export const deleteShoppingItem = async (
  db: ReturnType<typeof useSQLiteContext>,
  id: number
): Promise<void> => {
  await db.runAsync('DELETE FROM shopping_items WHERE id = ?', [id]);
};

// Delete all completed items
export const deleteCompletedItems = async (
  db: ReturnType<typeof useSQLiteContext>
): Promise<void> => {
  await db.runAsync('DELETE FROM shopping_items WHERE is_completed = 1');
};

// Update shopping item details
export const updateShoppingItem = async (
  db: ReturnType<typeof useSQLiteContext>,
  item: ShoppingItem
): Promise<void> => {
  if (!item.id) {
    throw new Error('Item ID is required for update');
  }
  
  await db.runAsync(
    'UPDATE shopping_items SET name = ?, quantity = ?, weight = ?, category = ?, barcode = ? WHERE id = ?',
    [
      item.name,
      item.quantity,
      item.weight || null,
      item.category || null,
      item.barcode || null,
      item.id
    ]
  );
}; 