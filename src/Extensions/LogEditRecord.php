<?php

namespace Noin\FilamentActivityLog\Extensions;

use Noin\FilamentActivityLog\Extensions\Concerns\HasUpdated;

trait LogEditRecord
{
    use HasUpdated;

    public function beforeValidate()
    {
        $this->logRecordBefore($this->record);
    }

    public function afterSave()
    {
        $this->logRecordAfter($this->record);
    }
}
