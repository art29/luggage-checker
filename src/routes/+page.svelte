<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Input from '../components/Input.svelte';
	import { checkLuggageBySize, type CarrierWithAllowedLuggage } from '../api';
	import CarrierCard from '../components/CarrierCard.svelte';
	import MultiSelect from 'svelte-multiselect';
	import { getCountryFromCode } from '../utils';
	import { i18n } from '$lib/i18n.js'
	import { page } from '$app/stores'
	import { languageTag } from "$lib/paraglide/runtime.js"

	let carriersRequirements = $state<CarrierWithAllowedLuggage[] | null>(null);

	// Size related
	let measuringUnit = $state<'CM' | 'IN'>('CM');
	let width = $state<number | null>(null);
	let height = $state<number | null>(null);
	let depth = $state<number | null>(null);

	// Check if all dimensions are filled
	let allFilled = $derived(() => !!width && !!height && !!depth);

	// Selects
	let countries = $derived(() => {
		if (carriersRequirements) {
			return Array.from(new Set(carriersRequirements.map((carrier) => carrier.country)));
		}
		return [];
	})
	let carriers = $derived(() => {
		if (carriersRequirements) {
			return Array.from(new Set(carriersRequirements.map((carrier) => carrier.carrierName)));
		}
		return [];
	})

	let selectedCountries = $state<string[]>([]);
	let selectedCarriers = $state<string[]>([]);

	// Filtered carriers requirements
	let filteredCarriersRequirements = $derived(() => {
		if (carriersRequirements) {
			return carriersRequirements.filter((carrier) => {
				return (selectedCountries.length === 0 || selectedCountries.includes(carrier.country)) && (selectedCarriers.length === 0 || selectedCarriers.includes(carrier.carrierName));
			});
		}
		return [];
	});

	$effect(() => {
		if (allFilled()) {
			processDimensions();
		}
	});

	const processDimensions = () => {
		if (!width || !height || !depth) {
			return;
		}

		const luggageDimensions = [width, height, depth].map((dimension) => {
			return measuringUnit === 'CM' ? dimension : dimension * 2.54;
		}) as [number, number, number];

		carriersRequirements = checkLuggageBySize(luggageDimensions)
	}

	const switchMeasuringUnit = () => {
		measuringUnit = measuringUnit === 'CM' ? 'IN' : 'CM';
	}
</script>

{#snippet rightContent()}
	<button onclick={switchMeasuringUnit}>
		{measuringUnit}
	</button>
{/snippet}

<div class="flex flex-col min-h-dvh pt-[10%] px-5 md:px-10 lg:px-[20%]">
	<h1 class="text-5xl text-center font-extrabold">
		{m.luggageChecker()}
		<a href={i18n.route($page.url.pathname)} hreflang={languageTag() === 'en' ? 'fr' : 'en'} class="text-3xl font-bold">{languageTag() === 'en' ? 'EN' : 'FR'}</a>
	</h1>
	<p class="mt-6 text-lg text-gray-700 text-center max-w-3xl mx-auto">
		{m.luggageCheckerDescription()}
	</p>
	<div class="flex flex-col lg:flex-row gap-3 lg:items-end justify-center mt-10">
		<Input id="width" type="number" label={m.width()} bind:value={width} min={0} rightContent={rightContent} /> <Input id="height" label={m.height()} type="number" bind:value={height} rightContent={rightContent} /> <Input id="depth" label={m.depth()} type="number" bind:value={depth} rightContent={rightContent} />
	</div>
	<div class="flex-grow">
		{#if allFilled()}
			<div class="flex flex-col md:flex-row gap-3 mt-2">
				{#if countries().length > 0}
					<div class="flex flex-col w-full">
						<label class="block text-sm font-medium leading-6 text-gray-800" for="country-select">{m.filterCountries()}</label>
						<MultiSelect bind:selected={selectedCountries} outerDivClass="rounded-lg border-neutral-400 w-full" id="country-select" options={countries()} placeholder={m.chooseCountries()} let:option>
					<span>
						{getCountryFromCode(option)}
						</span>
						</MultiSelect>
					</div>
					{/if}
				{#if countries().length > 0}
				<div class="flex flex-col w-full">
					<label class="block text-sm font-medium leading-6 text-gray-800" for="country-select">{m.filterCarriers()}</label>
					<MultiSelect bind:selected={selectedCarriers} outerDivClass="rounded-lg border-neutral-400 w-full" id="country-select" options={carriers()} placeholder={m.chooseCarriers()} />
				</div>
				{/if}
			</div>
			<div class="mt-10 flex flex-col items-center gap-4">
				{#if filteredCarriersRequirements()}
					{#each filteredCarriersRequirements() as carrierRequirements}
						<CarrierCard measuringUnit={measuringUnit} carrierRequirements={carrierRequirements} />
					{/each}
					{/if}
			</div>
		{/if}
	</div>
	<div class="px-2 pb-3 pt-5">
		<hr />
		<p class="mt-3">Made by <a href="https://github.com/art29" target="_blank" rel="noopener" class="hover:underline underline-offset-2">Arthur Fétiveau</a>, Licensed under GNU General Public License v3.0. Code available on
			<a href="https://github.com/art29/luggage-checker" target="_blank" class="hover:underline underline-offset-2">GitHub</a>.</p>
	</div>
</div>