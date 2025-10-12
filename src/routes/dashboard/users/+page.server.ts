import { dataService, UserRole, UserStatus, type User } from '$lib/server/data';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 10;
	
	const result = dataService.getUsersPaginated({ page, limit, search });

	return {
		users: result.data,
		search,
		pagination: result.pagination
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;
		const status = formData.get('status') as string;

		if (!name || !email || !role || !status) {
			return fail(400, { error: 'All fields are required' });
		}

		const existingUser = dataService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
		if (existingUser) {
			return fail(400, { error: 'A user with this email already exists' });
		}

		const newUser: Omit<User, 'id'> = {
			name,
			email,
			role: role as UserRole,
			status: status as UserStatus,
			createdAt: new Date().toISOString().split('T')[0]
		};

		dataService.addUser(newUser);
		return { success: true, message: 'User created successfully' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;
		const status = formData.get('status') as string;

		if (!id || !name || !email || !role || !status) {
			return fail(400, { error: 'All fields are required' });
		}

		const currentUser = dataService.getUserById(id);
		if (!currentUser) {
			return fail(404, { error: 'User not found' });
		}

		if (currentUser.email.toLowerCase() !== email.toLowerCase()) {
			const existingUser = dataService.getUsers().find(u => 
				u.email.toLowerCase() === email.toLowerCase() && u.id !== id
			);
			if (existingUser) {
				return fail(400, { error: 'A user with this email already exists' });
			}
		}

		const updated = dataService.updateUser(id, {
			name,
			email,
			role: role as UserRole,
			status: status as UserStatus
		});

		if (!updated) {
			return fail(404, { error: 'User not found' });
		}

		return { success: true, message: 'User updated successfully' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		if (!id) {
			return fail(400, { error: 'User ID is required' });
		}

		const deleted = dataService.deleteUser(id);

		if (!deleted) {
			return fail(404, { error: 'User not found' });
		}

		return { success: true, message: 'User deleted successfully' };
	}
};


