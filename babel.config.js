module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '14',
          esmodules: true,
          ie: '10'
        }
      }
    ],
    '@babel/preset-react'
  ],
  sourceType: 'unambiguous',
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'transform-class-properties'
  ]
}
