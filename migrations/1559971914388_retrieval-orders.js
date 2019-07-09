exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('retrieval_orders', {
    id: 'id',
    retrieval_collection_id: {
      type: 'integer',
      references: 'retrieval_collections'
    },
    type: {
      type: 'varchar(1000)',
      notNull: true
    },
    search_params: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    order_number: {
      type: 'integer'
    },
    state: {
      type: 'varchar(1000)'
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('retrieval_orders')
}
