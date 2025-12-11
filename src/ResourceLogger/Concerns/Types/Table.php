<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Concerns\Types;

use Closure;
use Illuminate\View\ComponentAttributeBag;
use Noin\FilamentActivityLog\ResourceLogger\Field;
use Noin\FilamentActivityLog\ResourceLogger\Types\TableField;
use Noin\FilamentActivityLog\Services\TableHelper;

trait Table
{
    public ?TableField $table;

    public bool $tableDifferenceOnly = true;

    public function table(
        array $fields,
        ?Closure $resolveRecords = null,
        bool $differenceOnly = true,
    ): static {
        $this->type('table');
        $this->template('table');
        $this->table = TableField::make($fields);
        $this->tableDifferenceOnly = $differenceOnly;

        $this->formatStateUsing('array');
        $this->resolveStateUsing(function ($record) use ($resolveRecords) {
            $records = collect(
                is_null($resolveRecords)
                    ? data_get($record, $this->name)
                    : $resolveRecords($record)
            );

            $fields = collect($this->table->getFields());

            return $records->map(function ($record) use ($fields) {
                return $fields->mapWithKeys(fn ($field) => [
                    $field->name => $field->getStorableValue($record),
                ])->toArray();
            })->toArray();
        });

        return $this;
    }

    public function resolveTableDifference(mixed $array1, mixed $array2): array
    {
        if (! is_array($array1) || ! is_array($array2)) {
            return [$array1, $array2];
        }

        foreach ($array1 as $key1 => $row1) {
            foreach ($array2 as $key2 => $row2) {
                if ($row1 === $row2) {
                    unset($array1[$key1], $array2[$key2]);
                }
            }
        }

        $array1 = array_values($array1);
        $array2 = array_values($array2);

        return [$array1, $array2];
    }

    public function displayTable(mixed $value, Field $field): ?string
    {
        if (empty($value)) {
            return null;
        }

        $fields = $field->table->getFields();
        $isHtmlAllowed = $field->isHtmlAllowed();

        $headerCells = [];
        $bodyRows = [];

        foreach ($fields as $tableField) {
            $headerCells[] = TableHelper::getTableHeaderCellHtml(
                value: $isHtmlAllowed ? $tableField->label : e($tableField->label),
                attributes: (new ComponentAttributeBag)
                    ->class([
                        'p-2! border-r border-gray-200 last:border-r-0',
                    ])
            );
        }

        foreach ($value as $item) {
            $cells = [];
            foreach ($fields as $tableField) {
                $rawValue = $item[$tableField->name] ?? data_get($item, $tableField->name);
                $displayValue = $tableField->display($rawValue);

                $cells[] = TableHelper::getTableBodyCellHtml(
                    value: $isHtmlAllowed
                        ? $displayValue
                        : e($displayValue),
                    attributes: (new ComponentAttributeBag)
                        ->class([
                            'px-4 py-2 align-top border-r border-gray-200 last:border-r-0',
                        ])
                );
            }
            $bodyRows[] = TableHelper::getTableBodyRowHtml($cells);
        }

        ob_start(); ?>

            <?= TableHelper::getTableHtml(
                headerCells: $headerCells,
                bodyRows: $bodyRows,
                hasOld: false,
                logger: null,
                withHeader: true,
            ) ?>

<?php return ob_get_clean();
    }
}
