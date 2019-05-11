exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('colormaps', {
    id: 'id',
    product: {
      type: 'varchar(1000)',
      notNull: true
    },
    url: {
      type: 'varchar(1000)',
      notNull: true
    },
    jsondata: {
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
  pgm.dropTable('colormaps')
}
