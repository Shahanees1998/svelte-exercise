<script lang="ts">
	import { getStatusColor, getStatusIcon } from '$lib/utils/chartHelpers';

	export let orderStatusData: { status: string; count: number; percentage?: number }[];

	$: totalOrdersCount = orderStatusData.reduce((sum, data) => sum + data.count, 0);
</script>

<div class="chart-card order-status-card">
	<div class="chart-header">
		<h3>Order Status Distribution</h3>
		<span class="chart-badge">Total: {totalOrdersCount}</span>
	</div>
	<div class="order-status-container">
		<div class="order-status-legend">
			{#each orderStatusData as data, i}
				{@const percentage = data.percentage || 0}
				<div class="legend-item" style="animation-delay: {i * 80}ms">
					<div class="legend-header">
						<div class="legend-color-indicator">
							<span class="legend-icon">{getStatusIcon(data.status)}</span>
							<div 
								class="legend-color" 
								style="background: linear-gradient(135deg, {getStatusColor(data.status)}, {getStatusColor(data.status)}99)"
							></div>
						</div>
						<span class="legend-status">{data.status}</span>
					</div>
					<div class="legend-stats">
						<span class="legend-count">{data.count}</span>
						<span class="legend-percentage">{percentage.toFixed(1)}%</span>
					</div>
					<div class="legend-bar">
						<div 
							class="legend-bar-fill" 
							style="width: {percentage}%; background: {getStatusColor(data.status)}"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.chart-header h3 {
		font-size: 20px;
		font-weight: 600;
		color: #1a202c;
		margin: 0;
	}

	.chart-badge {
		background: #e5e7eb;
		color: #6b7280;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
	}

	.order-status-container {
		display: flex;
		gap: 32px;
		align-items: center;
	}

	.order-status-legend {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.legend-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
		animation: slideIn 0.5s ease-out forwards;
		opacity: 0;
		transition: transform 0.2s ease;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.legend-item:hover {
		transform: translateX(4px);
	}

	.legend-header {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.legend-color-indicator {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.legend-icon {
		font-size: 20px;
	}

	.legend-color {
		width: 16px;
		height: 16px;
		border-radius: 4px;
	}

	.legend-status {
		font-size: 14px;
		font-weight: 500;
		color: #2d3748;
		flex: 1;
	}

	.legend-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 44px;
	}

	.legend-count {
		font-size: 16px;
		font-weight: 600;
		color: #1a202c;
	}

	.legend-percentage {
		font-size: 14px;
		color: #718096;
		font-weight: 500;
	}

	.legend-bar {
		width: 100%;
		height: 8px;
		background: #e2e8f0;
		border-radius: 4px;
		overflow: hidden;
		margin-left: 44px;
	}

	.legend-bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		animation: barFill 1s ease-out forwards;
	}

	@keyframes barFill {
		from {
			width: 0 !important;
		}
	}
</style>

