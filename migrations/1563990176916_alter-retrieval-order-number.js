exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.alterColumn('retrieval_orders', 'order_number', {
    type: 'varchar(1000)'
  })
}

exports.down = (pgm) => {
  pgm.alterColumn('retrieval_orders', 'order_number', {
    type: 'integer'
  })
}
