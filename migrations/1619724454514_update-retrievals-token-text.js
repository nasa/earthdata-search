exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.alterColumn('retrievals', 'token', {
    type: 'text'
  })
}

exports.down = (pgm) => {
  pgm.alterColumn('retrievals', 'token', {
    type: 'varchar(100)'
  })
}
