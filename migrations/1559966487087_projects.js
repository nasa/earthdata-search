exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('projects', {
    id: 'id',
    name: {
      type: 'varchar(1000)'
    },
    path: {
      type: 'text',
      notNull: true
    },
    user_id: {
      type: 'integer',
      references: 'users'
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
  pgm.dropTable('projects')
}
