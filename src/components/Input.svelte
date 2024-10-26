<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let { id = '', type = 'text', label, value = $bindable(), disabled = false, min, rightContent }: {id: string, type: HTMLInputTypeAttribute, label?: string, value: unknown, disabled?: boolean, min?: number, rightContent?: Snippet} = $props();
</script>

<div class="flex flex-col w-full">
	{#if label}
		<label class="block text-sm font-medium leading-6 text-gray-800" for={id}>{label}</label>
	{/if}
	<div class="flex w-full">
		<input disabled={disabled} id={id} type={type} bind:value={value} min={min} class={`${rightContent ? 'rounded-l-lg' : 'rounded-lg'} border-neutral-400 h-10 w-full lg:w-fit`}>
		{#if rightContent}
			<div class="flex items-center justify-center rounded-r-lg border border-l-0 border-neutral-400 h-10 w-fit p-2">
				{@render rightContent()}
			</div>
		{/if}
	</div>
</div>