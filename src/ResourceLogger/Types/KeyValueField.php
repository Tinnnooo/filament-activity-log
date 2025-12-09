<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Types;

use DragonCode\Support\Concerns\Makeable;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasFields;

class KeyValueField
{
    use HasFields;
    use Makeable;

    public function __construct(array $fields)
    {
        $this->fields($fields);
    }
}
