<?php

declare(strict_types=1);

namespace CoolMS\ThemeDefault\DependencyInjection;

use CoolMS\ThemeDefault\Asset\ViteThemeAssetsProvider;
use CoolMS\ThemeDefault\EventSubscriber\ThemeDefaultLifecycleSubscriber;
use CoolMS\ThemeDefault\Provider\ThemeDefaultProvider;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;

/**
 * DI Extension for the CoolMS Default Theme bundle.
 *
 * Registers all services this bundle provides:
 *
 *   ThemeDefaultProvider
 *     - Autoconfigured: ThemeBundle's Extension registers ThemeProviderInterface for
 *       autoconfiguration with the 'coolms.theme_provider' tag, so no manual tagging
 *       is needed here — setAutoconfigured(true) is sufficient.
 *
 *   ThemeDefaultLifecycleSubscriber
 *     - Autoconfigured: FrameworkBundle registers EventSubscriberInterface for
 *       autoconfiguration with the 'kernel.event_subscriber' tag.
 *
 *   ViteThemeAssetsProvider
 *     - Autoconfigured: ThemeBundle's Extension registers ThemeAssetsProviderInterface for
 *       autoconfiguration with the 'coolms.theme_assets_provider' tag. ThemeAssetsRegistryPass
 *       then wires it into ThemeAssetsRegistry.
 *     - No constructor args needed — manifest path resolution is purely filesystem-based.
 */
final class ThemeDefaultExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        $container->register(ThemeDefaultProvider::class)
            ->setAutowired(true)
            ->setAutoconfigured(true)
            ->setPublic(false);

        $container->register(ThemeDefaultLifecycleSubscriber::class)
            ->setAutowired(true)
            ->setAutoconfigured(true)
            ->setPublic(false);

        $container->register(ViteThemeAssetsProvider::class)
            ->setAutowired(false)
            ->setAutoconfigured(true)   // picks up coolms.theme_assets_provider tag
            ->setPublic(false);
    }

    public function getAlias(): string
    {
        return 'coolms_theme_default';
    }
}
