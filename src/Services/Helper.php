<?php

namespace Noin\FilamentActivityLog\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Noin\FilamentActivityLog\Loggers\Logger;
use Noin\FilamentActivityLog\Loggers\Loggers;
use UnitEnum;

final class Helper
{
    public static function resolveEnum(string $enum, ?string $name): ?UnitEnum
    {
        foreach ($enum::cases() as $unit) {
            if (strtolower($name) === strtolower($unit->name)) {
                return $unit;
            }
        }

        return null;
    }

    /**
     * @return class-string<Logger>
     */
    public static function resolveLogger(null | string | Model $record, bool $force = false): ?string
    {
        if (! $record) {
            return null;
        }

        $name = is_string($record) ? $record : get_class($record);

        $name = is_string($record)
            ? (Relation::getMorphedModel($record) ?: $record)
            : get_class($record);

        return Loggers::getLoggerByModel($name, $force);
    }

    public static function resolveInlineField($logger, array $attributes, array $old = []): ?array
    {
        foreach ($attributes as $key => $newValue) {
            $field = $logger->getFieldByName($key);
            if (! $field) {
                continue;
            }

            $oldValue = $old[$key] ?? null;

            if ($field->isInline()) {
                return [$field, $oldValue, $newValue];
            }
        }

        return null;
    }

    public static function getEventStyle(?string $event): string
    {
        $defaultStyles = [
            'created' => 'success',
            'attached' => 'success',
            'associated' => 'success',
            'updated' => 'primary',
            'deleted' => 'danger',
            'detached' => 'danger',
            'dissociated' => 'danger',
            'restored' => 'warning',
        ];

        $customStyles = array_replace_recursive(
            $defaultStyles,
            config('filament-activity-log.custom_event_styles', [])
        );

        return $customStyles[$event] ?? 'gray';
    }
}
