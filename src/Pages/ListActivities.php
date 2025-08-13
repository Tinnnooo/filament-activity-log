<?php

namespace Noxo\FilamentActivityLog\Pages;

use BackedEnum;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Filament\Tables\Concerns\CanPaginateRecords;
use Livewire\WithPagination;
use Spatie\Activitylog\Models\Activity;

abstract class ListActivities extends Page implements HasForms
{
    use CanPaginateRecords;
    use Concerns\CanCollapse;
    use Concerns\HasListFilters;
    use Concerns\HasLogger;
    use Concerns\UrlHandling;
    use InteractsWithForms;
    use WithPagination;

    protected string $view = 'filament-activity-log::list.index';

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-s-finger-print';

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

    protected function getIdentifiedTableQueryStringPropertyNameFor(string $property): string
    {
        return $property;
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
