<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

use Carbon\Carbon;
use Exception;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;
use Illuminate\View\ComponentAttributeBag;
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
            ->disableClear(false)
            ->label(__('filament-activity-log::activities.filters.date'))
            ->placeholder(__('filament-activity-log::activities.filters.date'));
    }

    protected function getCauserField()
    {
        return Select::make('causer')
            ->label(__('filament-activity-log::activities.filters.causer'))
            ->native(false)
            ->allowHtml()
            ->searchable()
            ->optionsLimit(10)
            ->options(fn () => $this->getCauserOptions())
            ->getSearchResultsUsing(fn (?string $search) => $this->getCauserOptions($search))
            ->getOptionLabelUsing(fn (?string $value): ?string => $this->getCauserOptionLabel($value));
    }

    protected function getSubjectTypeField()
    {
        return Select::make('subject_type')
            ->label(__('filament-activity-log::activities.filters.subject_type'))
            ->allowHtml()
            ->native(false)
            ->serachable()
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
            ->searchable()
            ->options(function (callable $get) {
                $activityModel = config('activitylog.activity_model') ?? Activity::class;

                $events = $activityModel::query()
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

    protected function getAvatarOptionsHtml(?Model $user): string
    {
        $src = filament()->getUserAvatarUrl($user);
        $alt = __('filament-activity-log::activities.filters.causer_avatar_alt', ['name' => $user?->name ?? '']);
        ob_start(); ?>
        <img
            src="<?= $src ?>"
            alt="<?= $alt ?>"
            loading="lazy"
            <?= (new ComponentAttributeBag)
                ->class([
                    'fi-avatar',
                    'fi-circular',
                    'fi-size-sm',
                    'inline mr-2',
                ])
                ->toHtml() ?> />
        <?= $user->name ?? '-' ?>
<?php return ob_get_clean();
    }

    protected function getCauserOptions(?string $search = null): Collection
    {
        $activityModel = config('activitylog.activity_model') ?? Activity::class;

        return $activityModel::query()
            ->select('causer_id', 'causer_type')
            ->whereNotNull('causer_id')
            ->with('causer')
            ->groupBy('causer_id', 'causer_type')
            ->when(
                $search,
                fn (Builder $query) => $query->whereHas(
                    'causer',
                    fn (Builder $query) => $query->where('name', 'like', "%{$search}%")
                )
            )
            ->limit(10)
            ->get(['causer_id', 'causer_type'])
            ->map(fn ($activity) => [
                'value' => "{$activity->causer_type}:{$activity->causer_id}",
                'label' => $this->getAvatarOptionsHtml($activity->causer),
            ])
            ->pluck('label', 'value');
    }

    protected function getCauserOptionLabel(?string $value): ?string
    {
        if (empty($value) || ! str_contains($value, ':')) {
            return null;
        }

        [$causer_type, $causer_id] = explode(':', $value);

        $activityModel = config('activitylog.activity_model') ?? Activity::class;

        $activity = $activityModel::query()
            ->where('causer_type', $causer_type)
            ->where('causer_id', $causer_id)
            ->with('causer')
            ->first();

        if (! $activity) {
            return null;
        }

        return $this->getAvatarOptionsHtml($activity->causer);
    }
}
