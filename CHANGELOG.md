# Changelog

All notable changes to `coolms/theme-default` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning is described in `CONTRIBUTING.md` -- read it before assuming what a
major number means here.
## 2.0.0-alpha5 - 2026-09-10

### Fixed

**`coolms/dtmpl` is declared.** These templates filter navigation URLs through
`href` in six places, and that filter arrived in dtmpl 2.1.0 -- there is no
filter of that name at v2.0.0.

The engine was reaching this package only through `coolms/theme-bootstrap`,
which is the sole-holder shape: a dependency present because something else asks
for it, and gone the moment that something else stops. Declared here at the
version that actually has the filter.

Nothing else changes. Same templates, one added requirement.

## 2.0.0-alpha4 - 2026-09-09
### Added

- The base layout emits the `{css}` and `{js}` blocks gathered from the page and
  its widgets. A `{css}` block declared in a template was inert until now.

### Changed

- Navigation URLs are filtered through `href`.
- The block partials are shared, and this theme overrides only what differs.
- The npm lockfile and the workflow directory are export-ignored.
- Comments and changelogs are ascii, and the readme no longer describes a test
  suite this package does not have.

## 2.0.0-alpha3 - 2026-09-03

### Fixed

**Declares `symfony/config`, without which this package cannot be loaded at
all.** The bundle class extends `Symfony\Component\HttpKernel\Bundle\Bundle`,
which extends `DependencyInjection\Kernel\AbstractBundle`, which implements
`Config\Definition\ConfigurableInterface` -- and `symfony/dependency-injection`
carries `symfony/config` in **require-dev**, not `require`. So installing
this package on its own produced:

```
Interface "Symfony\Component\Config\Definition\ConfigurableInterface" not found
```

!! **Invisible in any application that installs `symfony/framework-bundle`**,
which pulls `symfony/config` in transitively -- which is every application
this theme had ever been installed into. Found by resolving the package from
its tag into an empty tree and then checking that every `use` statement in
its own `src/` resolves against what that install produced. Installing is not
the check: 2.0.0-alpha2 installed perfectly and could not load its own bundle.

Same class of defect as `coolms/core-bundle` requiring
`symfony/translation-contracts` without `symfony/translation`: a dependency
the host application had been supplying that the manifest never declared.
## 2.0.0-alpha2 - 2026-09-03

**First published release.** Nothing before this was ever released, so there
is no earlier history to describe.

**A pre-release. It carries no compatibility promise**, which is the honest
statement of where the platform is: the shape is still moving, and a stable
tag would be a promise that cannot be kept yet.

Composer will not install it under default stability. Set

```json
"minimum-stability": "alpha",
"prefer-stable": true
```

in your root `composer.json`, then:

```
composer require coolms/theme-default:^2.0
```

### What it is

The theme a CoolMS installation activates when nobody has chosen one:
**60 DTMPL templates** over `coolms/theme-bootstrap` (`extends:
coolms-bootstrap`), 6 asset sources built with Vite, and 4 PHP classes.
Server-rendered -- `feStack: ssr`.

Unlike its base it ships `pages/`, so it can be assigned to a site section
and render a front page.

### Version

Starts at 2.0.0 for the same reason as its base: it requires `coolms/core`
and is therefore a lockstep member, and lockstep members share a major.

!! Its requirement on `coolms/theme-bootstrap` moved from `^1.0` to `^2.0`
in this release, because the base moved with it.
