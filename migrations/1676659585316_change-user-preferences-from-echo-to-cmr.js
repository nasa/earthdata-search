/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('users', {
    cmr_preferences: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    }
  })

  pgm.dropColumns('users', ['echo_preferences', 'echo_profile', 'echo_id'])
}
