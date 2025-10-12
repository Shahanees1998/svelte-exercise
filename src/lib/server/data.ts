import {
	UserRole,
	UserStatus,
	ProductCategory,
	ProductStatus,
	OrderStatus,
	PaymentStatus,
	type User,
	type Product,
	type Order,
	type OrderItem
} from '$lib/types';

export {
	UserRole,
	UserStatus,
	ProductCategory,
	ProductStatus,
	OrderStatus,
	PaymentStatus,
	type User,
	type Product,
	type Order,
	type OrderItem
};

const STORAGE_KEYS = {
	users: 'dashboard_users',
	products: 'dashboard_products',
	orders: 'dashboard_orders',
	version: 'dashboard_version'
} as const;

const CURRENT_VERSION = 2;

const initialUsers: User[] = [
	{ id: 1, name: 'Mohammad', email: 'mohammad@example.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE, createdAt: '2024-01-15' },
	{ id: 2, name: 'Yusuf', email: 'yusuf@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, createdAt: '2024-01-16' },
	{ id: 3, name: 'Bilal', email: 'bilal@example.com', role: UserRole.USER, status: UserStatus.INACTIVE, createdAt: '2024-01-17' },
	{ id: 4, name: 'Sarah', email: 'sarah@example.com', role: UserRole.MANAGER, status: UserStatus.ACTIVE, createdAt: '2024-01-18' },
	{ id: 5, name: 'Ahmed', email: 'ahmed@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, createdAt: '2024-01-19' },
	{ id: 6, name: 'Fatima', email: 'fatima@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, createdAt: '2024-01-20' },
	{ id: 7, name: 'Omar', email: 'omar@example.com', role: UserRole.MANAGER, status: UserStatus.ACTIVE, createdAt: '2024-01-21' },
	{ id: 8, name: 'Aisha', email: 'aisha@example.com', role: UserRole.USER, status: UserStatus.INACTIVE, createdAt: '2024-01-22' },
	{ id: 9, name: 'Hassan', email: 'hassan@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, createdAt: '2024-01-23' },
	{ id: 10, name: 'Zainab', email: 'zainab@example.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE, createdAt: '2024-01-24' },
	{ id: 11, name: 'Ibrahim', email: 'ibrahim@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, createdAt: '2024-01-25' },
	{ id: 12, name: 'Khadija', email: 'khadija@example.com', role: UserRole.MANAGER, status: UserStatus.ACTIVE, createdAt: '2024-01-26' },
	{ id: 13, name: 'Ali', email: 'ali@example.com', role: UserRole.USER, status: UserStatus.INACTIVE, createdAt: '2024-01-27' },
	{ id: 14, name: 'Mariam', email: 'mariam@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, createdAt: '2024-01-28' },
	{ id: 15, name: 'Youssef', email: 'youssef@example.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE, createdAt: '2024-01-29' }
];

const initialProducts: Product[] = [
	{ id: 1, name: 'iPhone 15 Pro', description: 'Latest iPhone with advanced camera system', price: 999, category: ProductCategory.ELECTRONICS, stock: 50, status: ProductStatus.ACTIVE, createdAt: '2024-01-15' },
	{ id: 2, name: 'MacBook Air M2', description: 'Ultra-thin laptop with M2 chip', price: 1199, category: ProductCategory.ELECTRONICS, stock: 25, status: ProductStatus.ACTIVE, createdAt: '2024-01-16' },
	{ id: 3, name: 'Nike Air Max', description: 'Comfortable running shoes', price: 120, category: ProductCategory.CLOTHING, stock: 100, status: ProductStatus.ACTIVE, createdAt: '2024-01-17' },
	{ id: 4, name: 'Coffee Maker', description: 'Automatic drip coffee maker', price: 89, category: ProductCategory.HOME, stock: 0, status: ProductStatus.INACTIVE, createdAt: '2024-01-18' },
	{ id: 5, name: 'Wireless Headphones', description: 'Noise-cancelling wireless headphones', price: 199, category: ProductCategory.ELECTRONICS, stock: 75, status: ProductStatus.ACTIVE, createdAt: '2024-01-19' },
	{ id: 6, name: 'Samsung Galaxy S24', description: 'Latest Android flagship smartphone', price: 899, category: ProductCategory.ELECTRONICS, stock: 40, status: ProductStatus.ACTIVE, createdAt: '2024-01-20' },
	{ id: 7, name: 'Leather Jacket', description: 'Premium leather jacket for men', price: 250, category: ProductCategory.CLOTHING, stock: 20, status: ProductStatus.ACTIVE, createdAt: '2024-01-21' },
	{ id: 8, name: 'The Great Gatsby', description: 'Classic American novel', price: 15, category: ProductCategory.BOOKS, stock: 150, status: ProductStatus.ACTIVE, createdAt: '2024-01-22' },
	{ id: 9, name: 'Yoga Mat', description: 'Non-slip exercise yoga mat', price: 35, category: ProductCategory.SPORTS, stock: 80, status: ProductStatus.ACTIVE, createdAt: '2024-01-23' },
	{ id: 10, name: 'Smart Watch', description: 'Fitness tracking smart watch', price: 299, category: ProductCategory.ELECTRONICS, stock: 60, status: ProductStatus.ACTIVE, createdAt: '2024-01-24' },
	{ id: 11, name: 'Desk Lamp', description: 'Modern LED desk lamp', price: 45, category: ProductCategory.HOME, stock: 90, status: ProductStatus.ACTIVE, createdAt: '2024-01-25' },
	{ id: 12, name: 'Running Shoes', description: 'Professional running shoes', price: 140, category: ProductCategory.SPORTS, stock: 70, status: ProductStatus.ACTIVE, createdAt: '2024-01-26' },
	{ id: 13, name: 'Harry Potter Set', description: 'Complete Harry Potter book collection', price: 120, category: ProductCategory.BOOKS, stock: 30, status: ProductStatus.ACTIVE, createdAt: '2024-01-27' },
	{ id: 14, name: 'Sofa Cushions', description: 'Comfortable decorative cushions', price: 40, category: ProductCategory.HOME, stock: 100, status: ProductStatus.ACTIVE, createdAt: '2024-01-28' },
	{ id: 15, name: 'Denim Jeans', description: 'Classic blue denim jeans', price: 65, category: ProductCategory.CLOTHING, stock: 120, status: ProductStatus.ACTIVE, createdAt: '2024-01-29' }
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
		status: OrderStatus.DELIVERED,
		paymentStatus: PaymentStatus.PAID,
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
		status: OrderStatus.PROCESSING,
		paymentStatus: PaymentStatus.PAID,
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
		status: OrderStatus.SHIPPED,
		paymentStatus: PaymentStatus.PAID,
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
		status: OrderStatus.PENDING,
		paymentStatus: PaymentStatus.UNPAID,
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
		status: OrderStatus.CANCELLED,
		paymentStatus: PaymentStatus.REFUNDED,
		shippingAddress: '654 Maple Dr, Miami, FL 33101',
		createdAt: '2024-01-19'
	},
	{
		id: 6,
		orderNumber: 'ORD-2024-006',
		customerName: 'Fatima Ali',
		customerEmail: 'fatima@example.com',
		items: [
			{ productId: 6, productName: 'Samsung Galaxy S24', quantity: 1, price: 899 }
		],
		totalAmount: 899,
		status: OrderStatus.DELIVERED,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '123 Cedar Ave, Seattle, WA 98101',
		createdAt: '2024-01-20'
	},
	{
		id: 7,
		orderNumber: 'ORD-2024-007',
		customerName: 'Omar Khalil',
		customerEmail: 'omar@example.com',
		items: [
			{ productId: 7, productName: 'Leather Jacket', quantity: 1, price: 250 },
			{ productId: 15, productName: 'Denim Jeans', quantity: 2, price: 65 }
		],
		totalAmount: 380,
		status: OrderStatus.PROCESSING,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '456 Birch Ln, Boston, MA 02101',
		createdAt: '2024-01-21'
	},
	{
		id: 8,
		orderNumber: 'ORD-2024-008',
		customerName: 'Aisha Rahman',
		customerEmail: 'aisha@example.com',
		items: [
			{ productId: 8, productName: 'The Great Gatsby', quantity: 1, price: 15 },
			{ productId: 13, productName: 'Harry Potter Set', quantity: 1, price: 120 }
		],
		totalAmount: 135,
		status: OrderStatus.SHIPPED,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '789 Willow St, Denver, CO 80201',
		createdAt: '2024-01-22'
	},
	{
		id: 9,
		orderNumber: 'ORD-2024-009',
		customerName: 'Hassan Ibrahim',
		customerEmail: 'hassan@example.com',
		items: [
			{ productId: 9, productName: 'Yoga Mat', quantity: 1, price: 35 },
			{ productId: 12, productName: 'Running Shoes', quantity: 1, price: 140 }
		],
		totalAmount: 175,
		status: OrderStatus.DELIVERED,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '321 Spruce Rd, Portland, OR 97201',
		createdAt: '2024-01-23'
	},
	{
		id: 10,
		orderNumber: 'ORD-2024-010',
		customerName: 'Zainab Malik',
		customerEmail: 'zainab@example.com',
		items: [
			{ productId: 10, productName: 'Smart Watch', quantity: 1, price: 299 }
		],
		totalAmount: 299,
		status: OrderStatus.PENDING,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '654 Ash Blvd, Austin, TX 78701',
		createdAt: '2024-01-24'
	},
	{
		id: 11,
		orderNumber: 'ORD-2024-011',
		customerName: 'Ibrahim Youssef',
		customerEmail: 'ibrahim@example.com',
		items: [
			{ productId: 11, productName: 'Desk Lamp', quantity: 2, price: 45 },
			{ productId: 14, productName: 'Sofa Cushions', quantity: 4, price: 40 }
		],
		totalAmount: 250,
		status: OrderStatus.PROCESSING,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '987 Cypress Dr, Phoenix, AZ 85001',
		createdAt: '2024-01-25'
	},
	{
		id: 12,
		orderNumber: 'ORD-2024-012',
		customerName: 'Khadija Omar',
		customerEmail: 'khadija@example.com',
		items: [
			{ productId: 1, productName: 'iPhone 15 Pro', quantity: 1, price: 999 }
		],
		totalAmount: 999,
		status: OrderStatus.SHIPPED,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '246 Redwood Ave, San Diego, CA 92101',
		createdAt: '2024-01-26'
	},
	{
		id: 13,
		orderNumber: 'ORD-2024-013',
		customerName: 'Ali Rashid',
		customerEmail: 'ali@example.com',
		items: [
			{ productId: 2, productName: 'MacBook Air M2', quantity: 1, price: 1199 },
			{ productId: 5, productName: 'Wireless Headphones', quantity: 1, price: 199 }
		],
		totalAmount: 1398,
		status: OrderStatus.DELIVERED,
		paymentStatus: PaymentStatus.PAID,
		shippingAddress: '135 Fir St, San Francisco, CA 94101',
		createdAt: '2024-01-27'
	},
	{
		id: 14,
		orderNumber: 'ORD-2024-014',
		customerName: 'Mariam Farah',
		customerEmail: 'mariam@example.com',
		items: [
			{ productId: 3, productName: 'Nike Air Max', quantity: 1, price: 120 }
		],
		totalAmount: 120,
		status: OrderStatus.PENDING,
		paymentStatus: PaymentStatus.UNPAID,
		shippingAddress: '864 Hickory Ln, Philadelphia, PA 19101',
		createdAt: '2024-01-28'
	},
	{
		id: 15,
		orderNumber: 'ORD-2024-015',
		customerName: 'Youssef Ahmed',
		customerEmail: 'youssef@example.com',
		items: [
			{ productId: 10, productName: 'Smart Watch', quantity: 2, price: 299 },
			{ productId: 9, productName: 'Yoga Mat', quantity: 1, price: 35 }
		],
		totalAmount: 633,
		status: OrderStatus.CANCELLED,
		paymentStatus: PaymentStatus.REFUNDED,
		shippingAddress: '753 Walnut Ave, Nashville, TN 37201',
		createdAt: '2024-01-29'
	}
];

const serverStorage: Record<string, unknown> = {};

function getFromStorage<T>(key: string, defaultValue: T): T {
	if (typeof window === 'undefined') {
		if (!serverStorage[key]) {
			serverStorage[key] = defaultValue;
		}
		return serverStorage[key] as T;
	}
	
	try {
		const storedVersion = localStorage.getItem(STORAGE_KEYS.version);
		if (storedVersion !== CURRENT_VERSION.toString()) {
			console.log('Schema version changed, clearing old data...');
			localStorage.clear();
			localStorage.setItem(STORAGE_KEYS.version, CURRENT_VERSION.toString());
			return defaultValue;
		}
		
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch {
		return defaultValue;
	}
}

function saveToStorage<T>(key: string, data: T): void {
	if (typeof window === 'undefined') {
		serverStorage[key] = data as unknown;
		return;
	}
	
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save to localStorage:', error);
	}
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

export const dataService = {
	getUsers(): User[] {
		return getFromStorage(STORAGE_KEYS.users, initialUsers);
	},

	getUsersPaginated(params: PaginationParams): PaginatedResult<User> {
		const { page = 1, limit = 10, search = '' } = params;
		
		let allUsers = this.getUsers();
		
		if (search) {
			const searchLower = search.toLowerCase();
			allUsers = allUsers.filter(u => 
				u.name.toLowerCase().includes(searchLower) ||
				u.email.toLowerCase().includes(searchLower) ||
				u.role.toLowerCase().includes(searchLower)
			);
		}
		
		const totalItems = allUsers.length;
		const totalPages = Math.ceil(totalItems / limit);
		const currentPage = Math.max(1, Math.min(page, totalPages || 1));
		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;
		
		const data = allUsers.slice(startIndex, endIndex);
		
		return {
			data,
			pagination: {
				currentPage,
				totalPages,
				totalItems,
				itemsPerPage: limit,
				hasNextPage: currentPage < totalPages,
				hasPrevPage: currentPage > 1
			}
		};
	},

	getUserById(id: number): User | undefined {
		const users = this.getUsers();
		return users.find(u => u.id === id);
	},

	addUser(user: Omit<User, 'id'>): User {
		const users = this.getUsers();
		const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
		const newUser: User = {
			...user,
			id: maxId + 1,
			createdAt: user.createdAt || new Date().toISOString().split('T')[0]
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

	getProducts(): Product[] {
		return getFromStorage(STORAGE_KEYS.products, initialProducts);
	},

	getProductsPaginated(params: PaginationParams): PaginatedResult<Product> {
		const { page = 1, limit = 10, search = '' } = params;
		
		let allProducts = this.getProducts();
		
		if (search) {
			const searchLower = search.toLowerCase();
			allProducts = allProducts.filter(p => 
				p.name.toLowerCase().includes(searchLower) ||
				p.description.toLowerCase().includes(searchLower) ||
				p.category.toLowerCase().includes(searchLower)
			);
		}
		
		const totalItems = allProducts.length;
		const totalPages = Math.ceil(totalItems / limit);
		const currentPage = Math.max(1, Math.min(page, totalPages || 1));
		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;
		
		const data = allProducts.slice(startIndex, endIndex);
		
		return {
			data,
			pagination: {
				currentPage,
				totalPages,
				totalItems,
				itemsPerPage: limit,
				hasNextPage: currentPage < totalPages,
				hasPrevPage: currentPage > 1
			}
		};
	},

	getProductById(id: number): Product | undefined {
		const products = this.getProducts();
		return products.find(p => p.id === id);
	},

	addProduct(product: Omit<Product, 'id'>): Product {
		const products = this.getProducts();
		const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
		const newProduct: Product = {
			...product,
			id: maxId + 1,
			createdAt: product.createdAt || new Date().toISOString().split('T')[0]
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

	getOrders(): Order[] {
		return getFromStorage(STORAGE_KEYS.orders, initialOrders);
	},

	getOrdersPaginated(params: PaginationParams): PaginatedResult<Order> {
		const { page = 1, limit = 10, search = '' } = params;
		
		let allOrders = this.getOrders();
		
		if (search) {
			const searchLower = search.toLowerCase();
			allOrders = allOrders.filter(o => 
				o.orderNumber.toLowerCase().includes(searchLower) ||
				o.customerName.toLowerCase().includes(searchLower) ||
				o.customerEmail.toLowerCase().includes(searchLower)
			);
		}
		
		const totalItems = allOrders.length;
		const totalPages = Math.ceil(totalItems / limit);
		const currentPage = Math.max(1, Math.min(page, totalPages || 1));
		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;
		
		const data = allOrders.slice(startIndex, endIndex);
		
		return {
			data,
			pagination: {
				currentPage,
				totalPages,
				totalItems,
				itemsPerPage: limit,
				hasNextPage: currentPage < totalPages,
				hasPrevPage: currentPage > 1
			}
		};
	},

	getOrderById(id: number): Order | undefined {
		const orders = this.getOrders();
		return orders.find(o => o.id === id);
	},

	addOrder(order: Omit<Order, 'id'>): Order {
		const orders = this.getOrders();
		const maxId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) : 0;
		const newOrder: Order = {
			...order,
			id: maxId + 1,
			createdAt: order.createdAt || new Date().toISOString().split('T')[0]
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


