<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface Props {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
		baseUrl?: string;
		itemName?: string;
	}

	let { 
		currentPage, 
		totalPages, 
		totalItems, 
		itemsPerPage, 
		baseUrl = '',
		itemName = 'items'
	}: Props = $props();

	// Calculate page range to show
	const maxVisiblePages = 5;
	const halfVisible = Math.floor(maxVisiblePages / 2);
	
	let startPage = Math.max(1, currentPage - halfVisible);
	let endPage = Math.min(totalPages, currentPage + halfVisible);
	
	// Adjust if we're near the beginning or end
	if (endPage - startPage < maxVisiblePages - 1) {
		if (startPage === 1) {
			endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
		} else {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}
	}

	const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

	function goToPage(pageNum: number) {
		const url = new URL($page.url);
		url.searchParams.set('page', pageNum.toString());
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function goToFirstPage() {
		goToPage(1);
	}

	function goToLastPage() {
		goToPage(totalPages);
	}

	function goToPreviousPage() {
		if (currentPage > 1) {
			goToPage(currentPage - 1);
		}
	}

	function goToNextPage() {
		if (currentPage < totalPages) {
			goToPage(currentPage + 1);
		}
	}

	// Calculate item range for display
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);
</script>

{#if totalPages > 1}
	<div class="pagination">
		<div class="pagination-info">
			Showing {startItem} to {endItem} of {totalItems} {itemName}
		</div>
		
		<div class="pagination-controls">
			<!-- First page -->
			{#if currentPage > 2}
				<button 
					class="pagination-btn pagination-btn-icon"
					onclick={goToFirstPage}
					title="First page"
					aria-label="Go to first page"
				>
					⏮️
				</button>
			{/if}
			
			<!-- Previous page -->
			{#if currentPage > 1}
				<button 
					class="pagination-btn pagination-btn-icon"
					onclick={goToPreviousPage}
					title="Previous page"
					aria-label="Go to previous page"
				>
					⬅️
				</button>
			{/if}
			
			<!-- Page numbers -->
			{#each pages as pageNum}
				<button 
					class="pagination-btn pagination-btn-number"
					class:active={pageNum === currentPage}
					onclick={() => goToPage(pageNum)}
					aria-label="Go to page {pageNum}"
					aria-current={pageNum === currentPage ? 'page' : undefined}
				>
					{pageNum}
				</button>
			{/each}
			
			<!-- Next page -->
			{#if currentPage < totalPages}
				<button 
					class="pagination-btn pagination-btn-icon"
					onclick={goToNextPage}
					title="Next page"
					aria-label="Go to next page"
				>
					➡️
				</button>
			{/if}
			
			<!-- Last page -->
			{#if currentPage < totalPages - 1}
				<button 
					class="pagination-btn pagination-btn-icon"
					onclick={goToLastPage}
					title="Last page"
					aria-label="Go to last page"
				>
					⏭️
				</button>
			{/if}
		</div>
		
		<div class="pagination-summary">
			Page {currentPage} of {totalPages}
		</div>
	</div>
{/if}

<style>
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md) 0;
		border-top: 1px solid var(--color-border-light);
		margin-top: var(--space-lg);
		flex-wrap: wrap;
		gap: var(--space-md);
	}

	.pagination-info {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: 500;
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.pagination-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-border-light);
		background: var(--color-bg-primary);
		color: var(--color-text-primary);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 40px;
		height: 40px;
	}

	.pagination-btn:hover {
		background: var(--color-bg-secondary);
		border-color: var(--color-border-medium);
		transform: translateY(-1px);
	}

	.pagination-btn:active {
		transform: translateY(0);
	}

	.pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.pagination-btn.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.pagination-btn.active:hover {
		background: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
		transform: none;
	}

	.pagination-btn-icon {
		font-size: var(--font-size-base);
		padding: var(--space-sm);
		min-width: 40px;
	}

	.pagination-btn-number {
		min-width: 40px;
	}

	.pagination-summary {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.pagination {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
		}

		.pagination-controls {
			justify-content: center;
			flex-wrap: wrap;
		}

		.pagination-btn {
			min-width: 36px;
			height: 36px;
			font-size: var(--font-size-xs);
		}

		.pagination-btn-icon {
			min-width: 36px;
		}
	}
</style>
