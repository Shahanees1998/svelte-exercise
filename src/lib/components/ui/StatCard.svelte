<script lang="ts">
	interface Props {
		icon: string;
		title: string;
		value: string | number;
		subtitle?: string;
		color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
		trend?: {
			value: number;
			label: string;
			positive: boolean;
		};
	}

	let { icon, title, value, subtitle, color = 'primary', trend }: Props = $props();

	function getColorClass(color: string): string {
		const colorMap: Record<string, string> = {
			primary: 'stat-primary',
			secondary: 'stat-secondary',
			success: 'stat-success',
			danger: 'stat-danger',
			warning: 'stat-warning',
			info: 'stat-info'
		};
		return colorMap[color] || 'stat-primary';
	}
</script>

<article class="stat-card" aria-labelledby="stat-title">
	<div class="stat-icon {getColorClass(color)}" aria-hidden="true">
		{icon}
	</div>
	<div class="stat-content">
		<h3 id="stat-title" class="stat-title">{title}</h3>
		<div class="stat-value">{value}</div>
		{#if subtitle}
			<p class="stat-subtitle">{subtitle}</p>
		{/if}
		{#if trend}
			<div class="stat-trend {trend.positive ? 'trend-positive' : 'trend-negative'}">
				<span class="trend-icon" aria-hidden="true">
					{trend.positive ? '↗️' : '↘️'}
				</span>
				{trend.value}% {trend.label}
			</div>
		{/if}
	</div>
</article>

<!-- All styles moved to app.css -->
