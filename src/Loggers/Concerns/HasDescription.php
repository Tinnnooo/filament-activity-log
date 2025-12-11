<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

trait HasDescription
{
    protected bool $shouldShowDescription = false;

    public function shouldShowDescription(): bool
    {
        return $this->shouldShowDescription;
    }
}
