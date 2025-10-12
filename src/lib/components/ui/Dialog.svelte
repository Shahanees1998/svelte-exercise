<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Props {
		open?: boolean;
		title?: string;
		onclose?: () => void;
		children?: any;
	}
	
	let { open = $bindable(false), title = '', onclose, children }: Props = $props();
	
	let dialogEl: HTMLDialogElement;
	
	$effect(() => {
		if (!dialogEl) return;
		
		if (open) {
			dialogEl.showModal();
		} else {
			dialogEl.close();
		}
	});
	
	function handleClose() {
		open = false;
		onclose?.();
	}
	
	function handleCancel(e: Event) {
		e.preventDefault();
		handleClose();
	}
	
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogEl) {
			handleClose();
		}
	}
</script>

<dialog 
	bind:this={dialogEl} 
	oncancel={handleCancel}
	onclick={handleBackdropClick}
>
	<div class="dialog-header">
		<h2>{title}</h2>
		<button 
			class="dialog-close" 
			onclick={handleClose}
			aria-label="Close"
			type="button"
		>
			×
		</button>
	</div>
	<div class="dialog-body">
		{@render children?.()}
	</div>
</dialog>


