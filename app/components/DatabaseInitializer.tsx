import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { initDatabase } from '../../lib/db/database';

export default function DatabaseInitializer() {
  const db = useSQLiteContext();

  useEffect(() => {
    initDatabase(db);
  }, []);

  return null;
} 