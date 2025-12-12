<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

use Carbon\Carbon;
use Exception;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Blade;
use Malzariey\FilamentDaterangepickerFilter\Fields\DateRangePicker;
use Noin\FilamentActivityLog\Loggers\Loggers;
use Spatie\Activitylog\Models\Activity;

trait HasListFilters
{
    public ?string $date_range = null;

    public ?string $causer = null;

    public ?string $subject_type = null;

    public ?string $subject_id = null;

    public ?string $event = null;

    protected $queryString = [
        'date_range' => ['except' => null],
        'causer' => ['except' => null],
        'subject_type' => ['except' => null],
        'subject_id' => ['except' => null],
        'event' => ['except' => null],
    ];

    public function updated($property): void
    {
        $pageName = $this->getTablePaginationPageName();

        if ($property !== $pageName) {
            $this->resetPage($pageName);
        }
    }

    public function resetFiltersForm(): void
    {
        $this->form->fill();

        $this->resetPage($this->getTablePaginationPageName());
    }

    public function getFilters(): array
    {
        return [
            'date_range' => $this->date_range,
            'causer' => $this->causer,
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'event' => $this->event,
        ];
    }

    public function hasActiveFilters(): bool
    {
        return count(array_filter($this->getFilters())) > 0;
    }

    public function fillFilters(): void
    {
        $values = request()->only(
            array_keys($this->getFilters()),
        );

        $this->form->fill(
            collect($values)
                ->filter(fn ($value) => ! empty($value) && $value !== 'null')
                ->toArray()
        );
    }

    public function applyFilters(Builder $query): Builder
    {
        $state = $this->form->getState();
        $causer = with($state['causer'], function ($causer) {
            if (empty($causer) || ! str_contains($causer, ':')) {
                return null;
            }

            $parts = explode(':', $causer);
            if (count($parts) !== 2) {
                return null;
            }

            [$causer_type, $causer_id] = $parts;

            return compact('causer_type', 'causer_id');
        });

        $query
            ->when(
                $date_range = $this->getDateRange($state['date_range'] ?? null),
                fn (Builder $query) => $query->whereBetween('created_at', $date_range)
            )
            ->unless(
                empty($causer),
                fn (Builder $query) => $query->where($causer)
            )
            ->unless(
                empty($state['subject_type']),
                fn (Builder $query) => $query->where('subject_type', $state['subject_type'])
            )
            ->unless(
                empty($state['subject_id']),
                fn (Builder $query) => $query->where('subject_id', $state['subject_id'])
            )
            ->unless(
                empty($state['event']),
                fn (Builder $query) => $query->where('event', $state['event'])
            );

        return $query;
    }

    protected function getDateRange(?string $date_range): ?array
    {
        if (filled($date_range)) {
            try {
                [$from, $to] = explode(' - ', $date_range);
                $from = Carbon::createFromFormat('d/m/Y', $from)->startOfDay();
                $to = Carbon::createFromFormat('d/m/Y', $to)->endOfDay();

                return compact('from', 'to');
            } catch (Exception $e) {
            }
        }

        return null;
    }

    protected function getDateRangeField()
    {
        return DateRangePicker::make('date_range')
            ->useRangeLabels()
            ->alwaysShowCalendar(false)
            ->label(__('filament-activity-log::activities.filters.date'))
            ->placeholder(__('filament-activity-log::activities.filters.date'));
    }

    protected function getCauserField()
    {
        return Select::make('causer')
            ->label(__('filament-activity-log::activities.filters.causer'))
            ->native(false)
            ->allowHtml()
            ->options(function () {
                $causers = Activity::query()
                    ->with('causer')
                    ->groupBy('causer_id', 'causer_type')
                    ->get(['causer_id', 'causer_type'])
                    ->filter(fn ($activity) => $activity->causer instanceof Model)
                    ->map(fn ($activity) => [
                        'value' => "{$activity->causer_type}:{$activity->causer_id}",
                        'label' => Blade::render(
                            '<x-filament::avatar
                                src="' . filament()->getUserAvatarUrl($activity->causer) . '"
                                size="sm"
                                class="inline mr-2"
                            /> ' . $activity->causer?->name
                        ),
                    ])
                    ->pluck('label', 'value');

                return $causers;
            });
    }

    protected function getSubjectTypeField()
    {
        return Select::make('subject_type')
            ->label(__('filament-activity-log::activities.filters.subject_type'))
            ->allowHtml()
            ->native(false)
            ->options(
                array_column(
                    array_map(fn ($logger) => [
                        'value' => Relation::getMorphAlias($logger::$model) ?? $logger::$model,
                        'label' => $logger::getLabel(),
                    ], Loggers::$loggers),
                    'label',
                    'value',
                )
            );
    }

    /**
     * @deprecated Use getSubjectKeyField() instead. This method will be removed in a future version.
     */
    protected function getSubjectIDField()
    {
        return TextInput::make('subject_id')
            ->label(__('filament-activity-log::activities.filters.subject_id'))
            ->visible(fn (callable $get) => $get('subject_type'))
            ->numeric();
    }

    protected function getSubjectKeyField(): Select
    {
        return Select::make('subject_id')
            ->label('Subject key')
            ->searchable()
            ->visible(fn (callable $get): bool => (bool) $get('subject_type'))
            ->optionsLimit(10)
            ->options(function (callable $get) {
                $subjectType = $get('subject_type');

                if (empty($subjectType)) {
                    return [];
                }

                $logger = new (Loggers::getLoggerByModel($subjectType));

                $label = (method_exists($logger, 'getRecordTitleAttribute') ? $logger->getRecordTitleAttribute() : 'id');

                return $subjectType::select(
                    [
                        'id',
                        $label,
                    ]
                )
                    ->whereNotNull($label)
                    ->latest()
                    ->limit(10)
                    ->pluck($label, 'id')
                    ->toArray();
            })
            ->getSearchResultsUsing(function (?string $search, callable $get) {
                $subjectType = $get('subject_type');

                if (empty($subjectType)) {
                    return [];
                }

                $logger = new (Loggers::getLoggerByModel($subjectType));

                $label = (method_exists($logger, 'getRecordTitleAttribute') ? $logger->getRecordTitleAttribute() : 'id');

                return $subjectType::select(
                    [
                        'id',
                        $label,
                    ]
                )
                    ->whereNotNull($label)
                    ->when(
                        $search,
                        fn (Builder $query, string $search) => $query->where($label, 'like', "%{$search}%")
                    )
                    ->latest()
                    ->limit(10)
                    ->pluck($label, 'id')
                    ->toArray();
            })
            ->getOptionLabelUsing(function (?string $value, callable $get) {
                if (! $value) {
                    return null;
                }

                $subjectType = $get('subject_type');

                if (empty($subjectType)) {
                    return null;
                }

                $logger = new (Loggers::getLoggerByModel($subjectType));

                $label = (method_exists($logger, 'getRecordTitleAttribute') ? $logger->getRecordTitleAttribute() : 'id');

                return $subjectType::find($value)?->{$label};
            });
    }

    protected function getEventField()
    {
        return Select::make('event')
            ->label(__('filament-activity-log::activities.filters.event'))
            ->visible(fn (callable $get) => $get('subject_type'))
            ->native(false)
            ->options(function (callable $get) {
                $events = Activity::query()
                    ->where('subject_type', $get('subject_type'))
                    ->groupBy('event')
                    ->pluck('event')
                    ->map(fn ($event) => [
                        'value' => $event,
                        'label' => __("filament-activity-log::activities.events.{$event}.title"),
                    ])
                    ->pluck('label', 'value');

                return $events;
            });
    }
}
