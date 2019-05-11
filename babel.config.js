module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '8.10',
          esmodules: true
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
  ]
}
