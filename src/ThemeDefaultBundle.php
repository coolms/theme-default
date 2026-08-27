<?php

declare(strict_types=1);

namespace CoolMS\ThemeDefault;

use CoolMS\ThemeDefault\DependencyInjection\ThemeDefaultExtension;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Symfony bundle for the CoolMS Default Theme.
 *
 * Registers ThemeDefaultProvider (tagged as 'coolms.theme_provider') and
 * ThemeDefaultLifecycleSubscriber via the ThemeDefaultExtension.
 *
 * getPath() returns the package root (one level above src/) so Symfony
 * can resolve templates/, public/, and other non-PHP resources correctly.
 */
final class ThemeDefaultBundle extends Bundle
{
    public function getPath(): string
    {
        // __DIR__ = .../theme-default/src
        // dirname(__DIR__) = .../theme-default  (package root)
        return dirname(__DIR__);
    }

    public function getContainerExtension(): ExtensionInterface
    {
        return new ThemeDefaultExtension();
    }
}
