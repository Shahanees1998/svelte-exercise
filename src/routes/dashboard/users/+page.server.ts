import { dataService } from '$lib/server/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const users = dataService.getUsers();
	
	// Filter users based on search
	const filteredUsers = search
		? users.filter(u => 
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()) ||
			u.role.toLowerCase().includes(search.toLowerCase())
		)
		: users;

	return {
		users: filteredUsers,
		search
	};
};


