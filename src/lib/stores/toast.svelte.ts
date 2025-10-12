// Modern Svelte 5 toast store using runes

export interface Toast {
	id: number;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
}

function createToastStore() {
	let toasts = $state<Toast[]>([]);
	let nextId = 0;

	function addToast(type: Toast['type'], message: string) {
		const id = nextId++;
		const toast: Toast = { id, type, message };
		toasts = [...toasts, toast];

		// Auto-remove after 5 seconds
		setTimeout(() => {
			removeToast(id);
		}, 5000);
	}

	function removeToast(id: number) {
		toasts = toasts.filter(t => t.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		success(message: string) {
			addToast('success', message);
		},
		error(message: string) {
			addToast('error', message);
		},
		warning(message: string) {
			addToast('warning', message);
		},
		info(message: string) {
			addToast('info', message);
		},
		remove(id: number) {
			removeToast(id);
		}
	};
}

export const toast = createToastStore();


