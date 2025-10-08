<script lang="ts">
	import { getTrendDirection } from '$lib/utils/dataProcessing';

	export let icon: string;
	export let iconClass: string;
	export let value: string | number;
	export let label: string;
	export let trend: number | undefined = undefined;
	export let subtitle: string | undefined = undefined;

	$: trendDirection = trend !== undefined ? getTrendDirection(trend) : null;
</script>

<div class="stat-card enhanced">
	<div class="stat-icon {iconClass}">{icon}</div>
	<div class="stat-content">
		<p class="stat-value">{value}</p>
		<h3>{label}</h3>
	</div>
</div>


