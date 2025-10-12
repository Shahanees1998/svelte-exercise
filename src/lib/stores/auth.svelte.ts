// Modern Svelte 5 auth store using runes
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

interface AuthState {
	isAuthenticated: boolean;
	user: {
		email: string;
		name: string;
	} | null;
}

// Load initial state from localStorage
function loadInitialState(): AuthState {
	if (browser) {
		const stored = localStorage.getItem('auth_state');
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch (e) {
				console.error('Failed to parse auth state:', e);
			}
		}
	}
	return {
		isAuthenticated: false,
		user: null
	};
}

// Save state to localStorage
function saveToStorage(state: AuthState) {
	if (browser) {
		localStorage.setItem('auth_state', JSON.stringify(state));
	}
}

function createAuthStore() {
	let state = $state<AuthState>(loadInitialState());

	return {
		get isAuthenticated() {
			return state.isAuthenticated;
		},
		get user() {
			return state.user;
		},
		login(email: string, name: string) {
			state.isAuthenticated = true;
			state.user = { email, name };
			saveToStorage(state);
		},
		logout() {
			state.isAuthenticated = false;
			state.user = null;
			if (browser) {
				localStorage.removeItem('auth_state');
			}
			goto('/login');
		}
	};
}

export const authStore = createAuthStore();

