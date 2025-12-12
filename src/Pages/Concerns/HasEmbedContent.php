<?php

namespace Noin\FilamentActivityLog\Pages\Concerns;

use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Support\View\Components\BadgeComponent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\View\ComponentAttributeBag;
use Noin\FilamentActivityLog\Loggers\Logger;
use Noin\FilamentActivityLog\Services\Helper;
use Noin\FilamentActivityLog\Services\TableHelper;

use function Filament\Support\generate_icon_html;

trait HasEmbedContent
{
    public function contentHtml(): string
    {
        $prevDate = null;

        ob_start(); ?>
        <?php if (count($this->records) > 0) { ?>
            <?php foreach ($this->records as $record) { ?>
                <?php
                $date = $record->created_at->setTimezone($this->getTimezone())->translatedFormat(__('filament-activity-log::activities.date_format'));

                $logger = $this->getLogger($record);

                if (! $logger) {
                    continue;
                }
                ?>

                <?php if ($date !== $prevDate) { ?>
                    <div <?= (new ComponentAttributeBag)
                    ->class([
                        'px-4 py-2 w-54 mx-auto text-center',
                        'shadow-md rounded-full',
                        'bg-white text-gray-600 text-sm font-medium',
                        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
                        'sticky top-20 z-10',
                        'ring-1 ring-gray-200 dark:ring-gray-700',
                    ])->toHtml() ?>>
                        <?= $date ?>
                    </div>
                    <?php
                    $prevDate = $date;
                    ?>
                <?php } ?>

                <?= $this->getItemHtml(
                    record: $record,
                    logger: $logger,
                ) ?>

            <?php } ?>
        <?php } else { ?>
            <div class="p-4 text-center bg-white rounded-xl shadow dark:border-gray-600 dark:bg-gray-800 text-gray-500 z-50">
                <?= __('filament-activity-log::activities.table.no_records_yet') ?>
            </div>
        <?php } ?>
    <?php return ob_get_clean();
    }

    public function getItemHtml(Model $record, Logger $logger): string
    {
        ob_start(); ?>
        <!-- Item -->

        <?php
        $isCollapsed = $this->isCollapsible && $this->isCollapsed ? 'true' : 'false';
        $itemAttributes = (new ComponentAttributeBag)
            ->class([
                'p-2 bg-white rounded-xl shadow group',
                'dark:border-gray-600 dark:bg-gray-900',
            ])
            ->merge([
                'x-data' => "{ isCollapsed: $isCollapsed }",
                '@collapse-all.window' => '() => { isCollapsed = true }',
                '@expand-all.window' => '() => { isCollapsed = false }',
            ]);
        ?>
        <div
            <?= $itemAttributes
                ->toHtml() ?>>

            <?php

            // Changes state
            $changes = $record->getChangesAttribute();
        $attributes = (array) ($changes['attributes'] ?? []);
        $old = (array) ($changes['old'] ?? []);
        $hasChanges = ! empty($attributes);
        $hasOld = ! empty($old);

        // Inline state
        $isInlineSingle = count($attributes) === 1;
        $inlineField = $hasOld && $isInlineSingle ? Helper::resolveInlineField($logger, $attributes, $old) : null;

        // Description state
        $shouldShowDescription = $logger->shouldShowDescription($record);
        ?>

            <?= $this->getHeaderHtml(
                hasChanges: $hasChanges,
                record: $record,
                inlineField: $inlineField,
                logger: $logger,
            ) ?>

            <?= $this->getDescriptionHtml(
                record: $record,
                shouldShowDescription: $shouldShowDescription,
            ) ?>

            <?php if (empty($inlineField) && $hasChanges) { ?>
                <?= TableHelper::getTableTemplateHtml(
                    hasOld: $hasOld,
                    changes: $changes,
                    logger: $logger,
                ) ?>
            <?php } ?>

        </div>
    <?php return ob_get_clean();
    }

