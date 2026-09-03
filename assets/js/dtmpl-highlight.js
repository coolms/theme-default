/**
 * highlight.js language definition for DTMPL — the platform's PHP-only template
 * language (`{var:…}`, `{if:…}`, `{widget:…}`, `{verbatim}…{endverbatim}`,
 * `{comment}…{endcomment}`).
 *
 * MIRROR of the admin SPA copy at:
 *   packages/editor-angular/src/lib/extensions/code-block/dtmpl-highlight.ts
 * There is no shared npm workspace across the admin app and the themes, so this
 * self-contained `LanguageFn` is duplicated. Keep the two in sync — and the
 * server-side `DtmplGrammar` in the platform's `Web` module with them.
 *
 * SOURCE OF TRUTH for the keyword set: `KeywordRegistry::KEYWORDS` in the
 * `coolms/dtmpl` package (`packages/dtmpl/src/Lexer/KeywordRegistry.php`).
 *
 * ⚠️ `verbatim` and `comment` are NOT in that registry — they are lexer
 * constructs resolved ahead of the parser, which is why their contents reach no
 * output. Spelled out separately below; a sweep that diffs only against the
 * registry will not see them.
 */

export const DTMPL_KEYWORDS = [
    'var', 'loop', 'endloop', 'item',
    'if', 'endif', 'ifno', 'unless', 'endno', 'endunless', 'else',
    'def', 'define', 'include', 'endinclude',
    'slot', 'endslot', 'fill', 'endfill',
    'widget', 'const', 't',
];

/** @param {import('highlight.js').HLJSApi} _hljs */
export function dtmpl(_hljs) {
    const kwAlt = DTMPL_KEYWORDS.join('|');

    const STRING = {
        scope: 'string',
        begin: '`',
        end: '`',
        contains: [{ begin: /\\`/ }],
    };

    const NUMBER = { scope: 'number', begin: /\b\d+(?:\.\d+)?\b/ };

    // `| filter` / `| php.fn` — pipe is an operator, the filter name a built-in.
    const FILTER = {
        match: [/\|/, /\s*/, /(?:php\.)?[A-Za-z_]\w*/],
        scope: { 1: 'operator', 3: 'built_in' },
    };

    const ALIAS = { scope: 'symbol', begin: /@[A-Za-z_]\w*/ };

    // `{comment}…{endcomment}` and `{comment:…}` — body included, not just the
    // markers: a comment's contents are definitionally not code. Exact-form
    // begins, so `{comments}` and `{comment foo}` stay ordinary text.
    const COMMENT_BLOCK = { scope: 'comment', begin: /\{comment\}/, end: /\{endcomment\}/ };
    const COMMENT_INLINE = { scope: 'comment', begin: /\{comment:/, end: /\}/ };

    const OPERATOR = { scope: 'operator', begin: /!=|>=|<=|[=><:,.[\]]/ };

    const VARIABLE = {
        scope: 'variable',
        begin: new RegExp('\\b(?!(?:' + kwAlt + ')\\b)[A-Za-z_]\\w*(?:\\.[A-Za-z_]\\w*)*'),
    };

    const TAG = {
        begin: new RegExp('\\{(?=(?:' + kwAlt + ')\\b)'),
        beginScope: 'punctuation',
        end: /\}/,
        endScope: 'punctuation',
        keywords: { keyword: DTMPL_KEYWORDS.slice(), literal: ['true', 'false'] },
        contains: [STRING, NUMBER, FILTER, ALIAS, OPERATOR, VARIABLE],
    };

    return {
        name: 'DTMPL',
        aliases: ['dtmpl'],
        case_insensitive: false,
        contains: [
            { match: /\{\{|\}\}/, scope: 'meta' },
            // Comments first: their body must not be offered to TAG below.
            COMMENT_BLOCK,
            COMMENT_INLINE,
            { match: /\{(?:verbatim|endverbatim)\}/, scope: 'meta' },
            TAG,
        ],
    };
}
