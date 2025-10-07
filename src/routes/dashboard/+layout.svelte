<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';

	let isMobileMenuOpen = false;
	let userEmail = '';

	onMount(() => {
		// Check authentication from store
		const unsubscribe = authStore.subscribe(state => {
			if (!state.isAuthenticated) {
				goto('/login');
				return;
			}
			
			userEmail = state.currentUser?.email || '';
		});

		return unsubscribe;
	});

	function handleLogout() {
		authStore.logout();
		goto('/login');
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function navigateTo(path: string) {
		goto(path);
		isMobileMenuOpen = false;
	}

	const navItems = [
		{ path: '/dashboard/overview', label: 'Overview', icon: '📊' },
		{ path: '/dashboard/users', label: 'Users', icon: '👥' },
		{ path: '/dashboard/products', label: 'Products', icon: '📦' },
		{ path: '/dashboard/orders', label: 'Orders', icon: '📋' }
	];
</script>

<svelte:head>
	<title>Dashboard - E-Commerce Dashboard</title>
</svelte:head>

<div class="dashboard-container">
	<!-- Sidebar -->
	<aside class="sidebar" class:sidebar-open={isMobileMenuOpen}>
		<div class="sidebar-header">
			<h2>Dashboard</h2>
		</div>
		
		<nav class="sidebar-nav">
			{#each navItems as item}
				<button
					class="nav-item"
					class:active={$page.url.pathname === item.path}
					on:click={() => navigateTo(item.path)}
				>
					<span class="nav-icon">{item.icon}</span>
					<span class="nav-label">{item.label}</span>
				</button>
			{/each}
		</nav>
		
		<div class="sidebar-footer">
			<button class="logout-button" on:click={handleLogout}>
				<span class="nav-icon">🚪</span>
				<span class="nav-label">Logout</span>
			</button>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="main-content">
		<!-- Header -->
		<header class="header">
			<button class="mobile-menu-button" on:click={toggleMobileMenu}>
				☰
			</button>
			<div class="header-title">
				{#if $page.url.pathname === '/dashboard/overview'}
					Dashboard Overview
				{:else if $page.url.pathname === '/dashboard/users'}
					Users
				{:else if $page.url.pathname === '/dashboard/products'}
					Products
				{:else if $page.url.pathname === '/dashboard/orders'}
					Orders
				{:else}
					Dashboard
				{/if}
			</div>
			<div class="header-user">
				<div class="user-profile">
					<div class="user-avatar">
						{userEmail.charAt(0).toUpperCase()}
					</div>
					<span class="user-email">{userEmail}</span>
				</div>
			</div>
		</header>

		<!-- Page Content -->
		<div class="page-content">
			<slot />
		</div>
	</main>

	<!-- Mobile Overlay -->
	{#if isMobileMenuOpen}
		<div class="mobile-overlay" on:click={toggleMobileMenu}></div>
	{/if}
</div>

