import { dataService, ProductCategory, ProductStatus, type Product } from '$lib/server/data';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 10;
	
	const result = dataService.getProductsPaginated({ page, limit, search });

	return {
		products: result.data,
		search,
		pagination: result.pagination
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const price = parseFloat(formData.get('price') as string);
		const category = formData.get('category') as string;
		const stock = parseInt(formData.get('stock') as string);
		const status = formData.get('status') as string;

		if (!name || !description || !price || !category || stock === undefined || !status) {
			return fail(400, { error: 'All fields are required' });
		}

		const newProduct: Omit<Product, 'id'> = {
			name,
			description,
			price,
			category: category as ProductCategory,
			stock,
			status: status as ProductStatus,
			createdAt: new Date().toISOString().split('T')[0]
		};

		dataService.addProduct(newProduct);
		return { success: true, message: 'Product created successfully' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const price = parseFloat(formData.get('price') as string);
		const category = formData.get('category') as string;
		const stock = parseInt(formData.get('stock') as string);
		const status = formData.get('status') as string;

		if (!id || !name || !description || !price || !category || stock === undefined || !status) {
			return fail(400, { error: 'All fields are required' });
		}

		const updated = dataService.updateProduct(id, {
			name,
			description,
			price,
			category: category as ProductCategory,
			stock,
			status: status as ProductStatus
		});

		if (!updated) {
			return fail(404, { error: 'Product not found' });
		}

		return { success: true, message: 'Product updated successfully' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Product ID is required' });
		}

		const deleted = dataService.deleteProduct(id);

		if (!deleted) {
			return fail(404, { error: 'Product not found' });
		}

		return { success: true, message: 'Product deleted successfully' };
	}
};


