exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('retrieval_orders', {
    order_information: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('retrieval_orders', ['order_information'])
}
