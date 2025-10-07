import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

const toasts = writable<Toast[]>([]);

export const toast = {
	subscribe: toasts.subscribe,
	
	success: (message: string, duration = 3000) => {
		toast.add(message, 'success', duration);
	},
	
	error: (message: string, duration = 5000) => {
		toast.add(message, 'error', duration);
	},
	
	info: (message: string, duration = 3000) => {
		toast.add(message, 'info', duration);
	},
	
	warning: (message: string, duration = 4000) => {
		toast.add(message, 'warning', duration);
	},
	
	add: (message: string, type: Toast['type'], duration = 3000) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newToast: Toast = { id, message, type, duration };
		
		toasts.update(current => [...current, newToast]);
		
		if (duration > 0) {
			setTimeout(() => {
				toast.remove(id);
			}, duration);
		}
	},
	
	remove: (id: string) => {
		toasts.update(current => current.filter(toast => toast.id !== id));
	},
	
	clear: () => {
		toasts.set([]);
	}
};
