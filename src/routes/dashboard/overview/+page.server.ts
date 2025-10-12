import { dataService } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const users = dataService.getUsers();
	const products = dataService.getProducts();
	const orders = dataService.getOrders();

	const stats = {
		totalUsers: users.length,
		activeUsers: users.filter(u => u.status === 'active').length,
		totalProducts: products.length,
		activeProducts: products.filter(p => p.status === 'active').length,
		totalOrders: orders.length,
		totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
		pendingOrders: orders.filter(o => o.status === 'pending').length,
		processingOrders: orders.filter(o => o.status === 'processing').length,
		shippedOrders: orders.filter(o => o.status === 'shipped').length,
		deliveredOrders: orders.filter(o => o.status === 'delivered').length,
		cancelledOrders: orders.filter(o => o.status === 'cancelled').length
	};

	const recentOrders = [...orders]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 5);

	const recentUsers = [...users]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 5);

	return {
		stats,
		recentOrders,
		recentUsers,
		orders,
		users,
		products
	};
};


