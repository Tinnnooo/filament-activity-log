<?php

namespace Noxo\FilamentActivityLog\Extensions;

use Noxo\FilamentActivityLog\Extensions\Concerns\HasCreated;

trait LogCreateRecord
{
    use HasCreated;

    public function afterCreate()
    {
        $this->logRecordCreated($this->record);
    }
}
