import { writable } from 'svelte/store';

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	createdAt: string;
}

interface AuthState {
	users: User[];
	currentUser: User | null;
	isAuthenticated: boolean;
}

// Initialize from localStorage if available
function getInitialState(): AuthState {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('authState');
		if (stored) {
			return JSON.parse(stored);
		}
	}
	return {
		users: [],
		currentUser: null,
		isAuthenticated: false
	};
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(getInitialState());

	// Persist to localStorage whenever state changes
	function persist(state: AuthState) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('authState', JSON.stringify(state));
		}
	}

	return {
		subscribe,
		
		// Register a new user
		register: (firstName: string, lastName: string, email: string, password: string) => {
			let success = false;
			let error = '';

			update(state => {
				// Validate email uniqueness
				if (state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
					error = 'Email already registered';
					return state;
				}

				const newUser: User = {
					id: state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1,
					firstName,
					lastName,
					email,
					password,
					createdAt: new Date().toISOString()
				};

				const newState = {
					...state,
					users: [...state.users, newUser]
				};
				
				persist(newState);
				success = true;
				return newState;
			});

			return { success, error };
		},

		// Login user
		login: (email: string, password: string) => {
			let success = false;
			let error = '';
			
			update(state => {
				const user = state.users.find(
					u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
				);

				if (!user) {
					error = 'Invalid email or password';
					return state;
				}

				const newState = {
					...state,
					currentUser: user,
					isAuthenticated: true
				};

				persist(newState);
				success = true;
				return newState;
			});

			return { success, error };
		},

		// Logout user
		logout: () => {
			update(state => {
				const newState = {
					...state,
					currentUser: null,
					isAuthenticated: false
				};
				persist(newState);
				return newState;
			});
		},

		// Check if email exists
		emailExists: (email: string): boolean => {
			let exists = false;
			update(state => {
				exists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
				return state;
			});
			return exists;
		},

		// Get current user
		getCurrentUser: (): User | null => {
			let user: User | null = null;
			update(state => {
				user = state.currentUser;
				return state;
			});
			return user;
		},

		// Reset all data (for testing)
		reset: () => {
			const newState: AuthState = {
				users: [],
				currentUser: null,
				isAuthenticated: false
			};
			set(newState);
			persist(newState);
		}
	};
}

export const authStore = createAuthStore();

