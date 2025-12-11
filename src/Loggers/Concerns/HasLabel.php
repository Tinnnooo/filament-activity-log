<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

use Illuminate\Contracts\Support\Htmlable;
use Noin\FilamentActivityLog\Loggers\Logger;

trait HasLabel
{
    public static function getLabel(): string|Htmlable|null
    {
        /** @var Logger $this */
        return (string) str(static::$model)
            ->afterLast('\\')
            ->kebab()
            ->replace(['-', '_'], ' ')
            ->ucfirst();
    }
}
