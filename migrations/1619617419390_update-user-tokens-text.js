exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.alterColumn('user_tokens', 'access_token', {
    type: 'text'
  })
  pgm.alterColumn('user_tokens', 'refresh_token', {
    type: 'text'
  })
}

exports.down = (pgm) => {
  pgm.alterColumn('user_tokens', 'access_token', {
    type: 'varchar(100)'
  })
  pgm.alterColumn('user_tokens', 'refresh_token', {
    type: 'varchar(100)'
  })
}
