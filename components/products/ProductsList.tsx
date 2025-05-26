import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Product } from '../../lib/data/products';
import { ProductCard } from './ProductCard';

interface ProductsListProps {
    products: Product[];
    onProductPress?: (product: Product) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ products, onProductPress }) => {
    const renderItem = ({ item }: { item: Product }) => (
        <ProductCard product={item} onPress={onProductPress} />
    );

    return (
        <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
}); 