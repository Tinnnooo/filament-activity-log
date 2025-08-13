<?php

namespace Noxo\FilamentActivityLog\Loggers\Concerns;

use Noxo\FilamentActivityLog\Loggers\Logger;
use Illuminate\Contracts\Support\Htmlable;

trait HasLabel
{
    public static function getLabel(): string | Htmlable | null
    {
        /** @var Logger $this */
        return (string) str(static::$model)
            ->afterLast('\\')
            ->kebab()
            ->replace(['-', '_'], ' ')
            ->ucfirst();
    }
}
