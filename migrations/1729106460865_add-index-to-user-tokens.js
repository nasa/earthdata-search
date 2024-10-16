exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createIndex('user_tokens', ['user_id', 'environment'], {
    method: 'btree'
  })
}

exports.down = (pgm) => {
  pgm.dropIndex('user_tokens', ['user_id', 'environment'])
}
