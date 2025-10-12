<script lang="ts">
	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<header class="overview-header">
	<h1>{title}</h1>
	<p>{description}</p>
</header>
