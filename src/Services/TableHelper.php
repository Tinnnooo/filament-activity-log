<?php

namespace Noin\FilamentActivityLog\Services;

use Illuminate\Support\Collection;
use Illuminate\View\ComponentAttributeBag;
use Noin\FilamentActivityLog\Loggers\Logger;

final class TableHelper
{
    public static function getTableHtml(
        array $headerCells,
        array $bodyRows,
        bool $hasOld = false,
        $logger = null,
        bool $withHeader = true,
    ): string {
        ob_start(); ?>
        <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-x-auto">
            <table class="w-full table-fixed fi-ta-table text-start text-sm">
                <?php if ($withHeader) { ?>
                    <?php if ($logger) { ?>
                        <?= self::getTableHeaderHtml(
                            $hasOld ? $headerCells['default'] : $headerCells['simple']
                        ) ?>
                    <?php } else { ?>
                        <?= self::getTableHeaderHtml($headerCells) ?>
                    <?php } ?>
                <?php } ?>

                <tbody class="divide-y divide-gray-200 whitespace-nowrap dark:divide-white/5">
                    <?php foreach ($bodyRows as $row) { ?>
                        <?= $row ?>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    <?php return ob_get_clean();
    }

    public static function getTableHeaderHtml(
        array $cells
    ): string {
        ob_start(); ?>
        <thead class="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
            <tr>
                <?php foreach ($cells as $cell) { ?>
                    <?= $cell ?>
                <?php } ?>
            </tr>
        </thead>
    <?php return ob_get_clean();
    }

    public static function getTableHeaderCellHtml(
        string $value,
        ComponentAttributeBag $attributes
    ): string {
        ob_start(); ?>
        <th
            <?= $attributes
                ->class([
                    'fi-ta-header-cell px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300 text-sm',
                    'border-r border-gray-200 dark:border-gray-600 last:border-r-0',
                ])
                ->toHtml() ?>>
            <span class="items-center justify-start w-full group flex gap-x-1 flex-wrap">
                <?= $value ?>
            </span>
        </th>
    <?php return ob_get_clean();
    }

    public static function getTableBodyDefaultHtml(Collection $changes, Logger $logger): array
    {
        $rows = [];

        foreach ($changes['attributes'] as $fieldKey => $newValue) {
            $field = $logger->getFieldByName($fieldKey);
            if (! $field) {
                continue;
            }

            $oldValue = $changes['old'][$fieldKey] ?? null;

            if (
                $field->display($oldValue, raw: true) === $field->display($newValue, raw: true)
            ) {
                continue;
            }

            $cells = [
                self::getTableBodyCellHtml(
                    value: $field->getLabel(),
                    attributes: (new ComponentAttributeBag)
                ),
            ];

            if ($field->is('difference')) {
                $cells[] = self::getTableBodyCellHtml(
                    value: self::getTableBodyCellDifferenceHtml(
                        options: $field->options,
                        oldValue: $oldValue,
                        newValue: $newValue
                    ),
                    attributes: (new ComponentAttributeBag)

                        ->merge([
                            'colspan' => '2',
                        ])
                );
            } else {
                $cells = array_merge(
                    $cells,
                    [
                        self::getTableBodyCellHtml(
                            value: $field->display($oldValue),
                            attributes: (new ComponentAttributeBag)
                        ),
                        self::getTableBodyCellHtml(
                            value: $field->display($newValue),
                            attributes: (new ComponentAttributeBag)
                        ),
                    ]
                );
            }

            $rows[] = self::getTableBodyRowHtml($cells);
        }

        return $rows;
    }

    public static function getTableBodySimpleHtml(Collection $changes, Logger $logger): array
    {
        $rows = [];

        foreach ($changes['attributes'] as $fieldKey => $newValue) {
            $field = $logger->getFieldByName($fieldKey);

            if (! $field) {
                continue;
            }

            $cells = [
                self::getTableBodyCellHtml(
                    value: $field->getLabel(),
                    attributes: (new ComponentAttributeBag)
                ),
                self::getTableBodyCellHtml(
                    value: $field->display($newValue),
                    attributes: (new ComponentAttributeBag)
                ),
            ];
            $rows[] = self::getTableBodyRowHtml($cells);
        }

        return $rows;
    }

    public static function getTableBodyRowHtml(array $cells): string
    {
        ob_start(); ?>
        <tr class="fi-ta-row [@media(hover:hover)]:transition [@media(hover:hover)]:duration-75">
            <?php foreach ($cells as $cell) { ?>
                <?= $cell ?>
            <?php } ?>
        </tr>
    <?php return ob_get_clean();
    }

    public static function getTableBodyCellHtml(string $value, ComponentAttributeBag $attributes): string
    {
        ob_start(); ?>
        <td
            <?= $attributes
                ->class([
                    'fi-ta-cell px-3 py-2 align-top text-left text-gray-700 dark:text-gray-300 text-sm',
                    'border-r border-gray-200 dark:border-gray-600 last:border-r-0',
                    'overflow-x-auto',
                ])
                ->toHtml() ?>>
            <?= $value ?>
        </td>
    <?php return ob_get_clean();
    }

    public static function getTableBodyCellDifferenceHtml(
        array $options,
        ?string $oldValue,
        ?string $newValue
    ): string {
        ob_start(); ?>
        <div
            <?= (new ComponentAttributeBag)
                ->merge([
                    'x-data' => '{
                    oldValue: `' . htmlspecialchars($oldValue, ENT_QUOTES) . '`,
                    newValue: `' . htmlspecialchars($newValue, ENT_QUOTES) . "`,
                    method: '" . ($options['method'] ?? 'diffWords') . "',
                    options: " . json_encode($options['options'] ?? []) . '
                }',
                    'x-html' => 'getStringsDifference(oldValue, newValue, method, options)',
                ]) ?>>
        </div>
    <?php return ob_get_clean();
    }

