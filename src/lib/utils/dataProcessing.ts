/**
 * Data Processing Utilities
 * Professional data transformation and calculation helpers
 */

import type { User, Product, Order } from '$lib/stores/data';

/**
 * Calculate dashboard statistics from raw data
 */
export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	totalProducts: number;
	activeProducts: number;
	totalOrders: number;
	pendingOrders: number;
	totalRevenue: number;
	averageOrderValue: number;
	revenueGrowth: number;
}

export function calculateDashboardStats(
	users: User[],
	products: Product[],
	orders: Order[]
): DashboardStats {
	const totalUsers = users.length;
	const activeUsers = users.filter(u => u.status === 'active').length;
	const totalProducts = products.length;
	const activeProducts = products.filter(p => p.status === 'active').length;
	const totalOrders = orders.length;
	const pendingOrders = orders.filter(o => o.status === 'pending').length;
	
	const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
	const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
	const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
	
	// Calculate revenue growth (simplified - comparing first half vs second half)
	const midPoint = Math.floor(paidOrders.length / 2);
	const firstHalf = paidOrders.slice(0, midPoint);
	const secondHalf = paidOrders.slice(midPoint);
	const firstHalfRevenue = firstHalf.reduce((sum, o) => sum + o.totalAmount, 0);
	const secondHalfRevenue = secondHalf.reduce((sum, o) => sum + o.totalAmount, 0);
	const revenueGrowth = firstHalfRevenue > 0 
		? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 
		: 0;

	return {
		totalUsers,
		activeUsers,
		totalProducts,
		activeProducts,
		totalOrders,
		pendingOrders,
		totalRevenue,
		averageOrderValue,
		revenueGrowth
	};
}

/**
 * Get recent items sorted by creation date
 */
export function getRecentItems<T extends { createdAt: string }>(
	items: T[],
	limit: number = 5
): T[] {
	return [...items]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, limit);
}

/**
 * Generate order status distribution data
 */
export interface StatusData {
	status: string;
	count: number;
	percentage: number;
}

export function generateOrderStatusData(orders: Order[]): StatusData[] {
	const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
	const total = orders.length;
	
	return statuses.map(status => {
		const count = orders.filter(o => o.status === status).length;
		const percentage = total > 0 ? (count / total) * 100 : 0;
		
		return {
			status: status.charAt(0).toUpperCase() + status.slice(1),
			count,
			percentage
		};
	});
}

/**
 * Format growth percentage
 */
export function formatGrowth(value: number): string {
	const prefix = value >= 0 ? '+' : '';
	return `${prefix}${value.toFixed(1)}%`;
}

/**
 * Get trend direction
 */
export function getTrendDirection(value: number): 'up' | 'down' | 'neutral' {
	if (value > 0) return 'up';
	if (value < 0) return 'down';
	return 'neutral';
}

