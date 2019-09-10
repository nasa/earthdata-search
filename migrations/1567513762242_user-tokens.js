exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('user_tokens', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users'
    },
    environment: {
      type: 'varchar(100)',
      notNull: true
    },
    access_token: {
      type: 'varchar(100)',
      notNull: true
    },
    refresh_token: {
      type: 'varchar(100)',
      notNull: true
    },
    expires_at: {
      type: 'timestamp',
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
  pgm.dropTable('user_tokens')
}
