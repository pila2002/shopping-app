import { router } from 'expo-router';
import React, { createContext, useContext, useRef } from 'react';

// Typ callbacku po zeskanowaniu kodu
export type BarcodeScanCallback = (code: string) => void;

interface BarcodeScanContextType {
  startScan: (callback: BarcodeScanCallback) => void;
}

const BarcodeScanContext = createContext<BarcodeScanContextType | undefined>(undefined);

interface BarcodeScanProviderProps {
  children: React.ReactElement<{
    onBarcodeScanned?: (code: string) => void;
  }>;
}

export const BarcodeScanProvider: React.FC<BarcodeScanProviderProps> = ({ children }) => {
  const callbackRef = useRef<BarcodeScanCallback | null>(null);

  const startScan = (callback: BarcodeScanCallback) => {
    callbackRef.current = callback;
    router.push('/scan');
  };

  // Funkcja do wywołania po zeskanowaniu kodu
  const onScanned = (code: string) => {
    if (callbackRef.current) {
      callbackRef.current(code);
      callbackRef.current = null;
    }
  };

  return (
    <BarcodeScanContext.Provider value={{ startScan }}>
      {/* Przekazujemy funkcję onScanned przez globalny obiekt */}
      {React.cloneElement(children, { onBarcodeScanned: onScanned })}
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