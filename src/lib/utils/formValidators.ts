/**
 * Form Validation Helpers
 * Composite validation functions for complex forms
 */

import { validateRequired, validateEmail, validatePositiveNumber } from './validation';
import { validateOrderItems } from './orderHelpers';
import type { OrderItem } from '$lib/stores/data';

/**
 * Validate order form data
 */
export function validateOrderForm(data: {
	customerName: string;
	customerEmail: string;
	items: OrderItem[];
	shippingAddress: string;
}): { valid: boolean; error: string } {
	// Validate customer name
	const nameValidation = validateRequired(data.customerName, 'Customer name');
	if (!nameValidation.valid) {
		return nameValidation;
	}

	// Validate customer email
	const emailValidation = validateRequired(data.customerEmail, 'Customer email');
	if (!emailValidation.valid) {
		return emailValidation;
	}

	if (!validateEmail(data.customerEmail)) {
		return { valid: false, error: 'Please enter a valid email address' };
	}

	// Validate items
	const itemsValidation = validateOrderItems(data.items);
	if (!itemsValidation.valid) {
		return itemsValidation;
	}

	// Validate shipping address
	const addressValidation = validateRequired(data.shippingAddress, 'Shipping address');
	if (!addressValidation.valid) {
		return addressValidation;
	}

	return { valid: true, error: '' };
}

/**
 * Validate product form data
 */
export function validateProductForm(data: {
	name: string;
	description: string;
	price: number;
	stock: number;
	category: string;
}): { valid: boolean; error: string } {
	// Validate product name
	const nameValidation = validateRequired(data.name, 'Product name');
	if (!nameValidation.valid) {
		return nameValidation;
	}

	// Validate description
	const descValidation = validateRequired(data.description, 'Product description');
	if (!descValidation.valid) {
		return descValidation;
	}

	// Validate price
	const priceValidation = validatePositiveNumber(data.price, 'Price');
	if (!priceValidation.valid) {
		return priceValidation;
	}

	// Validate stock
	const stockValidation = validatePositiveNumber(data.stock, 'Stock');
	if (!stockValidation.valid) {
		return stockValidation;
	}

	// Validate category
	const categoryValidation = validateRequired(data.category, 'Category');
	if (!categoryValidation.valid) {
		return categoryValidation;
	}

	return { valid: true, error: '' };
}

/**
 * Validate user form data
 */
export function validateUserForm(data: {
	name: string;
	email: string;
	role: string;
}): { valid: boolean; error: string } {
	// Validate name
	const nameValidation = validateRequired(data.name, 'Name');
	if (!nameValidation.valid) {
		return nameValidation;
	}

	// Validate email
	const emailValidation = validateRequired(data.email, 'Email');
	if (!emailValidation.valid) {
		return emailValidation;
	}

	if (!validateEmail(data.email)) {
		return { valid: false, error: 'Please enter a valid email address' };
	}

	// Validate role
	const roleValidation = validateRequired(data.role, 'Role');
	if (!roleValidation.valid) {
		return roleValidation;
	}

	const validRoles = ['user', 'manager', 'admin'];
	if (!validRoles.includes(data.role.toLowerCase())) {
		return { valid: false, error: 'Please select a valid role' };
	}

	return { valid: true, error: '' };
}

