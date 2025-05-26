import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Product } from '../../lib/data/products';

interface ProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const theme = useTheme();

    return (
        <TouchableRipple
            onPress={() => onPress?.(product)}
            style={styles.cardContainer}
            borderless
        >
            <Surface 
                style={[
                    styles.card, 
                    { 
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.outline,
                    }
                ]} 
                elevation={0}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.leftContent}>
                        <IconButton
                            icon={product.category?.toLowerCase() === 'dairy' ? 'cup' : 'shopping'}
                            size={32}
                            iconColor={theme.colors.primary}
                        />
                        <View style={styles.textContainer}>
                            <Text variant="titleMedium" style={styles.title}>
                                {product.name}
                            </Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                                {product.category}
                            </Text>
                            <Text variant="bodyMedium" style={styles.quantity}>
                                {product.quantity} {product.unit}
                            </Text>
                        </View>
                    </View>
                    <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
                        {product.price.toFixed(2)} zł
                    </Text>
                </View>
                {product.notes && (
                    <View style={[styles.notesContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Text 
                            variant="bodySmall" 
                            style={[styles.notes, { color: theme.colors.onSurfaceVariant }]}
                        >
                            {product.notes}
                        </Text>
                    </View>
                )}
            </Surface>
        </TouchableRipple>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        marginLeft: 8,
        flex: 1,
    },
    title: {
        fontWeight: '500',
    },
    quantity: {
        marginTop: 4,
    },
    price: {
        fontWeight: '700',
        marginLeft: 16,
    },
    notesContainer: {
        marginTop: 0,
        padding: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    notes: {
        fontStyle: 'italic',
    },
}); 