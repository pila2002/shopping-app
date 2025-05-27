import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Checkbox, IconButton, List, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteShoppingItemFromList, getShoppingItemsForList, ShoppingItem, updateShoppingItemStatus } from '../../lib/db/database';
import { useBarcodeScan } from '../components/BarcodeScanContext';

export default function ShoppingListProductsScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = Number(id);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const router = useRouter();
  const { startScan } = useBarcodeScan();

  const loadItems = async () => {
    const data = await getShoppingItemsForList(db, listId);
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [listId])
  );

  const handleShowManualForm = () => {
    router.push(`/list/${listId}/add`);
  };

  const handleShowScannerForm = () => {
    router.push(`/scan?id=${listId}`);
  };

  const handleToggleCompleted = async (item: ShoppingItem) => {
    await updateShoppingItemStatus(db, item.id!, !item.isCompleted);
    loadItems();
  };

  const handleDeleteItem = (itemId: number) => {
    Alert.alert(
      'Usuń produkt',
      'Czy na pewno chcesz usunąć ten produkt?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            await deleteShoppingItemFromList(db, itemId, listId);
            loadItems();
          },
        },
      ]
    );
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Bez kategorii';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Produkty na liście" />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <View key={category}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.categoryTitle, { color: theme.colors.primary }]}>
                {category}
              </Text>
            </View>
            {categoryItems.map((item) => (
              <List.Item
                key={item.id}
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                      style={[
                        styles.itemName,
                        item.isCompleted && { textDecorationLine: 'line-through', color: theme.colors.onSurfaceDisabled }
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </View>
                }
                description={
                  <Text style={styles.itemDescription} numberOfLines={1}>
                    {item.weight ? `${item.weight} kg` : `${item.quantity} szt.`}
                  </Text>
                }
                left={() => (
                  <View style={styles.checkboxContainer}>
                    <View style={[styles.checkboxBg, { transform: [{ scale: 0.85 }] }]}>
                      <Checkbox
                        status={item.isCompleted ? 'checked' : 'unchecked'}
                        onPress={() => handleToggleCompleted(item)}
                        color={theme.colors.primary}
                        uncheckedColor={theme.colors.outline}
                      />
                    </View>
                  </View>
                )}
                right={() => (
                  <IconButton
                    icon="delete-outline"
                    iconColor={theme.colors.error}
                    onPress={() => handleDeleteItem(item.id!)}
                  />
                )}
                style={[
                  styles.listItem,
                  item.isCompleted && styles.completedItem
                ]}
                onPress={() => router.push(`/list/${listId}/edit/${item.id}`)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.addButtonsRow}>
        <Button
          mode="contained"
          onPress={handleShowManualForm}
          style={styles.addButton}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Dodaj ręcznie
        </Button>
        <Button
          mode="outlined"
          onPress={handleShowScannerForm}
          style={styles.addButton}
          textColor={theme.colors.primary}
          icon="barcode-scan"
        >
          Dodaj przez skaner
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 1,
    paddingVertical: 12,
    height: 88,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
    lineHeight: 20,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    minWidth: 40,
    height: '100%',
  },
  checkboxBg: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#6200ee',
    padding: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedItem: {
    backgroundColor: '#f0f0f0',
  },
  addButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    marginBottom: 32,
    marginTop: 16,
    gap: 8,
    backgroundColor: 'white',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
});

export const options = {
  headerShown: false,
}; 