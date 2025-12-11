<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

use Filament\Support\Facades\FilamentTimezone;

trait HasTimezone
{
    public function getTimezone(): string
    {
        return FilamentTimezone::get();
    }
}
