import { writable } from 'svelte/store';

// Interfaces
export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive';
	createdAt: string;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	status: 'active' | 'inactive';
	createdAt: string;
}

export interface OrderItem {
	productId: number;
	productName: string;
	quantity: number;
	price: number;
}

export interface Order {
	id: number;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	items: OrderItem[];
	totalAmount: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	paymentStatus: 'unpaid' | 'paid' | 'refunded';
	shippingAddress: string;
	createdAt: string;
}

// Initial dummy data
const initialUsers: User[] = [
	{ id: 1, name: 'Mohammad', email: 'mohammad@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
	{ id: 2, name: 'Yusuf', email: 'yusuf@example.com', role: 'user', status: 'active', createdAt: '2024-01-16' },
	{ id: 3, name: 'Bilal', email: 'bilal@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-17' },
	{ id: 4, name: 'Sarah', email: 'sarah@example.com', role: 'manager', status: 'active', createdAt: '2024-01-18' },
	{ id: 5, name: 'Ahmed', email: 'ahmed@example.com', role: 'user', status: 'active', createdAt: '2024-01-19' }
];

const initialProducts: Product[] = [
	{ id: 1, name: 'iPhone 15 Pro', description: 'Latest iPhone with advanced camera system', price: 999, category: 'electronics', stock: 50, status: 'active', createdAt: '2024-01-15' },
	{ id: 2, name: 'MacBook Air M2', description: 'Ultra-thin laptop with M2 chip', price: 1199, category: 'electronics', stock: 25, status: 'active', createdAt: '2024-01-16' },
	{ id: 3, name: 'Nike Air Max', description: 'Comfortable running shoes', price: 120, category: 'clothing', stock: 100, status: 'active', createdAt: '2024-01-17' },
	{ id: 4, name: 'Coffee Maker', description: 'Automatic drip coffee maker', price: 89, category: 'home', stock: 0, status: 'inactive', createdAt: '2024-01-18' },
	{ id: 5, name: 'Wireless Headphones', description: 'Noise-cancelling wireless headphones', price: 199, category: 'electronics', stock: 75, status: 'active', createdAt: '2024-01-19' }
];

const initialOrders: Order[] = [
	{
		id: 1,
		orderNumber: 'ORD-2024-001',
		customerName: 'Mohammad Ali',
		customerEmail: 'mohammad@example.com',
		items: [
			{ productId: 1, productName: 'iPhone 15 Pro', quantity: 1, price: 999 },
			{ productId: 5, productName: 'Wireless Headphones', quantity: 1, price: 199 }
		],
		totalAmount: 1198,
		status: 'delivered',
		paymentStatus: 'paid',
		shippingAddress: '123 Main St, New York, NY 10001',
		createdAt: '2024-01-15'
	},
	{
		id: 2,
		orderNumber: 'ORD-2024-002',
		customerName: 'Yusuf Ahmed',
		customerEmail: 'yusuf@example.com',
		items: [
			{ productId: 2, productName: 'MacBook Air M2', quantity: 1, price: 1199 }
		],
		totalAmount: 1199,
		status: 'processing',
		paymentStatus: 'paid',
		shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
		createdAt: '2024-01-16'
	},
	{
		id: 3,
		orderNumber: 'ORD-2024-003',
		customerName: 'Bilal Khan',
		customerEmail: 'bilal@example.com',
		items: [
			{ productId: 3, productName: 'Nike Air Max', quantity: 2, price: 120 }
		],
		totalAmount: 240,
		status: 'shipped',
		paymentStatus: 'paid',
		shippingAddress: '789 Pine Rd, Chicago, IL 60601',
		createdAt: '2024-01-17'
	},
	{
		id: 4,
		orderNumber: 'ORD-2024-004',
		customerName: 'Sarah Johnson',
		customerEmail: 'sarah@example.com',
		items: [
			{ productId: 4, productName: 'Coffee Maker', quantity: 1, price: 89 }
		],
		totalAmount: 89,
		status: 'pending',
		paymentStatus: 'unpaid',
		shippingAddress: '321 Elm St, Houston, TX 77001',
		createdAt: '2024-01-18'
	},
	{
		id: 5,
		orderNumber: 'ORD-2024-005',
		customerName: 'Ahmed Hassan',
		customerEmail: 'ahmed@example.com',
		items: [
			{ productId: 5, productName: 'Wireless Headphones', quantity: 3, price: 199 }
		],
		totalAmount: 597,
		status: 'cancelled',
		paymentStatus: 'refunded',
		shippingAddress: '654 Maple Dr, Miami, FL 33101',
		createdAt: '2024-01-19'
	}
];

// Load from localStorage or use initial data
function loadFromStorage<T>(key: string, defaultData: T): T {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(key);
		if (stored) {
			return JSON.parse(stored);
		}
	}
	return defaultData;
}

function saveToStorage<T>(key: string, data: T) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(data));
	}
}

// Create stores
function createDataStore<T extends { id: number }>(storageKey: string, initialData: T[]) {
	const { subscribe, set, update } = writable<T[]>(loadFromStorage(storageKey, initialData));

	return {
		subscribe,
		
		add: (item: Omit<T, 'id' | 'createdAt'>) => {
			update(items => {
				const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
				const newItem = {
					...item,
					id: maxId + 1,
					createdAt: new Date().toISOString().split('T')[0]
				} as T;
				const newItems = [...items, newItem];
				saveToStorage(storageKey, newItems);
				return newItems;
			});
		},

		update: (id: number, updates: Partial<T>) => {
			update(items => {
				const newItems = items.map(item => 
					item.id === id ? { ...item, ...updates } : item
				);
				saveToStorage(storageKey, newItems);
				return newItems;
			});
		},

		remove: (id: number) => {
			update(items => {
				const newItems = items.filter(item => item.id !== id);
				saveToStorage(storageKey, newItems);
				return newItems;
			});
		},

		reset: () => {
			set(initialData);
			saveToStorage(storageKey, initialData);
		},

		getById: (id: number): T | undefined => {
			let found: T | undefined;
			update(items => {
				found = items.find(item => item.id === id);
				return items;
			});
			return found;
		}
	};
}

// Export stores
export const usersStore = createDataStore<User>('dashboard_users', initialUsers);
export const productsStore = createDataStore<Product>('dashboard_products', initialProducts);
export const ordersStore = createDataStore<Order>('dashboard_orders', initialOrders);

