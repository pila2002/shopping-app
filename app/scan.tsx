import BarcodeScanner from '@/components/barcode-scanner';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ScanScreen() {
    return <BarcodeScanner />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});
