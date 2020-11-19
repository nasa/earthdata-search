exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('retrieval_orders', {
    error: {
      type: 'text'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('retrieval_orders', ['error'])
}
