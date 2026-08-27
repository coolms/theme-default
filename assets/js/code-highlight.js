/**
 * Public-page code highlighting + code-tabs enhancement (#788 Track B).
 *
 * Highlighting is CLIENT-SIDE but lazy and self-hosted: highlight.js' common
 * bundle is dynamically imported (its own Vite chunk) only when the page
 * actually contains a `<pre><code>`, so code-free pages pay nothing. The same
 * stored contract (`<pre><code class="language-x">`) drives every frontend, so
 * this approach is universal — an SPA theme reuses the identical grammar + CSS.
 *
 * Code tabs (`<div class="code-tabs">` wrapping several `<pre>` variants) are
 * progressively enhanced into a tab strip. Without this JS the variants simply
 * stack and stay readable.
 */
import { dtmpl } from './dtmpl-highlight.js';

/** Pretty tab labels; falls back to the raw highlight.js id. */
const LANG_LABELS = {
    bash: 'Bash', c: 'C', cpp: 'C++', csharp: 'C#', css: 'CSS', diff: 'Diff',
    go: 'Go', graphql: 'GraphQL', ini: 'INI / TOML', java: 'Java',
    javascript: 'JavaScript', json: 'JSON', kotlin: 'Kotlin', less: 'Less',
    lua: 'Lua', makefile: 'Makefile', markdown: 'Markdown', objectivec: 'Objective-C',
    perl: 'Perl', php: 'PHP', 'php-template': 'PHP template', python: 'Python',
    'python-repl': 'Python REPL', r: 'R', ruby: 'Ruby', rust: 'Rust', scss: 'SCSS',
    shell: 'Shell', sql: 'SQL', swift: 'Swift', typescript: 'TypeScript',
    vbnet: 'VB.NET', wasm: 'WebAssembly', xml: 'HTML / XML', yaml: 'YAML',
    dtmpl: 'DTMPL',
};

/** Read the `language-x` class off a `<pre>`'s inner `<code>`. */
function languageOf(pre) {
    const code = pre.querySelector('code');
    const cls = code && code.className.match(/\blanguage-([\w-]+)\b/);
    return cls ? cls[1] : '';
}

function labelFor(pre, index) {
    const lang = languageOf(pre);
    if (!lang) return `Tab ${index + 1}`;
    return LANG_LABELS[lang] || lang;
}

/** Turn each `<div class="code-tabs">` into an interactive tab group. */
function enhanceCodeTabs() {
    const containers = document.querySelectorAll('.code-tabs:not([data-enhanced])');
    containers.forEach((container) => {
        const panels = Array.from(container.children).filter((el) => el.tagName === 'PRE');
        if (panels.length < 2) return; // a single variant needs no tabs
        container.setAttribute('data-enhanced', '');

        const bar = document.createElement('div');
        bar.className = 'code-tabs__bar';

        const activate = (idx) => {
            panels.forEach((p, i) => { p.style.display = i === idx ? '' : 'none'; });
            Array.from(bar.children).forEach((b, i) => {
                b.classList.toggle('code-tabs__tab--active', i === idx);
            });
        };

        panels.forEach((pre, idx) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'code-tabs__tab';
            tab.textContent = labelFor(pre, idx);
            tab.addEventListener('click', () => activate(idx));
            bar.appendChild(tab);
        });

        container.insertBefore(bar, container.firstChild);
        activate(0);
    });
}

/** Lazily load highlight.js (common languages) + DTMPL, then colour blocks. */
async function highlightCode() {
    const blocks = document.querySelectorAll('pre code');
    if (!blocks.length) return;

    const mod = await import('highlight.js/lib/common');
    const hljs = mod.default;
    if (!hljs.getLanguage('dtmpl')) {
        hljs.registerLanguage('dtmpl', dtmpl);
    }

    blocks.forEach((el) => {
        if (el.dataset.highlighted === 'yes') return;
        // Mermaid diagram blocks are owned by mermaid-render.js — never let
        // highlight.js tokenise diagram source (the two collide on
        // `language-mermaid`). Keeping the two scripts mutually exclusive here
        // is the fix for that collision.
        if (el.classList.contains('language-mermaid')) return;
        try {
            hljs.highlightElement(el);
        } catch {
            /* a stale/unknown language class must never break the page */
        }
    });
}

function init() {
    // Highlight first (hidden tab panels included), then wire up the tabs.
    void highlightCode();
    enhanceCodeTabs();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
