const autoprefixer = require('autoprefixer')
const precss = require('precss')
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    precss,
    autoprefixer({
      browsers: ['> 1%', 'last 2 versions']
    }),
    cssnano
  ]
}
