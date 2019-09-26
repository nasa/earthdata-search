exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.db.query('ALTER TABLE users ALTER COLUMN echo_id DROP NOT NULL;')
  pgm.db.query('ALTER TABLE users ALTER COLUMN urs_id SET NOT NULL;')
  pgm.db.query('ALTER TABLE users ALTER COLUMN environment SET NOT NULL;')
}

exports.down = (pgm) => {
  pgm.db.query('ALTER TABLE users ALTER COLUMN echo_id SET NOT NULL;')
  pgm.db.query('ALTER TABLE users ALTER COLUMN urs_id DROP NOT NULL;')
  pgm.db.query('ALTER TABLE users ALTER COLUMN environment DROP NOT NULL;')
}
