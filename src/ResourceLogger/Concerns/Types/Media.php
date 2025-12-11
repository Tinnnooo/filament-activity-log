<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Concerns\Types;

use Illuminate\Database\Eloquent\Model;
use Illuminate\View\ComponentAttributeBag;
use Noin\FilamentActivityLog\ResourceLogger\Field;

trait Media
{
    public string $rounded = 'circle';

    public bool $gallery = false;

    public function media(?bool $gallery = false): static
    {
        $this->type('media');
        $this->template('image');
        $this->gallery = (bool) $gallery;
        $this->{$gallery ? 'hasMany' : 'hasOne'}('media');

        if ($gallery) {
            $this->square();
        }

        $this->resolveStateUsing(function (Model $record): mixed {
            $relation = data_get($record, $this->name);

            if ($this->gallery) {
                return $relation->pluck('original_url')->toArray();
            }

            return $relation[0]['original_url'] ?? null;
        });

        return $this;
    }

    public function circle(): static
    {
        $this->rounded = 'circle';

        return $this;
    }

    public function square(): static
    {
        $this->rounded = 'square';

        return $this;
    }

    public function displayImage(mixed $value, Field $field): string
    {
        ob_start(); ?>
        <div class="flex flex-wrap gap-2">
            <?php foreach ((array) $value as $_value) { ?>
                <img
                    src="<?= $_value ?>"
                    <?= (new ComponentAttributeBag)->class([
                        'fi-avatar',
                        'fi-size-lg',
                        $field->rounded === 'circle' ? 'fi-rounded-full' : 'fi-rounded-md',
                    ]) ?>>
            <?php } ?>
        </div>
<?php return ob_get_clean();
    }
}
