// Shared types and enums that can be used on both client and server

// Enums for type safety
export enum UserRole {
	ADMIN = 'admin',
	MANAGER = 'manager',
	USER = 'user'
}

export enum UserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive'
}

export enum ProductCategory {
	ELECTRONICS = 'electronics',
	CLOTHING = 'clothing',
	HOME = 'home',
	BOOKS = 'books',
	SPORTS = 'sports'
}

export enum ProductStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive'
}

export enum OrderStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled'
}

export enum PaymentStatus {
	UNPAID = 'unpaid',
	PAID = 'paid',
	REFUNDED = 'refunded'
}

// Type interfaces
export interface User {
	id: number;
	name: string;
	email: string;
	role: UserRole;
	status: UserStatus;
	createdAt: string;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	category: ProductCategory;
	stock: number;
	status: ProductStatus;
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
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	shippingAddress: string;
	createdAt: string;
}

