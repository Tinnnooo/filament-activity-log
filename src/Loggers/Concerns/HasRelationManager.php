<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Noin\FilamentActivityLog\ResourceLogger\RelationManager;
use Spatie\Activitylog\Models\Activity;

trait HasRelationManager
{
    public ?RelationManager $relationManager = null;

    protected ?Model $ownerRecord = null;

    public function relationManager(string|RelationManager $manager): static
    {
        if (is_string($manager)) {
            $manager = static::getRelationManager($manager);
        }

        $this->relationManager = $manager;

        return $this;
    }

    public function ownerRecord(Model $model): static
    {
        $this->ownerRecord = $model;

        return $this;
    }

    public static function getRelationManager(string $name): ?RelationManager
    {
        return static::getResourceLogger()->getRelationManager($name);
    }

    public function getRelationManagerRoute(Activity $activity): ?string
    {
        return null;
    }

    public function getRelationManagerLabel(): ?string
    {
        return $this->relationManager->getLabel();
    }

    public function getRelationManagerId(Activity $activity): ?string
    {
        $value = $activity->properties['relation_manager']['id'] ?? null;

        return $value ? "<{$value}>" : '–';
    }

    public function getRelationManagerAttribute(Activity $activity): ?string
    {
        $relationData = $activity->properties['relation_manager'] ?? [];
        $relatedId = data_get($relationData, 'id');
        $relationName = data_get($relationData, 'name');

        if (! $relatedId || ! $relationName || ! $activity->subject) {
            return '< '.($relatedId ?? '-').' >';
        }

        $activity->subject->loadMissing($relationName);

        $record = null;

        $relationCollection = $activity->subject->getRelation($relationName);

        if ($relationCollection instanceof Collection) {
            $record = $relationCollection->firstWhere('id', $relatedId);
        } elseif ($relationCollection instanceof Model) {
            if ($relationCollection->getKey() == $relatedId) {
                $record = $relationCollection;
            }
        }

        if ($record) {
            $recordTitleAttribute = $this->getRelationTitleAttribute($record);

            $titleValue = $record->getAttribute($recordTitleAttribute);

            if ($titleValue) {
                return "< {$titleValue} >";
            }
        }

        return '< '.($relatedId ?? '-').' >';
    }
}
