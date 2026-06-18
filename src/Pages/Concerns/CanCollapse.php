<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

trait CanCollapse
{
    protected bool $isCollapsible = false;

    protected bool $isCollapsed = true;

    protected bool $isLazy = false;
}
