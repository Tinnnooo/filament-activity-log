<?php

namespace Noin\FilamentActivityLog\ResourceLogger\Concerns;

use Illuminate\Support\Str;
use Noin\FilamentActivityLog\ResourceLogger\Field;

trait CanDisplay
{
    public function display(mixed $value, bool $raw = false): mixed
    {
        if ($this->formatStateCallback) {
            $value = call_user_func($this->formatStateCallback, $value);
        }

        if ($raw) {
            return $value;
        }

        $template = is_null($value) ? 'default' : $this->template;
        if ($this->view) {
            return view($this->view, ['value' => $value, 'field' => $this]);
        }

        return $this->renderTemplate($template, ['value' => $value, 'field' => $this]);
    }

    public function renderTemplate(string $template, array $data = []): string
    {
        return $this->{'display'.ucfirst(Str::camel($template))}(...$data);
    }

    public function displayDefault(mixed $value, Field $field): string
    {
        $isHtmlAllowed = $field->isHtmlAllowed();

        ob_start(); ?>

        <?php if (is_array($value)) { ?>
            <pre class="text-xs text-gray-500">
                <?php if ($isHtmlAllowed) { ?>
                    <?= json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
                <?php } else { ?>
                    <?= e(json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)); ?>
                <?php } ?>
            </pre>
        <?php } else { ?>
            <?php if ($isHtmlAllowed) { ?>
                <?= $value; ?>
            <?php } else { ?>
                <?= e($value); ?>
            <?php } ?>
        <?php } ?>

<?php return ob_get_clean();
    }
}
