<script lang="ts">
	export let title: string;
	export let items: Array<{
		id: string;
		primaryText: string;
		secondaryText: string;
		avatar: string;
		createdAt: string;
	}>;
</script>

<div class="recent-card">
	<h3>{title}</h3>
	<div class="recent-list">
		{#each items as item}
			<div class="recent-item">
				<div class="recent-avatar">
					{item.avatar}
				</div>
				<div class="recent-content">
					<h4>{item.primaryText}</h4>
					<p>{item.secondaryText}</p>
				</div>
				<span class="recent-time">
					{new Date(item.createdAt).toLocaleDateString()}
				</span>
			</div>
		{/each}
		{#if items.length === 0}
			<div class="empty-state">
				<p>No items yet</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.recent-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.recent-card h3 {
		font-size: 20px;
		font-weight: 600;
		color: #1a202c;
		margin: 0 0 20px 0;
	}

	.recent-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.recent-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px;
		border-radius: 8px;
		transition: background-color 0.2s ease;
	}

	.recent-item:hover {
		background-color: #f7fafc;
	}

	.recent-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 600;
		font-size: 18px;
		flex-shrink: 0;
	}

	.recent-content {
		flex: 1;
		min-width: 0;
	}

	.recent-content h4 {
		font-size: 14px;
		font-weight: 600;
		color: #2d3748;
		margin: 0 0 4px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recent-content p {
		font-size: 13px;
		color: #718096;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recent-time {
		font-size: 12px;
		color: #a0aec0;
		flex-shrink: 0;
	}

	.empty-state {
		text-align: center;
		padding: 32px 16px;
		color: #a0aec0;
	}

	.empty-state p {
		margin: 0;
		font-size: 14px;
	}
</style>

