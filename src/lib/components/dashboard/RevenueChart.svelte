<script lang="ts">
	import { formatPrice } from '$lib/utils/validation';
	import { getBarHeightClass } from '$lib/utils/chartHelpers';

	export let revenueData: { month: string; revenue: number }[];

	$: maxRevenue = Math.max(...revenueData.map(d => d.revenue));
</script>

<div class="chart-card">
	<div class="chart-header">
		<h3>Monthly Revenue</h3>
		<span class="chart-badge">Last 6 months</span>
	</div>
	<div class="chart-container">
		<div class="chart-bars">
			{#each revenueData as data, i}
				<div class="chart-bar" style="animation-delay: {i * 50}ms">
					<div 
						class="bar {getBarHeightClass(data.revenue, maxRevenue)}"
						role="img"
						aria-label="{data.month}: {formatPrice(data.revenue)}"
						title="{data.month}: {formatPrice(data.revenue)}"
					></div>
					<span class="bar-label">{data.month}</span>
					<span class="bar-value">{formatPrice(data.revenue)}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Custom overrides for better chart appearance */
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.chart-badge {
		background: #e5e7eb;
		color: #6b7280;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
	}

	.chart-container {
		height: 300px;
		align-items: flex-end;
	}

	.chart-bars {
		gap: 24px;
		padding-bottom: 40px;
	}

	.chart-bar {
		gap: 8px;
		position: relative;
		animation: slideUp 0.6s ease-out forwards;
		opacity: 0;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.bar {
		background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
		border-radius: 8px 8px 0 0;
		transition: all 0.3s ease;
		cursor: pointer;
		animation: barGrow 0.8s ease-out forwards;
		transform-origin: bottom;
	}

	@keyframes barGrow {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	.bar:hover {
		transform: scaleY(1.05);
		filter: brightness(1.1);
		box-shadow: 0 -4px 12px rgba(102, 126, 234, 0.3);
	}

	.bar-label {
		font-size: 12px;
		font-weight: 600;
		color: #4a5568;
	}

	.bar-value {
		font-size: 11px;
		color: #718096;
		position: absolute;
		bottom: -30px;
	}
</style>

