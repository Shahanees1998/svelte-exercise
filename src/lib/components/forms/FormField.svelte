<script lang="ts">
	export let label = '';
	export let type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' = 'text';
	export let value: any = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let options: Array<{value: string, label: string}> = [];
	export let rows = 3;
	export let showPasswordToggle = false;
	export let showPassword = false;
	
	let inputElement: HTMLInputElement;
	
	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="form-group">
	{#if label}
		<label for={label.toLowerCase().replace(/\s+/g, '-')}>{label}</label>
	{/if}
	
	{#if type === 'textarea'}
		<textarea
			id={label.toLowerCase().replace(/\s+/g, '-')}
			class="form-textarea"
			bind:value
			{placeholder}
			{required}
			{disabled}
			{rows}
		></textarea>
	{:else if type === 'select'}
		<select
			id={label.toLowerCase().replace(/\s+/g, '-')}
			class="form-select"
			bind:value
			{required}
			{disabled}
		>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{:else if type === 'password' && showPasswordToggle}
		<div class="password-input-container">
			<input
				bind:this={inputElement}
				id={label.toLowerCase().replace(/\s+/g, '-')}
				type="password"
				class="form-input"
				class:show-password={showPassword}
				bind:value
				{placeholder}
				{required}
				{disabled}
			/>
			<button
				type="button"
				class="password-toggle"
				on:click={togglePassword}
				{disabled}
			>
				{showPassword ? '□' : '□‍🗨️'}
			</button>
		</div>
	{:else if type === 'email'}
		<input
			id={label.toLowerCase().replace(/\s+/g, '-')}
			type="email"
			class="form-input"
			bind:value
			{placeholder}
			{required}
			{disabled}
		/>
	{:else if type === 'number'}
		<input
			id={label.toLowerCase().replace(/\s+/g, '-')}
			type="number"
			class="form-input"
			bind:value
			{placeholder}
			{required}
			{disabled}
		/>
	{:else if type === 'password'}
		<input
			id={label.toLowerCase().replace(/\s+/g, '-')}
			type="password"
			class="form-input"
			bind:value
			{placeholder}
			{required}
			{disabled}
		/>
	{:else}
		<input
			id={label.toLowerCase().replace(/\s+/g, '-')}
			type="text"
			class="form-input"
			bind:value
			{placeholder}
			{required}
			{disabled}
		/>
	{/if}
</div>
