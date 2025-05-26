import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Skanowanie niedostępne" />
      </Appbar.Header>
      <View style={styles.centered}>
        <Text variant="titleLarge" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
          Funkcja skanowania kodów kreskowych jest obecnie niedostępna.
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, textAlign: 'center', marginTop: 16 }}>
          Dodaj produkty ręcznie lub spróbuj ponownie później.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
}); 