    public static function getTableTemplateHtml(bool $hasOld, Collection $changes, Logger $logger): string
    {
        $headerCells = [
            'default' => [
                self::getTableHeaderCellHtml(
                    value: __('filament-activity-log::activities.table.field'),
                    attributes: (new ComponentAttributeBag)
                        ->merge([
                            'width' => '20%',
                        ])
                ),
                self::getTableHeaderCellHtml(
                    value: __('filament-activity-log::activities.table.old'),
                    attributes: (new ComponentAttributeBag)
                        ->merge([
                            'width' => '40%',
                        ])
                ),
                self::getTableHeaderCellHtml(
                    value: __('filament-activity-log::activities.table.new'),
                    attributes: (new ComponentAttributeBag)
                        ->merge([
                            'width' => '40%',
                        ])
                ),
            ],
            'simple' => [
                self::getTableHeaderCellHtml(
                    value: __('filament-activity-log::activities.table.field'),
                    attributes: (new ComponentAttributeBag)
                        ->merge([
                            'width' => '20%',
                        ])
                ),
                self::getTableHeaderCellHtml(
                    value: __('filament-activity-log::activities.table.value'),
                    attributes: (new ComponentAttributeBag)
                        ->merge([
                            'width' => '80%',
                        ])
                ),
            ],
        ];

        $bodyRows = [];

        if ($hasOld) {
            $bodyRows = self::getTableBodyDefaultHtml(
                changes: $changes,
                logger: $logger,
            );
        } else {
            $bodyRows = self::getTableBodySimpleHtml(
                changes: $changes,
                logger: $logger,
            );
        }

        ob_start(); ?>

        <div
            <?= (new ComponentAttributeBag)
                ->class([
                    'mt-2',
                ])
                ->merge([
                    'x-show' => '!isCollapsed',
                ])
        ?>>
            <?= self::getTableHtml(
                headerCells: $headerCells,
                bodyRows: $bodyRows,
                hasOld: $hasOld,
                logger: $logger
            ) ?>
        </div>
<?php return ob_get_clean();
    }
}
