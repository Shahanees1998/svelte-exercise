<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';
	import { authStore } from '$lib/stores/auth';

	let email = '';
	let password = '';
	let isLoading = false;
	let showPassword = false;

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validatePassword(password: string): boolean {
		return password.length >= 6;
	}

	async function handleLogin(event: Event) {
		event.preventDefault();
		
		if (!email || !password) {
			toast.error('Please fill in all fields');
			return;
		}

		if (!validateEmail(email)) {
			toast.error('Please enter a valid email address');
			return;
		}

		if (!validatePassword(password)) {
			toast.error('Password must be at least 6 characters long');
			return;
		}

		isLoading = true;

		// Simulate API call delay
		setTimeout(() => {
			const result = authStore.login(email, password);
			
			isLoading = false;
			
			if (result.success) {
				toast.success('Login successful!');
				goto('/dashboard');
			} else {
				toast.error(result.error || 'Invalid credentials');
			}
		}, 1000);
	}
</script>

<svelte:head>
	<title>Login - E-Commerce Dashboard</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<h1>Welcome Back</h1>
			<p>Sign in to your dashboard</p>
		</div>

		<form on:submit={handleLogin} class="auth-form">
			<div class="form-group">
				<label for="email">Email Address</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
					disabled={isLoading}
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<div class="password-input-container">
					{#if showPassword}
						<input
							id="password"
							type="text"
							bind:value={password}
							placeholder="Enter your password"
							required
							disabled={isLoading}
						/>
					{:else}
						<input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Enter your password"
							required
							disabled={isLoading}
						/>
					{/if}
					<button
						type="button"
						class="password-toggle"
						on:click={() => showPassword = !showPassword}
						disabled={isLoading}
						title={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? '🙈' : '👁️'}
					</button>
				</div>
			</div>

			<button type="submit" class="auth-button" disabled={isLoading}>
				{isLoading ? 'Signing In...' : 'Sign In'}
			</button>
		</form>

		<div class="auth-footer">
			<p>Don't have an account? <a href="/signup">Sign up here</a></p>
		</div>
	</div>
</div>


