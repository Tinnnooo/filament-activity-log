<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Concerns\Types;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\View\Concerns\CanGenerateBadgeHtml;
use Illuminate\View\ComponentAttributeBag;
use Noin\FilamentActivityLog\ResourceLogger\Field;
use UnitEnum;

trait Badge
{
    use CanGenerateBadgeHtml;

    public string $badgeColor = 'primary';

    public function badge(?string $color = null): static
    {
        $this->template('badge');
        if ($color) {
            $this->badgeColor = $color;
        }

        return $this;
    }

    public function displayBadge(UnitEnum | array | string $value, Field $field): string
    {
        ob_start(); ?>
        <div class="flex flex-wrap gap-2">
            <?php if (is_array($value)) { ?>
                <?php foreach ($value as $label) { ?>
                    <?= $this->generateBadgeHtml(
                        attributes: (new ComponentAttributeBag)
                            ->class([
                                'w-fit',
                            ]),
                        color: $field->badgeColor,
                        tooltip: $label,
                        label: $label,
                    ) ?>
                <?php } ?>
            <?php } elseif ($field->is('enum')) { ?>
                <?php
                $label = $value instanceof HasLabel ? $value->getLabel() : $value;
                $color = $value instanceof HasColor ? $value->getColor() : $field->badgeColor;
                $icon = $value instanceof HasIcon ? $value->getIcon() : null;
                ?>

                <?= $this->generateBadgeHtml(
                    attributes: (new ComponentAttributeBag)
                        ->class([
                            'w-fit',
                        ]),
                    color: $color,
                    icon: $icon,
                    tooltip: $label,
                    label: $label
                ) ?>
            <?php } else { ?>
                <?= $this->generateBadgeHtml(
                    attributes: (new ComponentAttributeBag)
                        ->class([
                            'w-fit',
                        ]),
                    color: $field->badgeColor,
                    tooltip: $value,
                    label: $value
                ) ?>
            <?php } ?>
        </div>
<?php return ob_get_clean();
    }
}
