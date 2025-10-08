/**
 * Order Helper Functions
 * Reusable utilities for order processing and calculations
 */

import type { OrderItem } from '$lib/stores/data';

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
	const year = new Date().getFullYear();
	const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
	const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
	return `ORD-${year}${month}-${randomNum}`;
}

/**
 * Calculate total amount from order items
 */
export function calculateOrderTotal(items: OrderItem[]): number {
	return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
}

/**
 * Calculate subtotal for a single item
 */
export function calculateItemSubtotal(quantity: number, price: number): number {
	return quantity * price;
}

/**
 * Calculate tax amount (example: 10% tax rate)
 */
export function calculateTax(subtotal: number, taxRate: number = 0.1): number {
	return subtotal * taxRate;
}

/**
 * Calculate shipping cost based on order total
 */
export function calculateShipping(orderTotal: number, freeShippingThreshold: number = 100): number {
	return orderTotal >= freeShippingThreshold ? 0 : 10;
}

/**
 * Calculate final order total with tax and shipping
 */
export function calculateFinalTotal(
	items: OrderItem[],
	taxRate: number = 0.1,
	freeShippingThreshold: number = 100
): {
	subtotal: number;
	tax: number;
	shipping: number;
	total: number;
} {
	const subtotal = calculateOrderTotal(items);
	const tax = calculateTax(subtotal, taxRate);
	const shipping = calculateShipping(subtotal, freeShippingThreshold);
	const total = subtotal + tax + shipping;

	return { subtotal, tax, shipping, total };
}

/**
 * Validate order items
 */
export function validateOrderItems(items: OrderItem[]): { valid: boolean; error: string } {
	if (items.length === 0) {
		return { valid: false, error: 'Please add at least one item to the order' };
	}

	for (const item of items) {
		if (item.quantity <= 0) {
			return { valid: false, error: `Invalid quantity for ${item.productName}` };
		}
		if (item.price <= 0) {
			return { valid: false, error: `Invalid price for ${item.productName}` };
		}
	}

	return { valid: true, error: '' };
}

/**
 * Format order status for display
 */
export function getOrderStatusLabel(status: string): string {
	const statusMap: Record<string, string> = {
		'pending': 'Pending',
		'processing': 'Processing',
		'shipped': 'Shipped',
		'delivered': 'Delivered',
		'cancelled': 'Cancelled'
	};
	return statusMap[status.toLowerCase()] || status;
}

/**
 * Get next order status in the workflow
 */
export function getNextOrderStatus(currentStatus: string): string | null {
	const statusFlow: Record<string, string> = {
		'pending': 'processing',
		'processing': 'shipped',
		'shipped': 'delivered',
		'delivered': null,
		'cancelled': null
	};
	return statusFlow[currentStatus.toLowerCase()] || null;
}

/**
 * Check if order can be edited
 */
export function canEditOrder(status: string): boolean {
	const editableStatuses = ['pending', 'processing'];
	return editableStatuses.includes(status.toLowerCase());
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: string): boolean {
	const cancellableStatuses = ['pending', 'processing'];
	return cancellableStatuses.includes(status.toLowerCase());
}

/**
 * Search/filter orders by multiple criteria
 */
export function searchOrders<T extends { 
	orderNumber?: string;
	customerName?: string;
	customerEmail?: string;
}>(orders: T[], searchTerm: string): T[] {
	if (!searchTerm.trim()) {
		return orders;
	}

	const term = searchTerm.toLowerCase();
	return orders.filter(order =>
		order.orderNumber?.toLowerCase().includes(term) ||
		order.customerName?.toLowerCase().includes(term) ||
		order.customerEmail?.toLowerCase().includes(term)
	);
}

