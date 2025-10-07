<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';
	import { authStore } from '$lib/stores/auth';

	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let isLoading = false;
	let showPassword = false;
	let showConfirmPassword = false;

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validatePassword(password: string): boolean {
		return password.length >= 6;
	}

	function validateName(name: string): boolean {
		return name.trim().length >= 2;
	}

	async function handleSignup(event: Event) {
		event.preventDefault();
		
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			toast.error('Please fill in all fields');
			return;
		}

		if (!validateName(firstName)) {
			toast.error('First name must be at least 2 characters long');
			return;
		}

		if (!validateName(lastName)) {
			toast.error('Last name must be at least 2 characters long');
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

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		isLoading = true;

		// Simulate API call delay
		setTimeout(() => {
			const result = authStore.register(firstName, lastName, email, password);
			
			isLoading = false;
			
			if (result.success) {
				toast.success('Account created successfully! Please sign in.');
				goto('/login');
			} else {
				toast.error(result.error || 'Registration failed');
			}
		}, 1000);
	}
</script>

<svelte:head>
	<title>Sign Up - E-Commerce Dashboard</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<h1>Create Account</h1>
			<p>Join our e-commerce dashboard</p>
		</div>

		<form on:submit={handleSignup} class="auth-form">
			<div class="form-row">
				<div class="form-group">
					<label for="firstName">First Name</label>
					<input
						id="firstName"
						type="text"
						bind:value={firstName}
						placeholder="First name"
						required
						disabled={isLoading}
					/>
				</div>

				<div class="form-group">
					<label for="lastName">Last Name</label>
					<input
						id="lastName"
						type="text"
						bind:value={lastName}
						placeholder="Last name"
						required
						disabled={isLoading}
					/>
				</div>
			</div>

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
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Create a password"
						required
						disabled={isLoading}
						class:show-password={showPassword}
					/>
					<button
						type="button"
						class="password-toggle"
						on:click={() => showPassword = !showPassword}
						disabled={isLoading}
					>
						{showPassword ? '👁️' : '👁️‍🗨️'}
					</button>
				</div>
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<div class="password-input-container">
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						placeholder="Confirm your password"
						required
						disabled={isLoading}
						class:show-password={showConfirmPassword}
					/>
					<button
						type="button"
						class="password-toggle"
						on:click={() => showConfirmPassword = !showConfirmPassword}
						disabled={isLoading}
					>
						{showConfirmPassword ? '👁️' : '👁️‍🗨️'}
					</button>
				</div>
			</div>

			<button type="submit" class="auth-button" disabled={isLoading}>
				{isLoading ? 'Creating Account...' : 'Create Account'}
			</button>
		</form>

		<div class="auth-footer">
			<p>Already have an account? <a href="/login">Sign in here</a></p>
		</div>
	</div>
</div>

