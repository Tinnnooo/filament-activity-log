<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

trait CanRefreshPage
{
    public function refreshPage(): void
    {
        $this->dispatch('refresh-page');
    }
}
