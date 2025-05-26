import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Menu, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getShoppingItemsForList, ShoppingItem, updateShoppingItem } from '../../../../lib/db/database';

const CATEGORIES = [
  'Warzywa i owoce',
  'Nabiał',
  'Mięso i wędliny',
  'Pieczywo',
  'Słodycze',
  'Napoje',
  'Przekąski',
  'Inne'
];

export default function EditProductScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditProductContent />
    </>
  );
}

function EditProductContent() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ShoppingItem | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('');
  const [barcode, setBarcode] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const items = await getShoppingItemsForList(db, Number(id));
      const found = items.find(i => i.id === Number(itemId));
      if (found) {
        setItem(found);
        setName(found.name);
        setQuantity(found.quantity.toString());
        setWeight(found.weight?.toString() || '');
        setCategory(found.category || '');
        setBarcode(found.barcode || '');
      }
    })();
  }, [db, id, itemId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Błąd', 'Nazwa produktu jest wymagana');
      return;
    }

    if (!item) return;

    const updatedItem: ShoppingItem = {
      ...item,
      name: name.trim(),
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : undefined,
      category: category.trim() || undefined,
      barcode: barcode.trim() || undefined,
    };

    try {
      await updateShoppingItem(db, updatedItem);
      router.back();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować produktu');
    }
  };

  if (!item) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Edytuj produkt" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formScroll}>
        <TextInput
          label="Nazwa produktu"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Ilość"
          value={quantity}
          onChangeText={setQuantity}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Waga"
          value={weight}
          onChangeText={setWeight}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              label="Kategoria"
              value={category}
              onPressIn={() => setMenuVisible(true)}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="menu-down" />}
            />
          }
        >
          {CATEGORIES.map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>
        <TextInput
          label="Kod kreskowy"
          value={barcode}
          onChangeText={setBarcode}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />
      </ScrollView>
      <View style={styles.formButtonsRow}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.submitButton}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Zapisz zmiany
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  formScroll: {
    padding: 16,
    gap: 16,
  },
  formButtonsRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
}); 