exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('users', {
    environment: { type: 'varchar(1000)', notNull: true, default: 'prod' }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('users', ['environment'])
}
