<?php

namespace Noin\FilamentActivityLog\Pages;

use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Livewire\WithPagination;
use Noin\FilamentActivityLog\Pages\Concerns\CanCollapse;
use Noin\FilamentActivityLog\Pages\Concerns\CanPaginateRecords;
use Noin\FilamentActivityLog\Pages\Concerns\CanRefreshPage;
use Noin\FilamentActivityLog\Pages\Concerns\HasEmbedContent;
use Noin\FilamentActivityLog\Pages\Concerns\HasListFilters;
use Noin\FilamentActivityLog\Pages\Concerns\HasLogger;
use Noin\FilamentActivityLog\Pages\Concerns\HasRecords;
use Noin\FilamentActivityLog\Pages\Concerns\HasTimezone;
use Noin\FilamentActivityLog\Pages\Concerns\UrlHandling;
use Spatie\Activitylog\Models\Activity;

abstract class ListActivities extends Page implements HasSchemas
{
    use CanCollapse;
    use CanPaginateRecords;
    use CanRefreshPage;
    use HasEmbedContent;
    use HasListFilters;
    use HasLogger;
    use HasRecords;
    use HasTimezone;
    use InteractsWithSchemas;
    use UrlHandling;
    use WithPagination;

    protected string $view = 'filament-activity-log::pages.activities';

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::FingerPrint;

    public function getTitle(): string
    {
        return __('filament-activity-log::activities.title');
    }

    public static function getNavigationLabel(): string
    {
        return __('filament-activity-log::activities.title');
    }

    public bool $withNullCauser = true;

    public string $emptyHeaderName = 'Unknown';

    public int $pollingInterval = 30;

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

    public function getActivities(): CursorPaginator | Paginator
    {
        $activityModel = config('activitylog.activity_model') ?? Activity::class;

        $query = $activityModel::with('causer', 'subject')->latest();

        if ($this->isLazy) {
            $model = new $activityModel;
            $columns = $model->getConnection()->getSchemaBuilder()->getColumnListing($model->getTable());
            $columns = array_values(array_filter($columns, fn(string $column): bool => $column !== 'properties'));

            if (! empty($columns)) {
                $query->select($columns);
            }
        }

        $paginator = $this->paginateTableQuery(
            $this->applyFilters($query)
        );

        $this->records($paginator->items());

        return $paginator;
    }
}
