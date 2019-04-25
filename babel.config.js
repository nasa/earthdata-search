module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '10.4.1',
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
