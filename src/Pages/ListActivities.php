<?php

namespace Noxo\FilamentActivityLog\Pages;

use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Livewire\WithPagination;
use Noxo\FilamentActivityLog\Pages\Concerns\CanCollapse;
use Noxo\FilamentActivityLog\Pages\Concerns\CanPaginateRecords;
use Noxo\FilamentActivityLog\Pages\Concerns\HasListFilters;
use Noxo\FilamentActivityLog\Pages\Concerns\HasLogger;
use Noxo\FilamentActivityLog\Pages\Concerns\HasTimezone;
use Noxo\FilamentActivityLog\Pages\Concerns\UrlHandling;
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

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-s-finger-print';

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
                        $this->getSubjectIDField(),
                        $this->getEventField(),
                    ]),
            ])
            ->debounce();
    }

    public function getActivities()
    {
        $activityModel = config('activitylog.activity_model') ?? Activity::class;

        return $this->paginateTableQuery(
            $this->applyFilters($activityModel::with('causer')->latest())
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
