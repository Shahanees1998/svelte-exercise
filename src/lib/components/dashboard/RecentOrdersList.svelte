<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { formatPrice } from '$lib/utils/formatters';

	interface Order {
		orderNumber: string;
		customerName: string;
		totalAmount: number;
		status: string;
	}

	interface Props {
		orders: Order[];
	}

	let { orders }: Props = $props();
</script>

<article class="card">
	<h2>Recent Orders</h2>
	{#if orders.length === 0}
		<p class="empty-text">No recent orders</p>
	{:else}
		<ul class="activity-list">
			{#each orders as order}
				<li class="activity-item">
					<div class="activity-icon" aria-hidden="true">🛒</div>
					<div class="activity-content">
						<div class="activity-title">{order.orderNumber}</div>
						<div class="activity-subtitle">{order.customerName} • {formatPrice(order.totalAmount)}</div>
					</div>
					<StatusBadge status={order.status} type="status" />
				</li>
			{/each}
		</ul>
	{/if}
</article>
