const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

let plugins = []

const autoprefix = autoprefixer({
  overrideBrowserslist: ['> 1%', 'last 2 versions']
})

// In development, we only want autoprefixer. In any other environment,
// we run cssnano as well. The order is important here.
if (process.env.NODE_ENV !== 'development') {
  plugins = [
    autoprefix,
    cssnano
  ]
} else {
  plugins = [autoprefix]
}

module.exports = {
  plugins
}
