/**
 * Status Helper Functions
 * Reusable utilities for status classes and formatting
 */

/**
 * Get CSS class for order status
 */
export function getOrderStatusClass(status: string): string {
	switch (status.toLowerCase()) {
		case 'pending': return 'status-pending';
		case 'processing': return 'status-processing';
		case 'shipped': return 'status-shipped';
		case 'delivered': return 'status-delivered';
		case 'cancelled': return 'status-cancelled';
		default: return '';
	}
}

/**
 * Get CSS class for payment status
 */
export function getPaymentStatusClass(status: string): string {
	switch (status.toLowerCase()) {
		case 'unpaid': return 'payment-unpaid';
		case 'paid': return 'payment-paid';
		case 'refunded': return 'payment-refunded';
		default: return '';
	}
}

/**
 * Get CSS class for user role
 */
export function getRoleClass(role: string): string {
	switch (role.toLowerCase()) {
		case 'admin': return 'role-admin';
		case 'manager': return 'role-manager';
		case 'user': return 'role-user';
		default: return 'role-user';
	}
}

/**
 * Get CSS class for user/product status (active/inactive)
 */
export function getActiveStatusClass(status: string): string {
	switch (status.toLowerCase()) {
		case 'active': return 'status-active';
		case 'inactive': return 'status-inactive';
		default: return '';
	}
}

/**
 * Get CSS class for product category
 */
export function getCategoryClass(category: string): string {
	switch (category.toLowerCase()) {
		case 'electronics': return 'category-electronics';
		case 'clothing': return 'category-clothing';
		case 'home': return 'category-home';
		case 'books': return 'category-books';
		case 'sports': return 'category-sports';
		default: return 'category-other';
	}
}

/**
 * Format status for display (capitalize first letter)
 */
export function formatStatus(status: string): string {
	return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

/**
 * Get display-friendly label for status with icon
 */
export function getStatusLabel(status: string, type: 'order' | 'payment' | 'user'): { icon: string; label: string; class: string } {
	const formatted = formatStatus(status);
	
	switch (type) {
		case 'order':
			return {
				icon: getOrderStatusIcon(status),
				label: formatted,
				class: getOrderStatusClass(status)
			};
		case 'payment':
			return {
				icon: getPaymentStatusIcon(status),
				label: formatted,
				class: getPaymentStatusClass(status)
			};
		case 'user':
			return {
				icon: status.toLowerCase() === 'active' ? '✅' : '❌',
				label: formatted,
				class: getActiveStatusClass(status)
			};
		default:
			return { icon: '', label: formatted, class: '' };
	}
}

/**
 * Get icon for order status
 */
function getOrderStatusIcon(status: string): string {
	switch (status.toLowerCase()) {
		case 'pending': return '⏳';
		case 'processing': return '⚙️';
		case 'shipped': return '🚚';
		case 'delivered': return '✅';
		case 'cancelled': return '❌';
		default: return '📦';
	}
}

/**
 * Get icon for payment status
 */
function getPaymentStatusIcon(status: string): string {
	switch (status.toLowerCase()) {
		case 'unpaid': return '💳';
		case 'paid': return '✅';
		case 'refunded': return '↩️';
		default: return '💰';
	}
}

