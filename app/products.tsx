import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ProductsList } from '../components/ProductsList';
import { mockProducts, Product } from '../lib/data/products';

export default function ProductsScreen() {
    const theme = useTheme();

    const handleProductPress = (product: Product) => {
        // TODO: Handle product selection
        console.log('Product selected:', product);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ProductsList
                products={mockProducts}
                onProductPress={handleProductPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
}); 