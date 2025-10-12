import { dataService } from '$lib/server/data';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 10;
	
	const result = dataService.getOrdersPaginated({ page, limit, search });

	return {
		orders: result.data,
		search,
		pagination: result.pagination
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Order ID is required' });
		}

		const deleted = dataService.deleteOrder(id);

		if (!deleted) {
			return fail(404, { error: 'Order not found' });
		}

		return { success: true, message: 'Order deleted successfully' };
	}
};


