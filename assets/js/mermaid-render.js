/**
 * Public-page Mermaid diagram rendering — Track B #7.
 *
 * The editor stores a Mermaid diagram as a fenced code block (riding the #788
 * code-block contract — no backend transform needed):
 *
 *     <pre><code class="language-mermaid">graph TD; A --&gt; B</code></pre>
 *
 * This script finds those blocks, lazily imports Mermaid (its own Vite chunk)
 * ONLY when a page actually carries one — diagram-free pages pay nothing — and
 * swaps each `<pre>` for a rendered `<div class="mermaid-diagram">` SVG.
 *
 * Mutually exclusive with {@link ./code-highlight.js} on `language-mermaid`:
 * that script skips these blocks so highlight.js never tokenises diagram source
 * (the two collide otherwise — Mermaid owns the block, the highlighter leaves it
 * alone). `securityLevel: 'strict'` sanitises diagram labels so author content
 * can't inject script. A malformed diagram leaves its source code block visible
 * (graceful degradation), and with JS off the source stays readable too.
 */
async function renderMermaid() {
    const blocks = document.querySelectorAll(
        'pre > code.language-mermaid:not([data-mermaid-done])',
    );
    if (!blocks.length) return;

    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });

    let i = 0;
    for (const code of blocks) {
        code.setAttribute('data-mermaid-done', '');
        const pre = code.closest('pre');
        if (!pre) continue;
        // textContent decodes the stored HTML entities (`--&gt;` → `-->`), so
        // Mermaid receives the raw diagram source.
        const source = code.textContent || '';
        try {
            const { svg } = await mermaid.render(`mermaid-diagram-${i += 1}`, source);
            const wrap = document.createElement('div');
            wrap.className = 'mermaid-diagram';
            wrap.innerHTML = svg;
            pre.replaceWith(wrap);
        } catch {
            /* malformed diagram: leave the <pre> source block visible */
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMermaid);
} else {
    renderMermaid();
}
