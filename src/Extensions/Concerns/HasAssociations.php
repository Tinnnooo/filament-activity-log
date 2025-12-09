<?php

namespace Noin\FilamentActivityLog\Extensions\Concerns;

use Noin\FilamentActivityLog\Services\Helper;

trait HasAssociations
{
    public function logAttach($livewire, $record): void
    {
        $ownerRecord = $livewire->ownerRecord;
        if (! $logger = Helper::resolveLogger($ownerRecord)) {
            return;
        }

        $manager = $logger::getRelationManager(
            get_class($livewire)::getRelationshipName()
        );

        if ($manager) {
            $record->load($manager->getRelationNames());

            $logger::make($record)
                ->relationManager($manager)
                ->ownerRecord($ownerRecord)
                ->attached();
        }
    }

    public function logDetach($livewire, $record): void
    {
        $ownerRecord = $livewire->ownerRecord;
        if (! $logger = Helper::resolveLogger($ownerRecord)) {
            return;
        }

        $manager = $logger::getRelationManager(
            get_class($livewire)::getRelationshipName()
        );

        if ($manager) {
            $record->load($manager->getRelationNames());

            $logger::make($record)
                ->relationManager($manager)
                ->ownerRecord($ownerRecord)
                ->detached();
        }
    }
}
