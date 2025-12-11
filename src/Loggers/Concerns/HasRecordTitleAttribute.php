<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Model;

trait HasRecordTitleAttribute
{
    public ?string $recordTitleAttribute = null;

    public function getRecordTitleAttribute(): string
    {
        return $this->recordTitleAttribute ?? Filament::getModelResource(static::$model)::getRecordTitleAttribute();
    }

    public function getRelationTitleAttribute(string|Model $modelClass): string
    {
        return Filament::getModelResource($modelClass)::getRecordTitleAttribute();
    }
}
