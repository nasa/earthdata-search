exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.renameColumn('retrieval_orders', 'search_params', 'granule_params')
}

exports.down = (pgm) => {
  pgm.renameColumn('retrieval_orders', 'granule_params', 'search_params')
}
