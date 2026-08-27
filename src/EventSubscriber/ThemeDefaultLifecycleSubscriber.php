<?php

declare(strict_types=1);

namespace CoolMS\ThemeDefault\EventSubscriber;

use App\Theme\Application\Message\EnsureDefaultSiteSection;
use App\Theme\Application\Message\SeedThemeDefaultDemo;
use App\Theme\Domain\Event\ThemeInstalledEvent;
use App\Theme\Domain\Event\ThemeUninstalledEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Messenger\MessageBusInterface;

/**
 * Handles lifecycle events for the `coolms-default` theme.
 *
 * On install (always):
 *   - Dispatches EnsureDefaultSiteSection — creates a localhost / section if
 *     none exists. This is infrastructure, not demo content.
 *
 * On install with --with-demo:
 *   - Seeds demo NaviTree, NaviNodes, and Pages.
 *
 * On uninstall:
 *   - Cleans up any demo data created during installation.
 */
final class ThemeDefaultLifecycleSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly MessageBusInterface $bus,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ThemeInstalledEvent::class => 'onThemeInstalled',
            ThemeUninstalledEvent::class => 'onThemeUninstalled',
        ];
    }

    public function onThemeInstalled(ThemeInstalledEvent $event): void
    {
        if ('coolms-default' !== $event->slug) {
            return;
        }

        // Always — create minimal SiteSection if none exists for localhost /
        // Idempotent: the handler checks before creating.
        $this->bus->dispatch(new EnsureDefaultSiteSection($event->slug));

        // Optional — seed demo content (NaviTree, Pages, content)
        if ($event->withDemo) {
            $this->bus->dispatch(new SeedThemeDefaultDemo($event->slug));
        }
    }

    public function onThemeUninstalled(ThemeUninstalledEvent $event): void
    {
        if ('coolms-default' !== $event->slug) {
            return;
        }

        // Cleanup any demo content created during installation.
        // Intentionally left as a TODO until the demo seeder is implemented.
    }
}
