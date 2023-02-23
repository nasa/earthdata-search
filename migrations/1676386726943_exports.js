exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('exports', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users'
    },
    key: {
      type: 'varchar(1000)',
      notNull: true
    },
    state: {
      type: 'varchar(1000)' // 'REQUESTED', 'PROCESSING', 'DONE', or 'FAILED'
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
  pgm.dropTable('exports')
}