    public function getHeaderHtml(
        bool $hasChanges,
        Model $record,
        ?array $inlineField,
        Logger $logger
    ): string {

        // Relation Manager
        $showRelationManager = false;

        if ($logger->relationManager) {
            $relationManagerRoute = $logger->getRelationManagerRoute($record);
            $relationManagerLabel = $logger->getRelationManagerLabel();
            $relationManagerAttribute = $logger->getRelationManagerAttribute($record);
            $relationManagerId = $logger->getRelationManagerId($record);
            $showRelationManager = $relationManagerLabel || $relationManagerAttribute;
        }

        // Subject
        $subjectRoute = $logger->getSubjectRoute($record);
        $subjectLabel = $logger->getSubjectLabel();
        $subjectAttribute = $logger->getSubjectAttribute($record);
        $subjectId = $logger->getSubjectId($record);
        $showSubject = $subjectLabel || $subjectAttribute;

        ob_start(); ?>
        <!-- Header -->
        <div
            <?= (new ComponentAttributeBag)
                ->class([
                    'flex justify-between items-center flex-wrap gap-2',
                    'cursor-pointer' => $hasChanges && $this->isCollapsible,
                ])
                ->toHtml() ?>
            <?php if ($hasChanges && $this->isCollapsible) { ?>
            @click="isCollapsed = !isCollapsed"
            <?php } ?>>

            <!-- Sub Head -->
            <div class="flex items-center gap-x-2">
                <?php if ($record->causer) { ?>
                    <?= $this->getAvatarHtml(
                        user: $record->causer
                    ) ?>
                <?php } ?>

                <div class="flex flex-col text-left">
                    <span class="font-semibold dark:text-gray-300">
                        <?= $record->causer?->name ?? $this->emptyHeaderName ?>
                    </span>
                    <span class="text-xs text-gray-700 dark:text-gray-200">
                        <?= $record
                            ->created_at
                            ->setTimezone($this->getTimezone())
                            ->translatedFormat(__('filament-activity-log::activities.time_format')) ?>
                    </span>
                </div>
            </div>

            <!-- Inline Field Display -->
            <?= $this->getInlineFieldHtml($inlineField) ?>

            <div class="self-end flex items-center gap-2">
                <!-- Subject & Relation Label -->
                <?= $this->getHeaderLabel(
                    record: $record,
                    showRelationManager: $showRelationManager,
                    relationManagerRoute: $relationManagerRoute ?? null,
                    relationManagerLabel: $relationManagerLabel ?? null,
                    relationManagerAttribute: $relationManagerAttribute ?? null,
                    relationManagerId: $relationManagerId ?? null,
                    showSubject: $showSubject,
                    subjectRoute: $subjectRoute ?? null,
                    subjectLabel: $subjectLabel ?? null,
                    subjectAttribute: $subjectAttribute ?? null,
                    subjectId: $subjectId ?? null,
                ) ?>

                <!-- Chevron Icon -->
                <?php if ($hasChanges && $this->isCollapsible) { ?>
                    <?= generate_icon_html(
                        icon: Heroicon::ChevronUp,
                        attributes: (new ComponentAttributeBag)
                            ->class([
                                'w-6 h-6 text-gray-500 transition dark:text-gray-400',
                            ])
                            ->merge([
                                'x-bind:class' => "{ '-rotate-180': !isCollapsed }",
                            ])
                    )
                    ->toHtml() ?>
                <?php } ?>
            </div>
        </div>
    <?php return ob_get_clean();
    }

    public function getInlineFieldHtml(?array $inlineField): string
    {
        ob_start(); ?>

        <?php if ($inlineField) { ?>
            <?php
            [$field, $oldValue, $newValue] = $inlineField;
            ?>
            <div class="flex items-center gap-8 border p-2 rounded-md dark:border-white/10 opacity-70 transition group-hover:opacity-10">
                <div><?= $field->display($oldValue) ?></div>
                <div class="dark:text-white/70"><?= $field->getLabel() ?></div>
                <div><?= $field->display($newValue) ?></div>
            </div>
        <?php } ?>

    <?php return ob_get_clean();
    }

