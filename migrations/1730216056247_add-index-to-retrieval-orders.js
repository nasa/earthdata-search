exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createIndex('retrieval_orders', ['retrieval_collection_id'], {
    method: 'btree'
  })
}

exports.down = (pgm) => {
  pgm.dropIndex('retrieval_orders', ['retrieval_collection_id'])
}
