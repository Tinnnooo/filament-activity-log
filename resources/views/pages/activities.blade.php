<x-filament-panels::page>
    @php
        $paginator = $this->getActivities();
        $timezone = $this->getTimezone();
    @endphp

    <div class="flex flex-col gap-4">
        <div class="relative">
            {{ $this->form }}

            @if ($this->hasActiveFilters())
                <div class="absolute" style="top: 0.25rem; right: 1rem">
                    <x-filament::link
                        :attributes="
                            \Filament\Support\prepare_inherited_attributes(
        new \Illuminate\View\ComponentAttributeBag([
            'color' => 'danger',
            'tag' => 'button',
            'wire:click' => 'resetFiltersForm',
            'wire:loading.remove.delay.' . config('filament.livewire_loading_delay', 'default') => '',
        ]),
    )
                        "
                    >
                        {{
                            __(
                                'filament-tables::table.filters.actions.reset.label',
                            )
                        }}
                    </x-filament::link>
                </div>
            @endif
        </div>

        <div class="flex items-center justify-between">
            <div>
                <x-filament::button wire:click="refreshPage" icon="heroicon-o-arrow-path" color="gray" size="sm">
                </x-filament::button>
            </div>

            @if (!$this->isRecordsEmpty() && $this->isCollapsible)
                <div class="flex justify-end gap-x-3">
                    <x-filament::link color="gray" tag="button" size="sm" x-on:click="$dispatch('collapse-all')">
                        @lang ('filament-forms::components.repeater.actions.collapse_all.label')
                    </x-filament::link>

                    <x-filament::link color="gray" tag="button" size="sm" wire:click="expandAll">
                        @lang ('filament-forms::components.repeater.actions.expand_all.label')
                    </x-filament::link>
                </div>
            @endif
        </div>

        <div class="space-y-4" wire:poll.{{ $this->pollingInterval }}s.visible>
            {!! $this->contentHtml() !!}

            @if ($paginator->isNotEmpty())
                <x-filament::pagination
                    :page-options="$this->getTableRecordsPerPageSelectOptions()"
                    :paginator="$paginator"
                    class="px-3 py-3 sm:px-6"
                />
            @endif
        </div>
    </div>
</x-filament-panels::page>
