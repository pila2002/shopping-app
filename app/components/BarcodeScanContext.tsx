import { router } from 'expo-router';
import React, { createContext, useContext, useRef } from 'react';

// Typ callbacku po zeskanowaniu kodu
export type BarcodeScanCallback = (code: string) => void;

interface BarcodeScanContextType {
    startScan: (callback: BarcodeScanCallback) => void;
    onScanned: BarcodeScanCallback;
    resetScan: () => void;
}

const BarcodeScanContext = createContext<BarcodeScanContextType | undefined>(undefined);

export const BarcodeScanProvider = ({ children }: { children: React.ReactNode }) => {
    const callbackRef = useRef<BarcodeScanCallback | null>(null);
    const scanLocked = useRef(false);

    const startScan = (callback: BarcodeScanCallback) => {
        callbackRef.current = callback;
        scanLocked.current = false;
        router.push('/scan');
    };

    // Funkcja do wywołania po zeskanowaniu kodu
    const onScanned = (code: string) => {
        if (scanLocked.current) return;
        scanLocked.current = true;
        console.log('onScanned', code);
        if (callbackRef.current) {
            callbackRef.current(code);
            callbackRef.current = null;
        }
    };

    const resetScan = () => {
        scanLocked.current = false;
    };

    return (
        <BarcodeScanContext.Provider value={{ startScan, onScanned, resetScan }}>
            {children}
        </BarcodeScanContext.Provider>
    );
};

export const useBarcodeScan = () => {
    const context = useContext(BarcodeScanContext);
    if (!context) {
        throw new Error('useBarcodeScan must be used within a BarcodeScanProvider');
    }
    return context;
};

export default BarcodeScanContext;
