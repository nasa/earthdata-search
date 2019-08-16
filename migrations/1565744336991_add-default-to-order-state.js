exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.db.query('ALTER TABLE retrieval_orders ALTER COLUMN state SET DEFAULT \'creating\';')
  pgm.db.query('UPDATE retrieval_orders SET state=\'creating\' WHERE state IS NULL;')
}

exports.down = (pgm) => {
  pgm.db.query('ALTER TABLE retrieval_orders ALTER COLUMN state DROP DEFAULT;')
}
