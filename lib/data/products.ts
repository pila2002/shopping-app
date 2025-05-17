export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    image?: string;
    notes?: string;
}

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Milk',
        category: 'Dairy',
        price: 2.99,
        quantity: 1,
        unit: 'L',
        image: 'https://picsum.photos/200',
        notes: 'Full fat milk'
    },
    {
        id: '2',
        name: 'Bread',
        category: 'Bakery',
        price: 1.99,
        quantity: 1,
        unit: 'piece',
        image: 'https://picsum.photos/200',
        notes: 'Whole grain'
    },
    {
        id: '3',
        name: 'Eggs',
        category: 'Dairy',
        price: 3.49,
        quantity: 12,
        unit: 'pieces',
        image: 'https://picsum.photos/200'
    },
    {
        id: '4',
        name: 'Bananas',
        category: 'Fruits',
        price: 0.99,
        quantity: 1,
        unit: 'kg',
        image: 'https://picsum.photos/200'
    },
    {
        id: '5',
        name: 'Chicken Breast',
        category: 'Meat',
        price: 5.99,
        quantity: 1,
        unit: 'kg',
        image: 'https://picsum.photos/200',
        notes: 'Fresh, skinless'
    }
];
