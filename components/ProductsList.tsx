import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Card, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Product } from '../lib/data/products';

interface ProductsListProps {
    products: Product[];
    onProductPress?: (product: Product) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ products, onProductPress }) => {
    const theme = useTheme();

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableRipple
            onPress={() => onProductPress?.(item)}
            style={styles.cardContainer}
        >
            <Card style={styles.card}>
                <Card.Title
                    title={item.name}
                    subtitle={item.category}
                    left={(props) => (
                        item.image ? (
                            <Avatar.Image {...props} source={{ uri: item.image }} />
                        ) : (
                            <Avatar.Icon {...props} icon="shopping" />
                        )
                    )}
                />
                <Card.Content style={styles.cardContent}>
                    <View>
                        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
                            ${item.price.toFixed(2)}
                        </Text>
                        <Text variant="bodyMedium">
                            {item.quantity} {item.unit}
                        </Text>
                    </View>
                    {item.notes && (
                        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                            {item.notes}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        </TouchableRipple>
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
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        elevation: 2,
    },
    cardContent: {
        paddingTop: 8,
    },
}); 