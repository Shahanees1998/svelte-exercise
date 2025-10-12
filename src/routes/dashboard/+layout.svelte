<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	
	interface Props {
		children?: Snippet;
	}
	
	let { children }: Props = $props();
	
	let sidebarOpen = $state(false);
	
	const navItems = [
		{ label: 'Overview', path: '/dashboard/overview', icon: '📊' },
		{ label: 'Users', path: '/dashboard/users', icon: '👥' },
		{ label: 'Products', path: '/dashboard/products', icon: '📦' },
		{ label: 'Orders', path: '/dashboard/orders', icon: '🛒' }
	];
	
	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
		}
	});
	
	function handleLogout() {
		authStore.logout();
	}
	
	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="dashboard-layout">
	<!-- Sidebar -->
	<nav class="sidebar" class:open={sidebarOpen}>
		<div class="sidebar-header">
			<h2>Dashboard</h2>
		</div>
		
		<div class="sidebar-nav">
			{#each navItems as item}
				<a 
					href={item.path}
					class="nav-item"
					class:active={$page.url.pathname === item.path}
					onclick={closeSidebar}
				>
					<span class="nav-icon">{item.icon}</span>
					<span class="nav-label">{item.label}</span>
				</a>
			{/each}
		</div>
		
		<div class="sidebar-footer">
			<button class="nav-item" onclick={handleLogout}>
				<span class="nav-icon">🚪</span>
				<span class="nav-label">Logout</span>
			</button>
		</div>
	</nav>
	
	<!-- Main Content -->
	<div class="main-content">
		<header class="header">
			<button 
				class="mobile-menu-button" 
				onclick={() => sidebarOpen = !sidebarOpen}
				aria-label="Toggle menu"
			>
				☰
			</button>
			<div class="header-title">E-Commerce Dashboard</div>
			{#if authStore.user}
				<div class="user-profile">
					<div class="user-avatar">
						{authStore.user.name.charAt(0).toUpperCase()}
					</div>
					<span class="user-email">{authStore.user.email}</span>
				</div>
			{/if}
		</header>
		
		<main class="page-content">
			{@render children?.()}
		</main>
	</div>
	
	<!-- Mobile Overlay -->
	{#if sidebarOpen}
		<button 
			class="mobile-overlay" 
			onclick={closeSidebar}
			onkeydown={(e) => e.key === 'Escape' && closeSidebar()}
			aria-label="Close sidebar"
		></button>
	{/if}
</div>

<style>
	.mobile-menu-button {
		display: none;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: var(--space-sm);
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-base);
	}
	
	.mobile-menu-button:hover {
		background-color: var(--color-bg-secondary);
	}
	
	.header-title {
		flex: 1;
		font-size: var(--font-size-xl);
		font-weight: 600;
	}
	
	.user-profile {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}
	
	.user-avatar {
		width: 40px;
		height: 40px;
		background: var(--gradient-primary);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: var(--font-size-lg);
	}
	
	.user-email {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: 500;
	}
	
	.sidebar-footer {
		padding: var(--space-md) 0;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.mobile-overlay {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: calc(var(--z-fixed) - 1);
		border: none;
		padding: 0;
		cursor: pointer;
	}
	
	@media (max-width: 768px) {
		.mobile-menu-button {
			display: block;
		}
		
		.mobile-overlay {
			display: block;
		}
		
		.user-email {
			display: none;
		}
	}
</style>
