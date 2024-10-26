<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { CarrierWithAllowedLuggage, LuggageTypes } from '../api';
	import { faSuitcaseRolling } from '@fortawesome/free-solid-svg-icons/faSuitcaseRolling';
	import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
	import { faBriefcase, faCheck, faSuitcase, faTimes } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let {measuringUnit, carrierRequirements}: {measuringUnit: 'CM' | 'IN', carrierRequirements: CarrierWithAllowedLuggage} = $props();

	const getTranslationForLuggageType = (type: LuggageTypes): string => {
		switch (type) {
			case 'PERSONAL_ITEM':
				return m.personalItem();
			case 'CARRY_ON':
				return m.carryOn();
			case 'CHECKED':
				return m.checkedLuggage();
			default:
				return '';
		}
	}

	const getIconForLuggageType = (type: LuggageTypes): IconDefinition => {
		switch (type) {
			case 'PERSONAL_ITEM':
				return faBriefcase;
			case 'CARRY_ON':
				return faSuitcase;
			case 'CHECKED':
				return faSuitcaseRolling;
			default:
				return faSuitcaseRolling;
		}
	}
</script>

<div class="flex flex-col gap-1 border rounded-md p-4 w-full">
	<h2 class="text-xl font-semibold mb-1">{carrierRequirements.carrierName} ({carrierRequirements.carrierCodes.join(" / ")})</h2>
	<div class="grid grid-rows-3 lg:grid-rows-none lg:grid-cols-3 grid-flow-col gap-4">
		{#each carrierRequirements.luggageTypes as luggageType}
			<div class="flex flex-col">
				<div class="flex items-center mb-1">
					<span class="mr-2"><Fa size="lg" icon={getIconForLuggageType(luggageType.type)} /></span>
					<h3 class="text-md font-semibold text-gray-700">
						{getTranslationForLuggageType(luggageType.type)}
					</h3>
				</div>

				<p class="text-sm text-gray-500 mb-2">{m.allowedSize()} {luggageType.maxTotalSize ? `${luggageType.maxTotalSize} ${measuringUnit}` : `${luggageType.maxHeight} x ${luggageType.maxWidth} x ${luggageType.maxDepth} ${measuringUnit}`}</p>

				<p class={`text-md text-gray-700 flex items-center gap-2 ${luggageType.isAllowed ? 'text-green-700' : 'text-red-500'}`}>
					<Fa size="lg" icon={luggageType.isAllowed ? faCheck : faTimes}/>
					{luggageType.isAllowed ? m.yes() : m.no()}
				</p>
			</div>
		{/each}
	</div>
</div>