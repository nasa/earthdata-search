exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('access_configurations', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users'
    },
    collection_id: {
      type: 'varchar(1000)',
      notNull: true
    },
    access_method: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
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
  pgm.dropTable('access_configurations')
}
