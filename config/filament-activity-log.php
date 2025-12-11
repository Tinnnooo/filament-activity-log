<?php

use Noin\FilamentActivityLog\ResourceLogger\Types\BooleanEnum;

return [
    'loggers' => [
        'directory' => app_path('Filament/Loggers'),
        'namespace' => 'App\\Filament\\Loggers',
    ],

    'boolean' => BooleanEnum::class,

    'custom_event_styles' => [
        //
    ],
];
