<?php

namespace Noin\FilamentActivityLog\Loggers\Concerns;

trait HasLimit
{
    protected int $limit = 50;

    public function getLimit(): int
    {
        return $this->limit;
    }
}
