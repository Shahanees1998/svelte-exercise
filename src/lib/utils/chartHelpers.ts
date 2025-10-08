/**
 * Chart and Status Helper Functions
 * Centralized utilities for chart data processing and status styling
 */

/**
 * Get color for order status
 */
export function getStatusColor(status: string): string {
	switch (status.toLowerCase()) {
		case 'pending': return '#f59e0b';
		case 'processing': return '#3b82f6';
		case 'shipped': return '#8b5cf6';
		case 'delivered': return '#10b981';
		case 'cancelled': return '#ef4444';
		default: return '#6b7280';
	}
}

/**
 * Get icon for order status
 */
export function getStatusIcon(status: string): string {
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
 * Calculate bar height class based on value ratio
 */
export function getBarHeightClass(value: number, maxValue: number): string {
	const ratio = value / maxValue;
	if (ratio === 1) return 'bar-height-100';
	if (ratio >= 0.8) return 'bar-height-80';
	if (ratio >= 0.6) return 'bar-height-60';
	if (ratio >= 0.4) return 'bar-height-40';
	return 'bar-height-20';
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
	return total > 0 ? (value / total) * 100 : 0;
}

/**
 * Generate sample revenue data for chart
 */
export function generateRevenueData(): { month: string; revenue: number }[] {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
	return months.map(month => ({
		month,
		revenue: Math.floor(Math.random() * 50000) + 10000
	}));
}

