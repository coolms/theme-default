# Changelog

All notable changes to `coolms/theme-default` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning is described in `CONTRIBUTING.md` -- read it before assuming what a
major number means here.
## Unreleased

### Security

- `dompurify` (through `mermaid`) 3.4.10 -> 3.4.17 in the lockfile, within mermaid's own range: clears seven
  advisories, one critical (GHSA-cg2g-xh64-v4q7) and one high (GHSA-mrv2-3pqr-j5jr). The four that were listed in
  `.github/advisories.txt` come off it.

### Removed

- The page templates the platform no longer draws: `pages/blog-index`, `pages/docs-index` and `pages/autoindex`
  (a listing is drawn in its directory's frame by `content/blog-index`, `content/docs-index` and
  `content/autoindex`), and the six `auth/*` templates (the sign-in pages are content, drawn in the frame by the
  sign-in form block). Requires a platform that draws listings in frames.

### Added

- `layouts/bare.html.dtmpl` and `pages/landing.html.dtmpl`: a page of plain type, monochrome, light or dark as the
  visitor's system is set, with no header, footer, navigation, search or JavaScript, and without the analytics,
  experiments, personalization, consent-banner and chat partials every other layout adds. The landing page renders
  the page's title and body. Meant to be assigned to a whole site section; no existing page uses it.
- The sign-in form block passes `` overridesFrom=`block.field_texts` `` to the form widget, so a page's own label and
  help text per field (per language version) reach the form. The form's action, field names, field types and CSRF
  token stay the platform's. A platform without the parameter ignores it, and the form draws as before.

### Changed

- The search results page is a content renderer: `content/search` draws `GET /search` inside the frame, the inner
  part of `pages/search` (kept until the platform draws it in a frame).
- Listings are content renderers too: `content/blog-index`, `content/docs-index` and `content/autoindex` draw a
  collection directory's listing (and a directory listed automatically) inside the frame, each the inner part of
  the page template it will replace (`pages/blog-index`, `pages/docs-index`, `pages/autoindex`, kept until the
  platform draws listings in frames).
- Pages are drawn in a FRAME: `frames/default.html.dtmpl` is the theme's chrome, and a page's content is drawn at
  `{content}` by the renderer its type names -- `content/page`, `content/landing`, `content/markdown`,
  `content/article`, `content/blog_post`, `content/docs_page`, each the inner part of the page template it replaces.
  Requires a platform that renders frames and has `{content}`.
- The first-run panel is `content/first-run.html.dtmpl`: the platform draws it in the section's frame while the
  section has no index page. "Open the admin" shows only to a signed-in administrator.
- The six sign-in pages are seeded as content -- an `auth_form` block each, system pages -- and the privacy
  placeholder is seeded noindex.
- vite 5.4 -> 6.4.4 (GHSA-698v-4r3x-3vcv, and six listed advisories it also clears). The built stylesheet is the same
  rule for rule; only the minifier's spacing inside media queries differs.

- `partials/blocks/auth_form.html.dtmpl`: the sign-in pages' form block in this theme's Bootstrap card, centred as
  the old sign-in templates drew it; the platform's partial is plain markup this theme's sheet does not style.

### Removed

- `pages/home`, `pages/landing`, `pages/markdown`, `pages/article`, `pages/blog_post`, `pages/docs_page`,
  `pages/privacy`: replaced by the frame and the content renderers.
- `pages/list`: referenced by no code, template, configuration or stored data.

## 2.0.0-alpha6 - 2026-10-07

### Added

- Declares `support` -- `issues` and `source` -- so a page imported from this
  package, and the catalogue, know where a correction is filed. Packagist filled
  the gap from GitHub when the manifest was silent; the declared field is the
  one that holds on any registry.

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
