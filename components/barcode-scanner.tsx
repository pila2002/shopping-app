import { useBarcodeScan } from '@/app/components/BarcodeScanContext';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Vibration, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;

export default function BarcodeScanner() {
    const scanningEnabled = useRef(true);
    const theme = useTheme();

    const [permission, requestPermission] = useCameraPermissions();

    const { onScanned, resetScan } = useBarcodeScan();
    const { id } = useLocalSearchParams<{ id: string }>();

    async function onBarcodeScanned({ data }: BarcodeScanningResult) {
        Vibration.vibrate();
        onScanned(data);
        console.log('Przekierowanie na:', `/list/${id}/add?barcode=${data}`, 'id:', id);
        router.replace(`/list/${id}/add?barcode=${data}`);
        setTimeout(() => {
            resetScan();
        }, 1000);
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>Potrzebujemy Twojej zgody aby skanować kody kreskowe</Text>
                <Button onPress={requestPermission}>Zezwalaj</Button>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <CameraView style={styles.camera} facing="back" onBarcodeScanned={onBarcodeScanned}>
                <View style={styles.overlay}>
                    <View style={styles.unfocusedContainer}></View>
                    <View style={styles.middleContainer}>
                        <View style={styles.unfocusedContainer}></View>
                        <View style={styles.focusedContainer}>
                            {/* Scanner corners */}
                            <View style={[styles.cornerTopLeft, styles.corner]} />
                            <View style={[styles.cornerTopRight, styles.corner]} />
                            <View style={[styles.cornerBottomLeft, styles.corner]} />
                            <View style={[styles.cornerBottomRight, styles.corner]} />
                        </View>
                        <View style={styles.unfocusedContainer}></View>
                    </View>
                    <View style={styles.unfocusedContainer}>
                        <Text style={styles.text}>Umieść kod kreskowy w ramce</Text>
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        flexDirection: 'row',
        height: SCAN_AREA_SIZE,
    },
    focusedContainer: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#FFFFFF',
        borderWidth: 3,
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 40,
    },
});
