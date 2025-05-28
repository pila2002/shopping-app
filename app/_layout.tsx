import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { BarcodeScanProvider } from './components/BarcodeScanContext';
import DatabaseInitializer from './components/DatabaseInitializer';

export default function Layout() {
    const theme = {
      ...MD3DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        primary: '#3b82f6', // Jasny niebieski
        secondary: '#10b981', // Zielony akcent
        tertiary: '#f59e0b', // Pomarańczowy akcent
        background: '#0f172a', // Ciemne tło
        surface: '#1e293b', // Ciemna powierzchnia
        surfaceVariant: '#334155', // Ciemniejszy wariant powierzchni
        error: '#ef4444', // Czerwony dla błędów
        onPrimary: '#ffffff', // Biały tekst na kolorze primary
        onSecondary: '#ffffff', // Biały tekst na kolorze secondary
        onBackground: '#f8fafc', // Jasny tekst na tle
        onSurface: '#f8fafc', // Jasny tekst na powierzchni
        onSurfaceVariant: '#cbd5e1', // Jasnoszary tekst na wariantach
        outline: '#475569', // Ciemnoszara obwódka
        elevation: {
          level0: 'transparent',
          level1: '#1e293b',
          level2: '#334155',
          level3: '#475569',
          level4: '#64748b',
          level5: '#94a3b8',
        },
      },
    };
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
