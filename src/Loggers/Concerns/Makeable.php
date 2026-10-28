<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

trait Makeable
{
    public static function make(...$parameters): static
    {
        return new static(...$parameters);
    }
}
