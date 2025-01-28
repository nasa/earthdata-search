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
    'better-sqlite3',
    'mysql',
    'mysql2',
    'oracledb',
    'pg-native',
    'pg-query-stream',
    'sqlite3',
    'tedious'
  ]
}).catch(() => process.exit(1))
