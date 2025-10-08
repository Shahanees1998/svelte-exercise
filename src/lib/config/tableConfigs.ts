/**
 * Table Configuration Constants
 * Centralized column definitions and table settings for all data tables
 */

/**
 * Orders Table Configuration
 */
export const ORDER_COLUMNS = [
	{ key: 'orderNumber', label: 'Order #' },
	{ key: 'customerName', label: 'Customer' },
	{ key: 'customerEmail', label: 'Email' },
	{ key: 'totalAmount', label: 'Total' },
	{ key: 'status', label: 'Status' },
	{ key: 'paymentStatus', label: 'Payment' },
	{ key: 'createdAt', label: 'Date' }
] as const;

/**
 * Users Table Configuration
 */
export const USER_COLUMNS = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Name' },
	{ key: 'email', label: 'Email' },
	{ key: 'role', label: 'Role' },
	{ key: 'status', label: 'Status' },
	{ key: 'createdAt', label: 'Joined' }
] as const;

/**
 * Products Table Configuration
 */
export const PRODUCT_COLUMNS = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Product Name' },
	{ key: 'description', label: 'Description' },
	{ key: 'category', label: 'Category' },
	{ key: 'price', label: 'Price' },
	{ key: 'stock', label: 'Stock' },
	{ key: 'status', label: 'Status' }
] as const;

/**
 * Order Items Table Configuration (for order details)
 */
export const ORDER_ITEMS_COLUMNS = [
	{ key: 'productName', label: 'Product' },
	{ key: 'quantity', label: 'Quantity' },
	{ key: 'price', label: 'Price' },
	{ key: 'subtotal', label: 'Subtotal' }
] as const;

/**
 * Table Action Button Configurations
 */
export const TABLE_ACTIONS = {
	view: { label: 'View', class: 'btn-info' },
	edit: { label: 'Edit', class: 'btn-secondary' },
	delete: { label: 'Delete', class: 'btn-danger' },
	details: { label: 'Details', class: 'btn-info' }
} as const;

/**
 * Empty State Messages
 */
export const EMPTY_MESSAGES = {
	orders: {
		noData: 'Get started by creating your first order',
		noResults: 'Try adjusting your search criteria',
		loading: 'Loading orders...',
		icon: '📋'
	},
	users: {
		noData: 'Get started by adding your first user',
		noResults: 'Try adjusting your search criteria',
		loading: 'Loading users...',
		icon: '👥'
	},
	products: {
		noData: 'Get started by adding your first product',
		noResults: 'Try adjusting your search criteria',
		loading: 'Loading products...',
		icon: '📦'
	}
} as const;

/**
 * Search Placeholder Text
 */
export const SEARCH_PLACEHOLDERS = {
	orders: 'Search orders by number, customer name or email...',
	users: 'Search users by name, email or role...',
	products: 'Search products by name, description or category...'
} as const;

/**
 * Page Headers Configuration
 */
export const PAGE_HEADERS = {
	orders: {
		title: 'Orders',
		subtitle: 'Manage customer orders and track deliveries',
		buttonText: 'Add Order',
		buttonIcon: '+'
	},
	users: {
		title: 'Users',
		subtitle: 'Manage user accounts and permissions',
		buttonText: 'Add User',
		buttonIcon: '+'
	},
	products: {
		title: 'Products',
		subtitle: 'Manage your product catalog and inventory',
		buttonText: 'Add Product',
		buttonIcon: '+'
	},
	overview: {
		title: 'Dashboard Overview',
		subtitle: 'Monitor your business performance and key metrics'
	}
} as const;

/**
 * Form Field Configurations
 */
export const FORM_FIELDS = {
	order: {
		customerName: { label: 'Customer Name', type: 'text', required: true },
		customerEmail: { label: 'Customer Email', type: 'email', required: true },
		shippingAddress: { label: 'Shipping Address', type: 'textarea', required: true },
		status: { label: 'Order Status', type: 'select', required: true },
		paymentStatus: { label: 'Payment Status', type: 'select', required: true }
	},
	user: {
		name: { label: 'Full Name', type: 'text', required: true },
		email: { label: 'Email Address', type: 'email', required: true },
		role: { label: 'User Role', type: 'select', required: true },
		status: { label: 'Status', type: 'select', required: true }
	},
	product: {
		name: { label: 'Product Name', type: 'text', required: true },
		description: { label: 'Description', type: 'textarea', required: true },
		category: { label: 'Category', type: 'select', required: true },
		price: { label: 'Price', type: 'number', required: true },
		stock: { label: 'Stock Quantity', type: 'number', required: true },
		status: { label: 'Status', type: 'select', required: true }
	}
} as const;

/**
 * Dropdown Options
 */
export const DROPDOWN_OPTIONS = {
	orderStatus: [
		{ value: 'pending', label: 'Pending' },
		{ value: 'processing', label: 'Processing' },
		{ value: 'shipped', label: 'Shipped' },
		{ value: 'delivered', label: 'Delivered' },
		{ value: 'cancelled', label: 'Cancelled' }
	],
	paymentStatus: [
		{ value: 'unpaid', label: 'Unpaid' },
		{ value: 'paid', label: 'Paid' },
		{ value: 'refunded', label: 'Refunded' }
	],
	userRole: [
		{ value: 'user', label: 'User' },
		{ value: 'manager', label: 'Manager' },
		{ value: 'admin', label: 'Admin' }
	],
	userStatus: [
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' }
	],
	productCategory: [
		{ value: 'electronics', label: 'Electronics' },
		{ value: 'clothing', label: 'Clothing' },
		{ value: 'home', label: 'Home & Garden' },
		{ value: 'books', label: 'Books' },
		{ value: 'sports', label: 'Sports' },
		{ value: 'other', label: 'Other' }
	],
	productStatus: [
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' }
	]
} as const;

/**
 * Modal Titles
 */
export const MODAL_TITLES = {
	order: {
		add: 'Create New Order',
		edit: 'Edit Order',
		delete: 'Delete Order',
		view: 'Order Details'
	},
	user: {
		add: 'Add New User',
		edit: 'Edit User',
		delete: 'Delete User'
	},
	product: {
		add: 'Add New Product',
		edit: 'Edit Product',
		delete: 'Delete Product'
	}
} as const;

/**
 * Button Labels
 */
export const BUTTON_LABELS = {
	submit: {
		create: 'Create',
		update: 'Update',
		delete: 'Delete',
		cancel: 'Cancel',
		save: 'Save Changes',
		close: 'Close'
	},
	order: {
		create: 'Create Order',
		update: 'Update Order'
	},
	user: {
		create: 'Add User',
		update: 'Update User'
	},
	product: {
		create: 'Add Product',
		update: 'Update Product'
	}
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
	order: {
		created: 'Order created successfully!',
		updated: 'Order updated successfully!',
		deleted: 'Order deleted successfully!'
	},
	user: {
		created: 'User added successfully!',
		updated: 'User updated successfully!',
		deleted: 'User deleted successfully!'
	},
	product: {
		created: 'Product added successfully!',
		updated: 'Product updated successfully!',
		deleted: 'Product deleted successfully!'
	}
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
	generic: 'An error occurred. Please try again.',
	network: 'Network error. Please check your connection.',
	validation: 'Please check your input and try again.',
	notFound: 'Item not found.',
	unauthorized: 'You are not authorized to perform this action.'
} as const;

