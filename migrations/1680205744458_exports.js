exports.up = (pgm) => {
  pgm.createType('export_state', [
    'REQUESTED', 'PROCESSING', 'DONE', 'FAILED'
  ])

  pgm.createTable('exports', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users',
      notNull: false // can be anonymous
    },
    key: {
      type: 'varchar(36)', // uuid
      notNull: true
    },
    state: {
      type: 'export_state',
      notNull: true
    },
    filename: {
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
  pgm.dropTable('exports')
  pgm.dropType('export_state')
}
