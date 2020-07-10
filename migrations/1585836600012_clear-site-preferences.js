exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.db.query('UPDATE users SET site_preferences=\'{}\';')
}
