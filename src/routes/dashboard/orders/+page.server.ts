import { dataService } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const statusFilter = url.searchParams.get('status') || '';
	
	let orders = dataService.getOrders();
	
	// Filter by search term
	if (search) {
		orders = orders.filter(o => 
			o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
			o.customerName.toLowerCase().includes(search.toLowerCase()) ||
			o.customerEmail.toLowerCase().includes(search.toLowerCase())
		);
	}
	
	// Filter by status
	if (statusFilter) {
		orders = orders.filter(o => o.status === statusFilter);
	}

	return {
		orders,
		search,
		statusFilter
	};
};


