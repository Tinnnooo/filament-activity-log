<?php

namespace Noin\FilamentActivityLog\ResourceLogger;

use Noin\FilamentActivityLog\Loggers\Concerns\Makeable;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasFields;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasLabel;

/**
 * @todo Group not working yet..
 */
class Group
{
    use HasFields;
    use HasLabel;
    use Makeable;

    public function __construct(array $fields)
    {
        $this->fields($fields);
    }
}
