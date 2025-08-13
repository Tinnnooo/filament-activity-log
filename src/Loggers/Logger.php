<?php

namespace Noxo\FilamentActivityLog\Loggers;

use Noxo\FilamentActivityLog\Loggers\Concerns\HasCaused;
use Noxo\FilamentActivityLog\Loggers\Concerns\HasEvents;
use Noxo\FilamentActivityLog\Loggers\Concerns\HasLabel;
use Noxo\FilamentActivityLog\Loggers\Concerns\HasRelationManager;
use Noxo\FilamentActivityLog\Loggers\Concerns\HasResourceLogger;
use Noxo\FilamentActivityLog\Loggers\Concerns\Loggable;
use Closure;
use DragonCode\Support\Concerns\Makeable;
use Illuminate\Database\Eloquent\Model;

class Logger
{
    use HasCaused;
    use HasEvents;
    use HasLabel;
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
