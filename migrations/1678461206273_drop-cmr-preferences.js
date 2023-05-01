exports.up = (pgm) => {
  pgm.dropColumns('users', ['cmr_preferences'])
}
