<?php

namespace Noin\FilamentActivityLog\ResourceLogger;

use DragonCode\Support\Concerns\Makeable;
use Filament\Forms\Components\Concerns\CanAllowHtml;
use Filament\Support\Concerns\EvaluatesClosures;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\CanDisplay;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\CanStore;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\FieldResolver;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasLabel;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasName;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasState;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasTemplate;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasType;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\HasView;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Badge;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Boolean;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Date;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Difference;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Enum;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Inline;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\KeyValue;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Media;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Money;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Relation;
use Noin\FilamentActivityLog\ResourceLogger\Concerns\Types\Table;

class Field
{
    use Badge;
    use Boolean;
    use CanAllowHtml;
    use CanDisplay;
    use CanStore;
    use Date;
    use Difference;
    use Enum;
    use EvaluatesClosures;
    use FieldResolver;
    use HasLabel;
    use HasName;
    use HasState;
    use HasTemplate;
    use HasType;
    use HasView;
    use Inline;
    use KeyValue;
    use Makeable;
    use Media;
    use Money;
    use Relation;
    use Table;

    public function __construct(string $name, ?string $type = null)
    {
        $this->name($name);

        if (! is_null($type)) {
            $this->resolveField($type);
        }
    }
}
