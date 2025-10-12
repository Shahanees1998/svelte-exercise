// Debounce utility function
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Search utility with debouncing
export function createSearchHandler(
	searchFn: () => void,
	delay: number = 300
) {
	return debounce(searchFn, delay);
}
