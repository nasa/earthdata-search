exports.shorthands = undefined

// Prior to EDSC-4471, the access_configurations table not properly saving the access configuration's
// Specifically the form digest field was not being passed along therefore the access configuration could not be pulled again making the saved values in the form
// unreachable for Echo orders and ESI forms
exports.up = async (pgm) => {
  await pgm.db.query(`
    DELETE FROM access_configurations
    WHERE access_method->>'type' IN ('ECHO ORDERS', 'ESI')
  `)
}

exports.down = () => {
  // No rollback action as data deletion is irreversible
}
