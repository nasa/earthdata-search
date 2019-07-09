exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    site_preferences: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    echo_id: {
      type: 'varchar(1000)',
      notNull: true
    },
    echo_profile: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    echo_preferences: {
      type: 'jsonb',
      notNull: true,
      default: '{}'
    },
    urs_id: {
      type: 'varchar(1000)'
    },
    urs_profile: {
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
  pgm.dropTable('users')
}
