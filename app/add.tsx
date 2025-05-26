import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingItem, addShoppingItem } from '../lib/db/database';
import { useBarcodeScan } from './components/BarcodeScanContext';

export default function AddItemScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('');
  const [barcode, setBarcode] = useState('');
  const { startScan } = useBarcodeScan();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Błąd', 'Wprowadź nazwę produktu');
      return;
    }

    const newItem: Omit<ShoppingItem, 'id' | 'createdAt'> = {
      name: name.trim(),
      isCompleted: false,
      quantity: parseInt(quantity) || 1,
      weight: weight ? parseFloat(weight) : undefined,
      category: category.trim() || undefined,
      barcode: barcode.trim() || undefined,
    };

    console.log('Adding item:', newItem);

    try {
      await addShoppingItem(db, newItem);
      console.log('Item added successfully');
      router.back();
    } catch (error) {
      console.log('Add item error:', error);
      Alert.alert('Błąd', 'Nie udało się dodać produktu');
    }
  };

  const handleScanBarcode = useCallback(() => {
    startScan((scannedCode) => {
      setBarcode(scannedCode);
    });
  }, [startScan]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Dodaj produkt" />
      </Appbar.Header>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.form}>
          <TextInput
            label="Nazwa produktu *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            autoFocus
            returnKeyType="next"
          />
          <TextInput
            label="Ilość"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Waga (kg)"
            value={weight}
            onChangeText={setWeight}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Kategoria"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Kod kreskowy"
            value={barcode}
            onChangeText={setBarcode}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            right={<TextInput.Icon icon="barcode-scan" onPress={handleScanBarcode} />}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Dodaj produkt
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 4,
  },
}); 