module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '14.18',
          esmodules: true,
          ie: '10'
        }
      }
    ],
    '@babel/preset-react'
  ],
  env: {
    test_cypress: {
      plugins: ['istanbul']
    }
  },
  sourceType: 'unambiguous',
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    'transform-class-properties'
  ]
}
