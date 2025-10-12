<script lang="ts">
	interface OrderStats {
		totalOrders: number;
		pendingOrders: number;
		processingOrders: number;
		shippedOrders: number;
		deliveredOrders: number;
		cancelledOrders: number;
	}

	interface Props {
		stats: OrderStats;
	}

	let { stats }: Props = $props();

	function getPercentage(value: number, total: number): number {
		return total ? (value / total * 100) : 0;
	}
</script>

<section class="card" aria-labelledby="order-status-heading">
	<h2 id="order-status-heading">Order Status Distribution</h2>
	<div class="status-grid">
		<div class="status-item">
			<div class="status-label status-pending">⏳ Pending</div>
			<div class="status-value">{stats.pendingOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-pending" 
					style="width: {getPercentage(stats.pendingOrders, stats.totalOrders)}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-processing">🔄 Processing</div>
			<div class="status-value">{stats.processingOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-processing" 
					style="width: {getPercentage(stats.processingOrders, stats.totalOrders)}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-shipped">📦 Shipped</div>
			<div class="status-value">{stats.shippedOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-shipped" 
					style="width: {getPercentage(stats.shippedOrders, stats.totalOrders)}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-delivered">✅ Delivered</div>
			<div class="status-value">{stats.deliveredOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-delivered" 
					style="width: {getPercentage(stats.deliveredOrders, stats.totalOrders)}%"
				></div>
			</div>
		</div>
		
		<div class="status-item">
			<div class="status-label status-cancelled">❌ Cancelled</div>
			<div class="status-value">{stats.cancelledOrders}</div>
			<div class="status-bar">
				<div 
					class="status-fill status-cancelled" 
					style="width: {getPercentage(stats.cancelledOrders, stats.totalOrders)}%"
				></div>
			</div>
		</div>
	</div>
</section>
