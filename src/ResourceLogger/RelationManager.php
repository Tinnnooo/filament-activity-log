<?php

namespace Noin\FilamentActivityLog\ResourceLogger;

use DragonCode\Support\Concerns\Makeable;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasFields;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasLabel;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasName;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasRelationLoader;

class RelationManager
{
    use HasFields;
    use HasLabel;
    use HasName;
    use HasRelationLoader;
    use Makeable;

    public function __construct(string $name)
    {
        $this->name($name);
    }
}
