require('esbuild').build({
    entryPoints: ['static/src/main.ts'],
    bundle: true,
    outfile: 'static/js/main.js',
    watch: true,
    format: 'esm',
}).catch((err) => {
    console.error(err)
    process.exit(1)
})