<?php

namespace Noxo\FilamentActivityLog;

use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Noxo\FilamentActivityLog\Commands\MakeLoggerCommand;
use Noxo\FilamentActivityLog\Extensions\LogActions;
use Noxo\FilamentActivityLog\Loggers\Loggers;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentActivityLogServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-activity-log';

    public function configurePackage(Package $package): void
    {
        $package
            ->name(static::$name)
            ->hasCommands([
                MakeLoggerCommand::class,
            ])
            ->hasConfigFile()
            ->hasTranslations()
            ->hasViews();
    }

    public function shortName(): string
    {
        return 'noxo/' . self::$name;
    }

    public function bootingPackage()
    {
        Loggers::discover();
        app(LogActions::class)->configure();

        FilamentAsset::register([
            Css::make('filament-activity-log-styles', __DIR__ . '/../resources/dist/filament-activity-log.css'),
            Js::make('filament-activity-log-scripts', __DIR__ . '/../resources/dist/filament-activity-log.js'),
        ], $this->shortName());
    }
}
