exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('retrieval_collections', {
    granule_link_count: {
      type: 'integer'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('retrieval_collections', ['granule_link_count'])
}
