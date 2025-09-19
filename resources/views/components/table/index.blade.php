@props([
    'header' => null,
])

<table
    {{ $attributes->class(['fi-ta-table w-full table-auto divide-y divide-gray-200 text-start dark:divide-white/5']) }}>
    @if ($header)
        <thead class="divide-y divide-gray-200 dark:divive-white/5">
            <tr class="bg-gray-50 dark:bg-white/5">
                {{ $header }}
            </tr>
        </thead>
    @endif
    <tbody class="divide-y divide-gray-200 whitespace-nowrap dark:divide-white/5">
        {{ $slot }}
    </tbody>
</table>
