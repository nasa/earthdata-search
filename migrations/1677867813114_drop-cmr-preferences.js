/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.dropColumns('users', ['cmr_preferences'])
}
