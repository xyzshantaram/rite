import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { highlight, HL_KEYWORDS } from 'macrolight/dist/macrolight.esm';
import { escape, mustache } from 'campfire.js';

const TABLE_MARKUP = `\
<div class='cyblog-table-wrapper'>
<table>
<thead>
{{ header }}
</thead>
<tbody>
{{ body }}
</tbody>
</table>
</div>
`;

const addCheckBox = (str: string) => {
    if (/^\s*\[.?\].*$/.test(str)) {
        return str.replace(/^\[ ?\]/, '<input type="checkbox">').replace(/^\[[^ ]\]/, '<input type="checkbox" checked>')
    }
    return str;
}

function renderMd(md: string) {
    const renderer = {
        listitem: (text: string) => {
            return `<li>${addCheckBox(text)}</li>\n`;
        },
        image: (href: string, title: string, text: string) => {
            let out = `<div class='img-wrapper'><img src='${href}' alt='${text}'`

            if (title) {
                out += ` title=${title}`;
            }

            out += ">";

            out += `<span aria-hidden='true' class='img-description'>${text}</span>`;

            out += '</div>';
            return out;
        },
        code: (code: string, lang_: string, escaped: boolean) => {
            const langMatches = (lang_ || '').match(/\S*/);
            let lang = '';
            if (langMatches) {
                lang = langMatches[0];
            }
            if (lang) {
                code = highlight(code, {
                    keywords: HL_KEYWORDS[lang] || [],
                    styles: {
                        punctuation: 'color: #aaa;',
                        comment: 'color: #aaa;'
                    }
                });
                escaped = true;
            }
            return `\n<pre><code>${(escaped ? code : escape(code))}</code></pre>\n`;
        },
        table: (header: string, body: string) => {
            return mustache(TABLE_MARKUP, {
                header: header,
                body: body
            });
        }
    }
    marked.use({ renderer: renderer });
    return DOMPurify.sanitize(marked.parse(md));
}

export function getPreviewHtml(md: string, dark = false) {
    return `\
<html${dark ? " class='dark'" : ''}>
<head>
    <meta name="referrer" content="no-referrer">
    <title>Campfire Playground</title>
    <link rel='stylesheet' href='preview.css'>
</head>
<body>
    <div id='loading-text'>
        Loading...
    </div>
    <a id='print' href='javascript:void(0)'>Print</a>
    <div id='content'>
        ${renderMd(md)}\
    </div>

    <script>
        window.onload = () => {

            const printLink = document.querySelector('#print');

            window.onbeforeprint = () => {
                printLink.style.display = 'none';
            }

            window.onafterprint = () => {
                printLink.style.display = 'block';
            }

            printLink.onclick = (e) => {
                e.preventDefault();
                window.print();
            }
            
            document.querySelector('#content').style.display = 'block';
            document.querySelector('#loading-text').style.display = 'none';
        }
    </script>
</body>
</html>\
    `;
}