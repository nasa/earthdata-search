exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('nlp_feedback', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true
    },
    positive: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    query: {
      type: 'text'
    },
    keyword: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    spatial: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    temporal: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    incomplete: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    relevancy: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    other: {
      type: 'boolean',
      default: false,
      notNull: true
    },
    comment: {
      type: 'text'
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
  pgm.dropTable('nlp_feedback')
}
