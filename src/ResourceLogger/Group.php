<?php

namespace Noxo\FilamentActivityLog\ResourceLogger;

use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasFields;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasLabel;
use DragonCode\Support\Concerns\Makeable;

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
