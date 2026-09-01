// CoolMS Default Theme — Bootstrap 5 JavaScript entry point
import '../styles/app.scss';
import 'bootstrap';

// Lazy code-highlighting + code-tabs enhancement . The module is
// tiny; it dynamically imports highlight.js only when the page has a code block.
import './code-highlight.js';

// Lazy KaTeX math rendering . Dynamically imports KaTeX + its CSS
// only when the page carries server-wrapped `.katex-src` math spans.
import './math-render.js';

// Lazy Mermaid diagram rendering. Dynamically imports Mermaid only
// when the page carries a `<pre><code class="language-mermaid">` block; renders
// it to an SVG. code-highlight.js skips these blocks (mutually exclusive).
import './mermaid-render.js';
