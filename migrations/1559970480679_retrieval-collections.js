exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('retrieval_collections', {
    id: 'id',
    retrieval_id: {
      type: 'integer',
      references: 'retrievals'
    },
    access_method: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    collection_id: {
      type: 'varchar(1000)',
      notNull: true
    },
    collection_metadata: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    granule_params: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    granule_count: {
      type: 'integer'
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
  pgm.dropTable('retrieval_collections')
}
