<?php

declare(strict_types=1);

namespace CoolMS\ThemeDefault\Provider;

use CoolMS\Core\Theme\ThemeProviderInterface;

/**
 * Provides the `coolms-default` Bootstrap 5 + DTMPL theme to the CoolMS Theme module.
 *
 * Tagged automatically as 'coolms.theme_provider' via ThemeBundle's autoconfiguration.
 * ThemePass injects all tagged providers into InstallThemeCommand.
 */
final class ThemeDefaultProvider implements ThemeProviderInterface
{
    public string $slug         { get => 'coolms-default'; }
    public string $themePath    { get => $this->bundleRoot . '/templates'; }
    public string $manifestPath { get => $this->bundleRoot . '/theme.yaml'; }
    public string $assetsPath   { get => $this->bundleRoot . '/public'; }
    public string $assetsUrl    { get => '/themes/coolms-default'; }
    private readonly string $bundleRoot;

    public function __construct()
    {
        $this->bundleRoot = dirname(__DIR__, 2);
    }
}
