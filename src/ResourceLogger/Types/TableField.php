<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Types;

use Noin\FilamentActivityLog\Loggers\Concerns\Makeable;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasFields;

class TableField
{
    use HasFields;
    use Makeable;

    public function __construct(array $fields)
    {
        $this->fields($fields);
    }
}
