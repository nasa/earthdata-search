exports.shorthands = undefined

exports.up = (pgm) => {
  // We don't want the value provided as the default to be an actual default but we
  // need to provide a value for any records that existed before adding this column
  pgm.db.query('ALTER TABLE users ALTER COLUMN environment DROP DEFAULT;')
}

exports.down = (pgm) => {
  // Add the default back to prevent issues with node pg migrate matching the column
  pgm.db.query('ALTER TABLE users ALTER COLUMN environment SET DEFAULT \'prod\';')
}
