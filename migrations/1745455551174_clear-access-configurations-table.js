exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql('DELETE FROM access_configurations')
}

exports.down = () => {
  // No rollback action as data deletion is irreversible
}
