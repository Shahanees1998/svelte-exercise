<script lang="ts">
	export let icon: string;
	export let iconClass: string;
	export let value: string | number;
	export let label: string;
</script>

<div class="stat-card">
	<div class="stat-icon {iconClass}">{icon}</div>
	<div class="stat-content">
		<p class="stat-value">{value}</p>
		<h3>{label}</h3>
	</div>
</div>

