exports.shorthands = undefined

// Prior to EDSC-4471, the access_configurations table not properly saving the access configuration
// Specifically the form digest field was not being passed along therefore the access configuration could not be pulled again making the saved values in the form
// unreachable
exports.up = (pgm) => {
  pgm.sql('DELETE FROM access_configurations')
}

exports.down = () => {
  // No rollback action as data deletion is irreversible
}
