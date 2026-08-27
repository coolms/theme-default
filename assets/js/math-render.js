/**
 * Public-page math rendering (KaTeX) — Track B #7.
 *
 * The server ({@link MathProcessor}) wraps `$…$`/`$$…$$` LaTeX into explicit
 * `<span class="katex-src" data-display="0|1">LATEX</span>` markers — code- and
 * prose-safe — so this script renders ONLY those, never a stray `$` in prose.
 * KaTeX (+ its CSS) is dynamically imported only when the page actually carries
 * math, so math-free pages pay nothing. The element's `textContent` is the raw
 * LaTeX (the browser has decoded any entities). Without this JS, or on a KaTeX
 * error, the LaTeX source stays visible — graceful degradation.
 */
async function renderMath() {
    const nodes = document.querySelectorAll('.katex-src:not([data-rendered])');
    if (!nodes.length) return;

    // KaTeX + its stylesheet ship as their own lazy chunk (loaded together).
    const [{ default: katex }] = await Promise.all([
        import('katex'),
        import('katex/dist/katex.min.css'),
    ]);

    nodes.forEach((el) => {
        el.setAttribute('data-rendered', '');
        try {
            katex.render(el.textContent, el, {
                displayMode: el.dataset.display === '1',
                throwOnError: false,
            });
        } catch {
            /* malformed LaTeX must never break the page; leave the source visible */
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMath);
} else {
    renderMath();
}
