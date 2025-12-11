<?php

namespace Noin\FilamentActivityLog\Loggers;

use Closure;
use DragonCode\Support\Concerns\Makeable;
use Illuminate\Database\Eloquent\Model;
use Noin\FilamentActivityLog\Loggers\Concerns\HasCaused;
use Noin\FilamentActivityLog\Loggers\Concerns\HasDescription;
use Noin\FilamentActivityLog\Loggers\Concerns\HasEvents;
use Noin\FilamentActivityLog\Loggers\Concerns\HasLabel;
use Noin\FilamentActivityLog\Loggers\Concerns\HasRecordTitleAttribute;
use Noin\FilamentActivityLog\Loggers\Concerns\HasRelationManager;
use Noin\FilamentActivityLog\Loggers\Concerns\HasResourceLogger;
use Noin\FilamentActivityLog\Loggers\Concerns\Loggable;

class Logger
{
    use HasCaused;
    use HasDescription;
    use HasEvents;
    use HasLabel;
    use HasRecordTitleAttribute;
    use HasRelationManager;
    use HasResourceLogger;
    use Loggable;
    use Makeable;

    public static bool $disabled = false;

    public static ?string $model;

    protected ?Model $newModel;

    protected ?Model $oldModel;

    public function __construct(?Model $newModel = null, ?Model $oldModel = null)
    {
        if (is_null($oldModel)) {
            $this->newModel = $newModel;
            $this->oldModel = $oldModel;
        } else {
            $this->newModel = $oldModel;
            $this->oldModel = $newModel;
        }
    }

    /**
     * @deprecated
     */
    public function through(Closure $callback): static
    {
        $callback(clone $this->newModel);

        $this->oldModel = clone $this->newModel;
        $this->newModel->refresh();

        return $this;
    }
}
