import { dataService } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const products = dataService.getProducts();
	
	// Filter products based on search
	const filteredProducts = search
		? products.filter(p => 
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.description.toLowerCase().includes(search.toLowerCase()) ||
			p.category.toLowerCase().includes(search.toLowerCase())
		)
		: products;

	return {
		products: filteredProducts,
		search
	};
};


