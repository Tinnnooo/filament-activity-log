<?php

namespace Noin\FilamentActivityLog\Extensions;

use Noin\FilamentActivityLog\Extensions\Concerns\HasCreated;

trait LogCreateRecord
{
    use HasCreated;

    public function afterCreate()
    {
        $this->logRecordCreated($this->record);
    }
}
