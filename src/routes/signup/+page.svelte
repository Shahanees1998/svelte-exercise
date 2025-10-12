<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { toast } from '$lib/stores/toast.svelte';
	
	let { form }: { form: ActionData } = $props();
	
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);
	
	// Show error toast when form submission fails
	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Sign Up - Dashboard</title>
</svelte:head>

<main class="auth-container">
	<article class="card" style="max-width: 500px; width: 100%;">
		<header class="auth-header">
			<h1>Create Account</h1>
			<p>Sign up to get started</p>
		</header>
		
		<form 
			class="auth-form" 
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<div class="form-group">
				<label for="name">Full Name</label>
				<input
					id="name"
					name="name"
					type="text"
					class="form-input"
					value={form?.name || ''}
					placeholder="John Doe"
					disabled={isSubmitting}
					required
					minlength="2"
				/>
			</div>
			
			<div class="form-group">
				<label for="email">Email Address</label>
				<input
					id="email"
					name="email"
					type="email"
					class="form-input"
					value={form?.email || ''}
					placeholder="you@example.com"
					disabled={isSubmitting}
					required
				/>
			</div>
			
			<div class="form-group">
				<label for="password">Password</label>
				<div class="password-input-container">
					<input
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						class="form-input"
						placeholder="At least 6 characters (1 letter & 1 number)"
						disabled={isSubmitting}
						required
						minlength="6"
					/>
					<button
						type="button"
						class="password-toggle"
						onclick={() => showPassword = !showPassword}
						disabled={isSubmitting}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
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
						name="confirmPassword"
						type={showConfirmPassword ? 'text' : 'password'}
						class="form-input"
						placeholder="Confirm your password"
						disabled={isSubmitting}
						required
						minlength="6"
					/>
					<button
						type="button"
						class="password-toggle"
						onclick={() => showConfirmPassword = !showConfirmPassword}
						disabled={isSubmitting}
						aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
					>
						{showConfirmPassword ? '👁️' : '👁️‍🗨️'}
					</button>
				</div>
			</div>
			
			<button 
				type="submit" 
				class="btn btn-primary" 
				style="width: 100%;"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Creating account...' : 'Create Account'}
			</button>
		</form>
		
		<footer class="auth-footer">
			<p>
				Already have an account? 
				<a href="/login">Sign in</a>
			</p>
		</footer>
	</article>
</main>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gradient-primary);
		padding: var(--space-xl);
	}
	
	.auth-header {
		text-align: center;
		margin-bottom: var(--space-xl);
	}
	
	.auth-header h1 {
		margin-bottom: var(--space-sm);
	}
	
	.auth-header p {
		color: var(--color-text-secondary);
		margin: 0;
	}
	
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	
	.auth-footer {
		text-align: center;
		margin-top: var(--space-lg);
		padding-top: var(--space-lg);
		border-top: 1px solid var(--color-border-light);
	}
	
	.auth-footer p {
		margin: 0;
		color: var(--color-text-secondary);
	}
	
	.password-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}
	
	.password-input-container input {
		padding-right: 45px;
	}
	
	.password-toggle {
		position: absolute;
		right: 12px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		font-size: 1.2rem;
		transition: all var(--transition-base);
		border-radius: var(--radius-sm);
	}
	
	.password-toggle:hover:not(:disabled) {
		background-color: var(--color-bg-tertiary);
	}
	
	.password-toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
