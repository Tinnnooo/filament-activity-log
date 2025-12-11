<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

use Illuminate\Support\Collection;

trait HasRecords
{
    protected ?Collection $records = null;

    protected bool $isEmpty = true;

    public function records(?array $records = null): static
    {
        $this->records = collect($records);
        $this->isEmpty = $this->records ? $this->records->isEmpty() : true;

        return $this;
    }

    public function isRecordsEmpty(): bool
    {
        return $this->isEmpty;
    }
}
