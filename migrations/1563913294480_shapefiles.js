exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('shapefiles', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users'
    },
    file: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    file_hash: {
      type: 'varchar(1000)',
      notNull: true
    },
    filename: {
      type: 'varchar(1000)',
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
  pgm.dropTable('shapefiles')
}
