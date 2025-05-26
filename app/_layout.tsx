import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { BarcodeScanProvider } from './components/BarcodeScanContext';
import DatabaseInitializer from './components/DatabaseInitializer';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

export default function Layout() {
    return (
        <PaperProvider theme={theme}>
            <SQLiteProvider databaseName="shopping_list.db">
                <DatabaseInitializer />
                <BarcodeScanProvider>
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={{
                                title: 'Shopping List',
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="add"
                            options={{
                                title: 'Add Item',
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="scan"
                            options={{
                                title: 'Scan Barcode',
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="list/[id]"
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="list/[id]/add"
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="list/[id]/edit/[itemId]"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack>
                </BarcodeScanProvider>
            </SQLiteProvider>
        </PaperProvider>
    );
}
