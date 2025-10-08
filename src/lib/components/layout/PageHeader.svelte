<script lang="ts">
	export let title = '';
	export let subtitle = '';
	export let buttonText = '';
	export let buttonIcon = '+';
	export let onButtonClick: () => void = () => {};
</script>

<div class="page-header">
	<div class="page-title">
		<h1>{title}</h1>
		{#if subtitle}
			<p>{subtitle}</p>
		{/if}
	</div>
	{#if buttonText}
		<button class="btn btn-primary" on:click={onButtonClick}>
			<span class="btn-icon">{buttonIcon}</span>
			{buttonText}
		</button>
	{/if}
</div>