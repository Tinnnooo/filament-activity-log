<?php

namespace Noxo\FilamentActivityLog\ResourceLogger;

use Noxo\FilamentActivityLog\ResourceLogger\Concerns\CanDisplay;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\CanStore;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\FieldResolver;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasLabel;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasName;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasState;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasTemplate;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasType;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\HasView;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Badge;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Boolean;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Date;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Difference;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Enum;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Inline;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\KeyValue;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Media;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Money;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Relation;
use Noxo\FilamentActivityLog\ResourceLogger\Concerns\Types\Table;
use DragonCode\Support\Concerns\Makeable;
use Filament\Forms\Components\Concerns\CanAllowHtml;
use Filament\Support\Concerns\EvaluatesClosures;

class Field
{
    use CanAllowHtml;
    use CanDisplay;
    use CanStore;
    use FieldResolver;
    use HasLabel;
    use HasName;
    use HasState;
    use HasTemplate;
    use HasType;
    use HasView;
    use Badge;
    use Boolean;
    use Date;
    use Difference;
    use Enum;
    use Inline;
    use KeyValue;
    use Media;
    use Money;
    use Relation;
    use Table;
    use EvaluatesClosures;
    use Makeable;

    public function __construct(string $name, ?string $type = null)
    {
        $this->name($name);

        if (! is_null($type)) {
            $this->resolveField($type);
        }
    }
}
