<x-filament-activity-log::table.index class="w-full overflow-hidden text-sm table-fixed!">
    <x-slot:header>
        <x-filament-activity-log::table.header-cell width="20%">
            @lang('filament-activity-log::activities.table.field')
        </x-filament-activity-log::table.header-cell>

        <x-filament-activity-log::table.header-cell width="80%">
            @lang('filament-activity-log::activities.table.value')
        </x-filament-activity-log::table.header-cell>
    </x-slot:header>

    @foreach ($changes['attributes'] as $key => $value)
        @php
            $field = $logger->getFieldByName($key);
            if (!$field) {
                continue;
            }
        @endphp

        <x-filament-activity-log::table.row>
            <x-filament-activity-log::table.cell class="px-4 py-2 align-top sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                {{ $field->getLabel() }}
            </x-filament-activity-log::table.cell>

            <x-filament-activity-log::table.cell class="px-4 py-2 align-top sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                {{ $field->display($value) }}
            </x-filament-activity-log::table.cell>
        </x-filament-activity-log::table.row>
    @endforeach
</x-filament-activity-log::table.index>
