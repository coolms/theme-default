<?php

declare(strict_types=1);

namespace CoolMS\ThemeDefault\Asset;

use CoolMS\Core\Theme\ThemeAssetsProviderInterface;
use CoolMS\Core\Theme\ThemeAssets;

/**
 * Resolves compiled asset URLs for the coolms-default theme by reading
 * the Vite manifest.json file produced by `npm run build`.
 *
 * Supports both Vite 4 (manifest.json) and Vite 5 (.vite/manifest.json)
 * output structures, with or without a `build/` outDir prefix.
 *
 * Returns ThemeAssets::empty() when no manifest is found (assets not yet built).
 */
final class ViteThemeAssetsProvider implements ThemeAssetsProviderInterface
{
    private const array MANIFEST_CANDIDATES = [
        ['build/.vite/manifest.json', 'build/'],
        ['build/manifest.json', 'build/'],
        ['.vite/manifest.json', ''],
        ['manifest.json', ''],
    ];

    public string $slug { get => 'coolms-default'; }

    public function getAssets(string $assetsPath, string $assetsUrl): ThemeAssets
    {
        $assetsPath = rtrim($assetsPath, '/');
        $assetsUrl = rtrim($assetsUrl, '/');

        foreach (self::MANIFEST_CANDIDATES as [$relManifest, $urlBase]) {
            $manifestPath = $assetsPath . '/' . $relManifest;

            if (!file_exists($manifestPath)) {
                continue;
            }

            $manifest = json_decode(
                (string) file_get_contents($manifestPath),
                true,
                flags: JSON_THROW_ON_ERROR,
            );

            $css = [];
            $js = [];

            foreach ($manifest as $entry) {
                if (!($entry['isEntry'] ?? false)) {
                    continue;
                }
                if (isset($entry['file'])) {
                    $js[] = ['url' => $assetsUrl . '/' . $urlBase . $entry['file']];
                }
                foreach ($entry['css'] ?? [] as $cssFile) {
                    $css[] = ['url' => $assetsUrl . '/' . $urlBase . $cssFile];
                }
            }

            return new ThemeAssets($css, $js);
        }

        return ThemeAssets::empty();
    }
}
