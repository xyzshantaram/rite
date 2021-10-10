require('esbuild').build({
    entryPoints: ['static/src/main.ts'],
    bundle: true,
    outfile: 'static/js/main.js',
    format: 'esm',
    sourcemap: false
}).catch((err) => {
    console.error(err)
    process.exit(1)
})