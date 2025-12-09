<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

trait HasTimezone
{
    public function getTimezone(): string
    {
        return config('app.timezone');
    }
}
