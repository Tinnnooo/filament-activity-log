<?php

namespace Noin\FilamentActivityLog\ResourceLogger;

use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasFields;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasRelationLoader;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasRelationManagers;

class ResourceLogger
{
    use HasFields;
    use HasRelationLoader;
    use HasRelationManagers;
}
