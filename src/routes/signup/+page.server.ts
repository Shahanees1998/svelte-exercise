import { dataService, UserRole, UserStatus, type User } from '$lib/server/data';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is already logged in, redirect to dashboard
	// (You can implement this based on your auth logic)
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Validation: Check all fields are provided
		if (!name || !email || !password || !confirmPassword) {
			return fail(400, { 
				error: 'All fields are required',
				email,
				name
			});
		}

		// Validation: Check name length
		if (name.trim().length < 2) {
			return fail(400, { 
				error: 'Name must be at least 2 characters',
				email,
				name
			});
		}

		// Validation: Check email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { 
				error: 'Please enter a valid email address',
				email,
				name
			});
		}

		// Validation: Check if email already exists (UNIQUE EMAIL CHECK)
		const existingUser = dataService.getUsers().find(
			u => u.email.toLowerCase() === email.toLowerCase()
		);
		if (existingUser) {
			return fail(400, { 
				error: 'An account with this email already exists',
				email,
				name
			});
		}

		// Validation: Check password length
		if (password.length < 6) {
			return fail(400, { 
				error: 'Password must be at least 6 characters',
				email,
				name
			});
		}

		// Validation: Check passwords match
		if (password !== confirmPassword) {
			return fail(400, { 
				error: 'Passwords do not match',
				email,
				name
			});
		}

		// Validation: Check password strength (at least one number and one letter)
		const hasLetter = /[a-zA-Z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		if (!hasLetter || !hasNumber) {
			return fail(400, { 
				error: 'Password must contain at least one letter and one number',
				email,
				name
			});
		}

		// Create new user
		const newUser: Omit<User, 'id'> = {
			name: name.trim(),
			email: email.toLowerCase().trim(),
			role: UserRole.USER, // Default role for new signups
			status: UserStatus.ACTIVE,
			createdAt: new Date().toISOString().split('T')[0]
		};

		// Add user to database
		try {
			const user = dataService.addUser(newUser);
			
			// In a real app, you would:
			// 1. Hash the password and store it
			// 2. Create a session/JWT token
			// 3. Set authentication cookies
			
			// For now, redirect to login with success message
			throw redirect(303, '/login?signup=success');
		} catch (error) {
			if (error instanceof Response) {
				throw error; // Re-throw redirect
			}
			return fail(500, { 
				error: 'Failed to create account. Please try again.',
				email,
				name
			});
		}
	}
};

