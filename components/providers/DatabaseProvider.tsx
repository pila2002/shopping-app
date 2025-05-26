import { initDatabase } from '@/lib/db/database';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';

const DATABASE_NAME = 'shopping_list.db';

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  return (
    <SQLiteProvider 
      databaseName={DATABASE_NAME}
      onInit={initDatabase}
    >
      {children}
    </SQLiteProvider>
  );
} 