// Reusable validation functions

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validateRequired(value: string, fieldName: string): { valid: boolean; error: string } {
	if (!value.trim()) {
		return { valid: false, error: `${fieldName} is required` };
	}
	return { valid: true, error: '' };
}

export function validateMinLength(value: string, minLength: number, fieldName: string): { valid: boolean; error: string } {
	if (value.trim().length < minLength) {
		return { valid: false, error: `${fieldName} must be at least ${minLength} characters long` };
	}
	return { valid: true, error: '' };
}

export function validateNumber(value: number, min: number, fieldName: string): { valid: boolean; error: string } {
	if (value < min) {
		return { valid: false, error: `${fieldName} must be at least ${min}` };
	}
	return { valid: true, error: '' };
}

export function validatePositiveNumber(value: number, fieldName: string): { valid: boolean; error: string } {
	if (value <= 0) {
		return { valid: false, error: `${fieldName} must be greater than 0` };
	}
	return { valid: true, error: '' };
}

export function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

