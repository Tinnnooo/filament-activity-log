@if (!empty($value))
    @php
        $fields = $field->table->getFields();
        $isHtmlAllowed = $field->isHtmlAllowed();
    @endphp

    <div class="w-full overflow-x-auto border border-gray-200 dark:border-white/5 rounded-lg">
        <x-filament-activity-log::table.index>
            <x-slot:header>
                @foreach ($fields as $field)
                    <x-filament-activity-log::table.header-cell class="p-2!">
                        {{ $field->getLabel() }}
                    </x-filament-activity-log::table.header-cell>
                @endforeach
            </x-slot:header>


            @foreach ($value as $item)
                <x-filament-activity-log::table.row>
                    @foreach ($fields as $field)
                        <x-filament-activity-log::table.cell class="p-2 align-top">
                            @php
                                $rawValue = $item[$field->name] ?? data_get($item, $field->name);
                                $dispayValue = $field->display($rawValue);
                            @endphp

                            @if ($isHtmlAllowed)
                                {!! $dispayValue !!}
                            @else
                                {{ $dispayValue }}
                            @endif
                        </x-filament-activity-log::table.cell>
                    @endforeach
                </x-filament-activity-log::table.row>
            @endforeach
        </x-filament-activity-log::table.index>
    </div>
@endif
