import cf from 'campfire.js';

cf.insert(cf.nu("h1", {
    c: 'test'
}), {atEndOf: document.body});