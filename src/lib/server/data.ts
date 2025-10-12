// Server-side data storage using localStorage on client
// In a real app, this would be a database

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

const STORAGE_KEYS = {
	users: 'dashboard_users',
	products: 'dashboard_products',
	orders: 'dashboard_orders'
} as const;

// Initial data
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

// Helper functions for storage (works in browser)
function getFromStorage<T>(key: string, defaultValue: T): T {
	if (typeof window === 'undefined') return defaultValue;
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch {
		return defaultValue;
	}
}

function saveToStorage<T>(key: string, data: T): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save to localStorage:', error);
	}
}

// Data service
export const dataService = {
	// Users
	getUsers(): User[] {
		return getFromStorage(STORAGE_KEYS.users, initialUsers);
	},

	getUserById(id: number): User | undefined {
		const users = this.getUsers();
		return users.find(u => u.id === id);
	},

	addUser(user: Omit<User, 'id' | 'createdAt'>): User {
		const users = this.getUsers();
		const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
		const newUser: User = {
			...user,
			id: maxId + 1,
			createdAt: new Date().toISOString().split('T')[0]
		};
		const updated = [...users, newUser];
		saveToStorage(STORAGE_KEYS.users, updated);
		return newUser;
	},

	updateUser(id: number, updates: Partial<User>): User | null {
		const users = this.getUsers();
		const index = users.findIndex(u => u.id === id);
		if (index === -1) return null;
		
		const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
		saveToStorage(STORAGE_KEYS.users, updated);
		return updated[index];
	},

	deleteUser(id: number): boolean {
		const users = this.getUsers();
		const filtered = users.filter(u => u.id !== id);
		if (filtered.length === users.length) return false;
		saveToStorage(STORAGE_KEYS.users, filtered);
		return true;
	},

	// Products
	getProducts(): Product[] {
		return getFromStorage(STORAGE_KEYS.products, initialProducts);
	},

	getProductById(id: number): Product | undefined {
		const products = this.getProducts();
		return products.find(p => p.id === id);
	},

	addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
		const products = this.getProducts();
		const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
		const newProduct: Product = {
			...product,
			id: maxId + 1,
			createdAt: new Date().toISOString().split('T')[0]
		};
		const updated = [...products, newProduct];
		saveToStorage(STORAGE_KEYS.products, updated);
		return newProduct;
	},

	updateProduct(id: number, updates: Partial<Product>): Product | null {
		const products = this.getProducts();
		const index = products.findIndex(p => p.id === id);
		if (index === -1) return null;
		
		const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
		saveToStorage(STORAGE_KEYS.products, updated);
		return updated[index];
	},

	deleteProduct(id: number): boolean {
		const products = this.getProducts();
		const filtered = products.filter(p => p.id !== id);
		if (filtered.length === products.length) return false;
		saveToStorage(STORAGE_KEYS.products, filtered);
		return true;
	},

	// Orders
	getOrders(): Order[] {
		return getFromStorage(STORAGE_KEYS.orders, initialOrders);
	},

	getOrderById(id: number): Order | undefined {
		const orders = this.getOrders();
		return orders.find(o => o.id === id);
	},

	addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
		const orders = this.getOrders();
		const maxId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) : 0;
		const newOrder: Order = {
			...order,
			id: maxId + 1,
			createdAt: new Date().toISOString().split('T')[0]
		};
		const updated = [...orders, newOrder];
		saveToStorage(STORAGE_KEYS.orders, updated);
		return newOrder;
	},

	updateOrder(id: number, updates: Partial<Order>): Order | null {
		const orders = this.getOrders();
		const index = orders.findIndex(o => o.id === id);
		if (index === -1) return null;
		
		const updated = orders.map(o => o.id === id ? { ...o, ...updates } : o);
		saveToStorage(STORAGE_KEYS.orders, updated);
		return updated[index];
	},

	deleteOrder(id: number): boolean {
		const orders = this.getOrders();
		const filtered = orders.filter(o => o.id !== id);
		if (filtered.length === orders.length) return false;
		saveToStorage(STORAGE_KEYS.orders, filtered);
		return true;
	}
};


