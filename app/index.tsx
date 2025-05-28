import { Link, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, List, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addShoppingList, deleteShoppingList, getShoppingLists, ShoppingList } from '../lib/db/database';

export default function ShoppingListsScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);

  const loadLists = async () => {
    const data = await getShoppingLists(db);
    setLists(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [])
  );

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    await addShoppingList(db, newListName.trim());
    setNewListName('');
    loadLists();
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, 100);
  };

  const handleDeleteList = (id: number) => {
    Alert.alert(
      'Usuń listę',
      'Czy na pewno chcesz usunąć tę listę i wszystkie jej produkty?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            await deleteShoppingList(db, id);
            loadLists();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ShoppingList }) => (
    <Link href={{ pathname: '/list/[id]', params: { id: item.id?.toString() ?? '' } }} asChild>
    <List.Item
        title={<Text style={[styles.listName, { color: theme.colors.primary, fontSize: 20, fontWeight: 'bold' }]}>{item.name}</Text>}
        description={item.createdAt && `Utworzono: ${new Date(item.createdAt).toLocaleString('pl-PL', { hour12: false, timeZone: 'Europe/Warsaw' })}`}
      right={props => (
        <IconButton
          icon="delete-outline"
          iconColor={theme.colors.error}
            onPress={() => item.id && handleDeleteList(item.id)}
        />
      )}
      style={styles.listItem}
    />
    </Link>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
          <Appbar.Content title="Listy zakupów" titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>
        <FlatList
          ref={flatListRef}
          data={lists}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString() ?? ''}
          contentContainerStyle={[styles.listContent, { paddingBottom: 72 }]}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: theme.colors.onBackground }}>Brak list zakupów</Text>}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="always"
        />
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#1e293b' }}>
          <View style={styles.addRow}>
            <TextInput
              label="Nowa lista zakupów"
              value={newListName}
              onChangeText={setNewListName}
              mode="outlined"
              style={styles.inputRow}
              onSubmitEditing={handleAddList}
              returnKeyType="done"
            />
            <Button
              mode="contained"
              onPress={handleAddList}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              style={styles.addButtonRow}
              contentStyle={{ height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }}
            >
              Dodaj
            </Button>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  listItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listName: {
    fontSize: 18,
  },
  addRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  inputRow: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    height: 40,
    fontSize: 16,
  },
  addButtonRow: {
    borderRadius: 8,
    height: 40,
    minWidth: 80,
    alignSelf: 'center',
    marginLeft: 0,
  },
}); 