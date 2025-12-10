<?php

namespace Noin\FilamentActivityLog\Pages;

use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Livewire\WithPagination;
use Noin\FilamentActivityLog\Pages\Concerns\CanCollapse;
use Noin\FilamentActivityLog\Pages\Concerns\CanPaginateRecords;
use Noin\FilamentActivityLog\Pages\Concerns\HasListFilters;
use Noin\FilamentActivityLog\Pages\Concerns\HasLogger;
use Noin\FilamentActivityLog\Pages\Concerns\HasTimezone;
use Noin\FilamentActivityLog\Pages\Concerns\UrlHandling;
use Spatie\Activitylog\Models\Activity;

abstract class ListActivities extends Page implements HasSchemas
{
    use CanCollapse;
    use CanPaginateRecords;
    use HasListFilters;
    use HasLogger;
    use HasTimezone;
    use InteractsWithSchemas;
    use UrlHandling;
    use WithPagination;

    protected string $view = 'filament-activity-log::list.index';

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::FingerPrint;

    public function getTitle(): string
    {
        return __('filament-activity-log::activities.title');
    }

    public static function getNavigationLabel(): string
    {
        return __('filament-activity-log::activities.title');
    }

    public function mount(): void
    {
        $this->fillFilters();
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->compact()
                    ->columns(5)
                    ->schema([
                        $this->getDateRangeField(),
                        $this->getCauserField(),
                        $this->getSubjectTypeField(),
                        $this->getSubjectKeyField(),
                        $this->getEventField(),
                    ]),
            ])
            ->debounce();
    }

    public function getActivities()
    {
        $activityModel = config('activitylog.activity_model') ?? Activity::class;

        return $this->paginateTableQuery(
            $this->applyFilters($activityModel::with('causer', 'subject')->latest())
        );
    }

    protected function getDefaultTableRecordsPerPageSelectOption(): int
    {
        return 10;
    }

    protected function getTableRecordsPerPageSelectOptions(): array
    {
        return [10, 25, 50];
    }
}