    public function getHeaderLabel(
        Model $record,
        bool $showRelationManager,
        ?string $relationManagerRoute,
        ?string $relationManagerLabel,
        ?string $relationManagerAttribute,
        ?string $relationManagerId,
        bool $showSubject,
        ?string $subjectRoute,
        ?string $subjectLabel,
        ?string $subjectAttribute,
        ?string $subjectId,
    ): string {
        ob_start(); ?>
        <div class="flex gap-2">
            <span
                <?= (new ComponentAttributeBag)
                    ->class([
                        'py-2 px-4 rounded-full text-xs',
                        'flex items-center',
                        'opacity-70 transition group-hover:opacity-100',
                        'fi-badge',
                    ])
                    ->color(BadgeComponent::class, Helper::getEventStyle($record->event))
                    ->toHtml() ?>>
                <?= __('filament-activity-log::activities.events.' . $record->event . '.description') ?>
            </span>

            <?php if ($showRelationManager) { ?>
                <a
                    <?php if ($relationManagerRoute) { ?>
                    href="<?= $relationManagerRoute ?>"
                    <?php } ?>

                    <?= (new ComponentAttributeBag)
                        ->class([
                            'flex items-center gap-1 p-2 rounded-lg',
                            'text-xs text-gray-700 bg-gray-100 font-medium',
                            'opacity-70 transition group-hover:opacity-100',
                            'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300',
                        ])
                        ->merge([
                            'x-tooltip' => "{ content: '$relationManagerId' }",
                        ])
                        ->toHtml() ?>>
                    <span><?= $relationManagerLabel ?></span>
                    <span><?= $relationManagerAttribute ?></span>
                </a>
            <?php } ?>

            <?php if ($showSubject) { ?>
                <a
                    <?php if ($subjectRoute) { ?>
                    href="<?= $subjectRoute ?>"
                    <?php } ?>

                    <?= (new ComponentAttributeBag)
                        ->class([
                            'flex items-center gap-1 p-2 rounded-lg',
                            'text-xs text-gray-700 bg-gray-100 font-medium',
                            'opacity-70 transition group-hover:opacity-100',
                            'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300',
                        ])
                        ->merge([
                            'x-tooltip' => "{ content: '$subjectId' }",
                        ])
                        ->toHtml() ?>>
                    <span><?= $subjectLabel ?></span>
                    <span><?= $subjectAttribute ?></span>
                </a>
            <?php } ?>
        </div>
    <?php return ob_get_clean();
    }

    public function getAvatarHtml(User $user): string
    {
        $src = filament()->getUserAvatarUrl($user);
        $alt = __('filament-panels::layout.avatar.alt', ['name' => filament()->getUserName($user)]);
        ob_start(); ?>
        <img
            src="<?= $src ?>"
            alt="<?= $alt ?>"
            loading="lazy"
            <?= (new ComponentAttributeBag)
                ->class([
                    'fi-avatar',
                    'fi-circular',
                    'fi-size-md',
                ])
                ->toHtml() ?>>
    <?php return ob_get_clean();
    }

    public function getDescriptionHtml(Model $record, bool $shouldShowDescription): string
    {
        ob_start(); ?>
        <?php if ($shouldShowDescription) { ?>
            <div
                <?= (new ComponentAttributeBag)
                    ->class([
                        'bg-gray-100 px-2 py-1 rounded-lg text-sm dark:bg-gray-800 dark:text-gray-300 mt-2',
                    ])
                    ->toHtml() ?>>
                <?= $record->description ?>
            </div>
        <?php } ?>
<?php return ob_get_clean();
    }
}
