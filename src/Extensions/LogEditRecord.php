<?php

namespace Noxo\FilamentActivityLog\Extensions;

use Noxo\FilamentActivityLog\Extensions\Concerns\HasUpdated;

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
