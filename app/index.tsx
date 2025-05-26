import { Link, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, List, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addShoppingList, deleteShoppingList, getShoppingLists, ShoppingList } from '../lib/db/database';

export default function ShoppingListsScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');

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
        description={item.createdAt && `Utworzono: ${item.createdAt}`}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
        <Appbar.Content title="Listy zakupów" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() ?? ''}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: theme.colors.onBackground }}>Brak list zakupów</Text>}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View style={[styles.addRow, { backgroundColor: theme.colors.background }]}> 
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
          >
            Dodaj
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
    paddingBottom: 32,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '500',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginBottom: 24,
  },
  inputRow: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'white',
  },
  addButtonRow: {
    borderRadius: 8,
    paddingVertical: 4,
  },
}); 