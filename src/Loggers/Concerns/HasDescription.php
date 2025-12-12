<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

use Spatie\Activitylog\Models\Activity;

trait HasDescription
{
    protected bool $shouldShowDescription = false;

    public function shouldShowDescription(Activity $activity): bool
    {
        return $this->shouldShowDescription;
    }
}
