const path = require('path')

const resources = [
  'utils/variables/_colors.scss',
  'vendor/bootstrap/_vars.scss'
]

module.exports = resources.map(file => path.resolve(__dirname, file))
