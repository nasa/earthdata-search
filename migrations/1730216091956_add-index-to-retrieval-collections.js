exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createIndex('retrieval_collections', ['retrieval_id'], {
    method: 'btree'
  })
}

exports.down = (pgm) => {
  pgm.dropIndex('retrieval_collections', ['retrieval_id'])
}
