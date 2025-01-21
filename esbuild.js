const { build } = require('esbuild')

build({
  entryPoints: [
    'serverless/src/**/handler.js'
  ],
  bundle: true,
  platform: 'node',
  outdir: 'serverless/dist',
  loader: {
    '.ipynb': 'json',
    '.svg': 'text'
  },
  external: [
    'sqlite3',
    'mysql',
    'tedious',
    'better-sqlite3',
    'oracledb',
    'mysql2',
    'pg-query-stream'
  ]
}).catch(() => process.exit(1))
