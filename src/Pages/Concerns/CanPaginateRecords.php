<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;

trait CanPaginateRecords
{
    /**
     * @var int | string | null
     */
    public $tableRecordsPerPage = null;

    protected int | string | null $defaultTableRecordsPerPageSelectOption = null;

    public function updatedTableRecordsPerPage(): void
    {
        session()->put([
            $this->getTablePerPageSessionKey() => $this->getTableRecordsPerPage(),
        ]);

        $this->resetPage();
    }

    protected function paginateTableQuery(Builder $query): Paginator | CursorPaginator
    {
        $perPage = $this->getTableRecordsPerPage() ?? $this->getDefaultTableRecordsPerPageSelectOption();

        $total = $query
            ->toBase()
            ->getCountForPagination();

        /** @var LengthAwarePaginator $records */
        $records = $query->paginate(
            perPage: ($perPage === 'all') ? $total : $perPage,
            pageName: $this->getTablePaginationPageName(),
            total: $total
        );

        return $records->onEachSide(0);
    }

    public function getTableRecordsPerPage(): int | string | null
    {
        return $this->tableRecordsPerPage;
    }

    public function getTablePaginationPageName(): string
    {
        return $this->getIdentifiedTableQueryStringPropertyNameFor('page');
    }

    protected function getIdentifiedTableQueryStringPropertyNameFor(string $property): string
    {
        return $property;
    }

    protected function getDefaultTableRecordsPerPageSelectOption(): int
    {
        $option = session()->get(
            $this->getTablePerPageSessionKey(),
            $this->defaultTableRecordsPerPageSelectOption ?? 10,
        );
        dd($option);

        $pageOptions = $this->getTableRecordsPerPageSelectOptions();

        if (in_array($option, $pageOptions)) {
            return $option;
        }
        session()->remove($this->getTablePerPageSessionKey());

        return $pageOptions[0];
    }

    protected function getTableRecordsPerPageSelectOptions(): array
    {
        return [10, 25, 50, 'all'];
    }

    public function getTablePerPageSessionKey(): string
    {
        $page = md5($this::class);

        return "activities.{$page}_per_page";
    }
}
