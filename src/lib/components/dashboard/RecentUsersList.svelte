<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { getInitials } from '$lib/utils/formatters';

	interface User {
		name: string;
		email: string;
		status: string;
	}

	interface Props {
		users: User[];
	}

	let { users }: Props = $props();
</script>

<article class="card">
	<h2>Recent Users</h2>
	{#if users.length === 0}
		<p class="empty-text">No recent users</p>
	{:else}
		<ul class="activity-list">
			{#each users as user}
				<li class="activity-item">
					<div class="user-avatar-small">
						{getInitials(user.name)}
					</div>
					<div class="activity-content">
						<div class="activity-title">{user.name}</div>
						<div class="activity-subtitle">{user.email}</div>
					</div>
					<StatusBadge status={user.status} type="status" />
				</li>
			{/each}
		</ul>
	{/if}
</article>
