<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Concerns\Types;

use Noin\FilamentActivityLog\ResourceLogger\Field;
use Noin\FilamentActivityLog\ResourceLogger\Types\KeyValueField;

trait KeyValue
{
    public ?KeyValueField $keyValue = null;

    public bool $keyValueDifferenceOnly = true;

    public function keyValue(
        array $fields = [],
        bool $differenceOnly = true,
    ): static {
        $this->type('key-value');
        $this->template('key-value');
        $this->formatStateUsing('array');
        $this->keyValueDifferenceOnly = $differenceOnly;

        if (! empty($fields)) {
            $this->keyValue = KeyValueField::make($fields);

            $this->resolveStateUsing(function ($record) {
                $fields = collect($this->keyValue->getFields());

                return $fields->mapWithKeys(fn ($field) => [
                    $field->name => $field->getStorableValue($record),
                ])->toArray();
            });
        }

        return $this;
    }

    public function resolveKeyValueDifference(mixed $array1, mixed $array2): array
    {
        if (! is_array($array1) || ! is_array($array2)) {
            return [$array1, $array2];
        }

        $diff1 = $this->arrayRecursiveDiff($array1, $array2);
        $diff2 = $this->arrayRecursiveDiff($array2, $array1);

        return [$diff1, $diff2];
    }

    public function displayKeyValue(mixed $value, Field $field): string
    {
        $hasFields = $field->keyValue instanceof KeyValueField;
        if ($hasFields) {
            $fields = $field->keyValue->getFields();
        }

        $isHtmlAllowed = $field->isHtmlAllowed();
        ob_start(); ?>
        <div class="rounded-lg shadow-sm bg-gray-50 dark:bg-transparent ring-1 ring-gray-950/10 dark:ring-white/20">
            <table class="w-full table-fixed truncate text-xs">
                <?php if ($hasFields) { ?>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/20">
                        <?php foreach ($fields as $key => $keyValueField) { ?>
                            <?php
                            if (! array_key_exists($keyValueField->name, $value)) {
                                continue;
                            }

                            $rawValue = $value[$keyValueField->name];
                            $displayValue = $keyValueField->display($rawValue);
                            ?>
                            <tr class="divide-x divide-gray-200 dark:divide-white/20 rtl:divide-x-reverse">
                                <td
                                    class="p-2 w-[1%] whitespace-nowrap">
                                    <?= $keyValueField->getLabel() ?>
                                </td>
                                <td
                                    class="p-2 truncate max-w-0">
                                    <?php if ($isHtmlAllowed) { ?>
                                        <?= $displayValue; ?>
                                    <?php } else { ?>
                                        <?= e($displayValue); ?>
                                    <?php } ?>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                <?php } else { ?>
                    <tbody class="divide-y divide-gray-200 dark:divide-white/20">
                        <?php foreach ((array) $value as $key => $_value) { ?>
                            <tr class="divide-x divide-gray-200 dark:divide-white/20 rtl:divide-x-reverse">
                                <td
                                    class="p-2 w-[1%] whitespace-nowrap">
                                    <?= $key ?>
                                </td>
                                <td
                                    class="p-2 truncate max-w-0">
                                    <?php if ($isHtmlAllowed) { ?>
                                        <?= $_value; ?>
                                    <?php } else { ?>
                                        <?= e($_value); ?>
                                    <?php } ?>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                <?php } ?>
            </table>
        </div>
<?php return ob_get_clean();
    }

    private function arrayRecursiveDiff(array $aArray1, array $aArray2): array
    {
        $aReturn = [];

        foreach ($aArray1 as $mKey => $mValue) {
            if (array_key_exists($mKey, $aArray2)) {
                if (is_array($mValue)) {
                    $aRecursiveDiff = $this->arrayRecursiveDiff($mValue, $aArray2[$mKey]);
                    if (count($aRecursiveDiff)) {
                        $aReturn[$mKey] = $aRecursiveDiff;
                    }
                } else {
                    if ($mValue != $aArray2[$mKey]) {
                        $aReturn[$mKey] = $mValue;
                    }
                }
            } else {
                $aReturn[$mKey] = $mValue;
            }
        }

        return $aReturn;
    }
}
