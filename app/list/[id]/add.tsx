import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, List, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchProductByBarcode } from '../../../lib/api/dietagram';
import { ShoppingItem, addShoppingItemToList } from '../../../lib/db/database';

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

export default function AddProductToListScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddProductContent />
    </>
  );
}

function AddProductContent() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = Number(id);
  console.log('AddProductContent id:', id, 'listId:', listId);
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('');
  const [barcode, setBarcode] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isWeightMode, setIsWeightMode] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    if (searchParams?.barcode) {
      setBarcode(String(searchParams.barcode));
    }
  }, [searchParams]);

  useEffect(() => {
    if (barcode) {
      setLoadingProduct(true);
      setApiError(null);
      fetchProductByBarcode(barcode)
        .then(product => {
          setName(product.name);
          setCategory('');
          setCategoryModalVisible(false);
          Keyboard.dismiss();
        })
        .catch(() => {
          setName(`Produkt ${barcode}`);
          setApiError('Nie znaleziono produktu w bazie lub błąd API.');
          setCategory('');
          setCategoryModalVisible(false);
          Keyboard.dismiss();
        })
        .finally(() => setLoadingProduct(false));
    }
  }, [barcode]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Błąd', 'Nazwa produktu jest wymagana');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Błąd', 'Wybierz kategorię produktu');
      return;
    }
    if (isNaN(listId)) {
      Alert.alert('Błąd', 'Brak poprawnego ID listy. Nie można dodać produktu.');
      return;
    }
    const newItem: Omit<ShoppingItem, 'id' | 'createdAt'> = {
      name: name.trim(),
      isCompleted: false,
      quantity: isWeightMode ? 1 : (parseInt(quantity) || 1),
      weight: isWeightMode ? parseFloat(weight) : undefined,
      category: category.trim(),
      barcode: barcode.trim() || undefined
    };
    try {
      console.log('Dodaję produkt:', newItem, 'do listy:', listId);
      await addShoppingItemToList(db, newItem, listId);
      router.back();
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Błąd', 'Nie udało się dodać produktu');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Dodaj produkt" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
        {loadingProduct && (
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <ActivityIndicator animating size="small" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, marginTop: 4 }}>Pobieranie danych z API...</Text>
          </View>
        )}
        {apiError && (
          <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{apiError}</Text>
        )}
        <TextInput
          label="Nazwa produktu"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          onSubmitEditing={() => Keyboard.dismiss()}
          returnKeyType="next"
        />
        <View style={styles.measurementToggle}>
          <Button
            mode={!isWeightMode ? "contained" : "outlined"}
            onPress={() => {
              setIsWeightMode(false);
              Keyboard.dismiss();
            }}
            style={styles.toggleButton}
            buttonColor={!isWeightMode ? theme.colors.primary : undefined}
            textColor={!isWeightMode ? theme.colors.onPrimary : theme.colors.primary}
          >
            Sztuki
          </Button>
          <Button
            mode={isWeightMode ? "contained" : "outlined"}
            onPress={() => {
              setIsWeightMode(true);
              Keyboard.dismiss();
            }}
            style={styles.toggleButton}
            buttonColor={isWeightMode ? theme.colors.primary : undefined}
            textColor={isWeightMode ? theme.colors.onPrimary : theme.colors.primary}
          >
            Kilogramy
          </Button>
        </View>
        {isWeightMode ? (
          <TextInput
            label="Waga (kg)"
            value={weight}
            onChangeText={setWeight}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="next"
          />
        ) : (
          <TextInput
            label="Ilość (szt.)"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="next"
          />
        )}
        {/* Kategoria */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 4, color: theme.colors.onBackground }}>Kategoria *</Text>
          <Button
            mode="outlined"
            onPress={() => {
              Keyboard.dismiss();
              setCategoryModalVisible(true);
            }}
            style={[styles.input, !category && styles.requiredInput]}
            contentStyle={{ justifyContent: 'flex-start' }}
            icon="menu-down"
          >
            {category || 'Wybierz kategorię...'}
          </Button>
          <Portal>
            <Modal
              visible={categoryModalVisible}
              onDismiss={() => setCategoryModalVisible(false)}
              contentContainerStyle={{
                backgroundColor: theme.colors.background,
                margin: 32,
                borderRadius: 12,
                padding: 8,
              }}
            >
              {CATEGORIES.map(cat => (
                <List.Item
                  key={cat}
                  title={cat}
                  onPress={() => {
                    setCategory(cat);
                    setCategoryModalVisible(false);
                    Keyboard.dismiss();
                  }}
                />
              ))}
            </Modal>
          </Portal>
        </View>
        <TextInput
          label="Kod kreskowy"
          value={barcode}
          onChangeText={setBarcode}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          editable={!searchParams?.barcode}
          onSubmitEditing={() => Keyboard.dismiss()}
          returnKeyType="done"
        />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#1e293b' }}>
        <View style={styles.formButtonsRow}>
          <Button
            mode="contained"
            onPress={() => {
              Keyboard.dismiss();
              handleSubmit();
            }}
            style={styles.submitButton}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            contentStyle={{ height: 48, justifyContent: 'center' }}
          >
            Dodaj produkt
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  formScroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 80,
  },
  formButtonsRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  input: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  requiredInput: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  measurementToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 8,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
});

export const options = {
  headerShown: false,
}; 