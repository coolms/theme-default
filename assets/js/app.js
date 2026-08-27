// CoolMS Default Theme — Bootstrap 5 JavaScript entry point
import '../styles/app.scss';
import 'bootstrap';

// Lazy code-highlighting + code-tabs enhancement (#788 Track B). The module is
// tiny; it dynamically imports highlight.js only when the page has a code block.
import './code-highlight.js';

// Lazy KaTeX math rendering (#796 Track B). Dynamically imports KaTeX + its CSS
// only when the page carries server-wrapped `.katex-src` math spans.
import './math-render.js';

// Lazy Mermaid diagram rendering (Track B #7). Dynamically imports Mermaid only
// when the page carries a `<pre><code class="language-mermaid">` block; renders
// it to an SVG. code-highlight.js skips these blocks (mutually exclusive).
import './mermaid-render.js';
