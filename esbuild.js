/**
 * This esbuild config will bundle all the lambda functions in the serverless/src directory
 * and output them to the serverless/dist directory.
 *
 * This is currently only used for the local development environment.
 */

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
