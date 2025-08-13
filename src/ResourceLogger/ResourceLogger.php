<?php

namespace Noxo\FilamentActivityLog\ResourceLogger;

use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasFields;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasRelationLoader;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasRelationManagers;

class ResourceLogger
{
    use HasFields;
    use HasRelationLoader;
    use HasRelationManagers;
}
