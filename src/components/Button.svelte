<script lang="ts">
	import type { Snippet } from 'svelte';

	let { type = 'button', children, onclick }: {type?: 'button' | 'reset' | 'submit' | null, children: Snippet, onclick: () => void} = $props();
</script>

<button type={type} onclick={onclick} class="rounded border border-blue-500 px-2 py-1 h-10 text-blue-500 hover:bg-blue-500 hover:text-white">
	{@render children()}
</button>