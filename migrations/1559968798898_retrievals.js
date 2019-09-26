exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('retrievals', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users'
    },
    jsondata: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    token: {
      type: 'varchar(100)',
      notNull: true
    },
    environment: {
      type: 'varchar(100)',
      notNull: true
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
  pgm.dropTable('retrievals')
}
