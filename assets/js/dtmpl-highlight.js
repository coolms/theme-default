/**
 * highlight.js language definition for DTMPL — the platform's PHP-only template
 * language (`{var:…}`, `{if:…}`, `{widget:…}`, `{verbatim}…{endverbatim}`).
 *
 * MIRROR of the admin SPA copy at:
 *   the editor's own dtmpl-highlight extension.ts
 * There is no shared npm workspace across the admin app and the themes, so this
 * self-contained `LanguageFn` is duplicated. Keep the two in sync.
 *
 * SOURCE OF TRUTH for the keyword set: src/DTMPL/Domain/Lexer/Lexer.php KEYWORDS.
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
            { match: /\{(?:verbatim|endverbatim)\}/, scope: 'meta' },
            TAG,
        ],
    };
}
