<?php

namespace Noxo\FilamentActivityLog\ResourceLogger;

use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasFields;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasLabel;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasName;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasRelationLoader;
use DragonCode\Support\Concerns\Makeable;

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
