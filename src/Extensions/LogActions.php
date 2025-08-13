<?php

namespace Noxo\FilamentActivityLog\Extensions;

use Noxo\FilamentActivityLog\Extensions\Concerns\HasAssociations;
use Noxo\FilamentActivityLog\Extensions\Concerns\HasCreated;
use Noxo\FilamentActivityLog\Extensions\Concerns\HasDeleted;
use Noxo\FilamentActivityLog\Extensions\Concerns\HasRestored;
use Noxo\FilamentActivityLog\Extensions\Concerns\HasUpdated;
use Filament\Actions\AttachAction;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\ReplicateAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\CheckboxColumn;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextInputColumn;
use Filament\Tables\Columns\ToggleColumn;
use Closure;
use Filament\Actions as PageActions;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Actions as TableActions;
use Filament\Tables\Columns;

class LogActions
{
    use HasAssociations;
    use HasCreated;
    use HasDeleted;
    use HasRestored;
    use HasUpdated;

    public array $targets = [
        // * ----------- Table Actions -----------
        // TableActions\AssociateAction::class => 'associate',
        AttachAction::class => 'attach',
        CreateAction::class => 'create',
        DeleteAction::class => 'delete',
        DeleteBulkAction::class => 'deleteBulk',
        DetachAction::class => 'detach',
        DetachBulkAction::class => 'detachBulk',
        // TableActions\DissociateAction::class => 'dissociate',
        // TableActions\DissociateBulkAction::class => 'dissociateBulk',
        EditAction::class => 'edit',
        ForceDeleteAction::class => 'delete',
        ForceDeleteBulkAction::class => 'deleteBulk',
        ReplicateAction::class => 'create',
        RestoreAction::class => 'restore',
        RestoreBulkAction::class => 'restoreBulk',

        // * ----------- Page Actions -----------
        PageActions\CreateAction::class => 'create',
        PageActions\DeleteAction::class => 'delete',
        PageActions\EditAction::class => 'edit',
        PageActions\ForceDeleteAction::class => 'delete',
        PageActions\ReplicateAction::class => 'create',
        PageActions\RestoreAction::class => 'restore',

        // * ----------- Editable Columns -----------
        CheckboxColumn::class => 'editableColumn',
        SelectColumn::class => 'editableColumn',
        TextInputColumn::class => 'editableColumn',
        ToggleColumn::class => 'editableColumn',
    ];

    public function configure(): void
    {
        foreach ($this->targets as $class => $action) {
            $class::configureUsing(Closure::fromCallable([$this, $action]));
        }
    }

    public function attach($action): void
    {
        $action->after(function ($livewire, $record): void {
            $this->logAttach($livewire, $record);
        });
    }

    public function detach($action): void
    {
        $action->after(function ($livewire, $record): void {
            $this->logDetach($livewire, $record);
        });
    }

    public function detachBulk($action): void
    {
        $action->after(function ($livewire, $records): void {
            $records->map(fn ($record) => $this->logDetach($livewire, $record));
        });
    }

    public function editableColumn($column): void
    {
        $column->beforeStateUpdated(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerBefore($livewire, $record)
                : $this->logRecordBefore($record);
        });

        $column->afterStateUpdated(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerAfter($livewire, $record)
                : $this->logRecordAfter($record);
        });
    }

    public function create($action): void
    {
        $action->after(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerCreated($livewire, $record)
                : $this->logRecordCreated($record);
        });
    }

    public function delete($action): void
    {
        $action->before(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerDeleted($livewire, $record)
                : $this->logRecordDeleted($record);
        });
    }

    public function deleteBulk($action): void
    {
        $action->before(function ($livewire, $records): void {
            $livewire instanceof RelationManager
                ? $records->map(fn ($record) => $this->logManagerDeleted($livewire, $record))
                : $records->map(fn ($record) => $this->logRecordDeleted($record));
        });
    }

    public function edit($action): void
    {
        $action->beforeFormValidated(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerBefore($livewire, $record)
                : $this->logRecordBefore($record);
        });

        $action->after(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerAfter($livewire, $record)
                : $this->logRecordAfter($record);
        });
    }

    public function restore($action): void
    {
        $action->after(function ($livewire, $record): void {
            $livewire instanceof RelationManager
                ? $this->logManagerRestored($livewire, $record)
                : $this->logRecordRestored($record);
        });
    }

    public function restoreBulk($action): void
    {
        $action->after(function ($livewire, $records): void {
            $livewire instanceof RelationManager
                ? $records->map(fn ($record) => $this->logManagerRestored($livewire, $record))
                : $records->map(fn ($record) => $this->logRecordRestored($record));
        });
    }
}
