/**
 * Table configuration for different data types
 */

import type { User, Product, Order } from '$lib/server/data';

export const userColumns = [
	{ key: 'id', label: 'ID', width: '80px' },
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'email', label: 'Email', sortable: true },
	{ key: 'role', label: 'Role', width: '120px' },
	{ key: 'status', label: 'Status', width: '120px' },
	{ key: 'createdAt', label: 'Created', width: '120px' },
	{ key: 'actions', label: 'Actions', width: '160px' }
];

export const productColumns = [
	{ key: 'id', label: 'ID', width: '80px' },
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'description', label: 'Description' },
	{ key: 'price', label: 'Price', width: '100px' },
	{ key: 'category', label: 'Category', width: '120px' },
	{ key: 'stock', label: 'Stock', width: '80px' },
	{ key: 'status', label: 'Status', width: '120px' },
	{ key: 'actions', label: 'Actions', width: '160px' }
];

export const orderColumns = [
	{ key: 'orderNumber', label: 'Order #', width: '120px' },
	{ key: 'customer', label: 'Customer', sortable: true },
	{ key: 'items', label: 'Items', width: '100px' },
	{ key: 'total', label: 'Total', width: '100px' },
	{ key: 'status', label: 'Status', width: '120px' },
	{ key: 'payment', label: 'Payment', width: '120px' },
	{ key: 'date', label: 'Date', width: '120px' },
	{ key: 'actions', label: 'Actions', width: '160px' }
];

export const statusFilters = [
	{ name: 'status', value: '', label: 'All Status' },
	{ name: 'status', value: 'pending', label: 'Pending' },
	{ name: 'status', value: 'processing', label: 'Processing' },
	{ name: 'status', value: 'shipped', label: 'Shipped' },
	{ name: 'status', value: 'delivered', label: 'Delivered' },
	{ name: 'status', value: 'cancelled', label: 'Cancelled' }
];

export const roleFilters = [
	{ name: 'role', value: '', label: 'All Roles' },
	{ name: 'role', value: 'admin', label: 'Admin' },
	{ name: 'role', value: 'manager', label: 'Manager' },
	{ name: 'role', value: 'user', label: 'User' }
];

export const categoryFilters = [
	{ name: 'category', value: '', label: 'All Categories' },
	{ name: 'category', value: 'electronics', label: 'Electronics' },
	{ name: 'category', value: 'clothing', label: 'Clothing' },
	{ name: 'category', value: 'home', label: 'Home' },
	{ name: 'category', value: 'books', label: 'Books' },
	{ name: 'category', value: 'sports', label: 'Sports' }
];
