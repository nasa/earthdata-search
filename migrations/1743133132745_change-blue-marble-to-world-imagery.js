exports.shorthands = undefined

exports.up = async (pgm) => {
  // Update the value in the JSONB column
  // Retrieve the `jsonb` and update the nested baseLayer value if it is set to "blueMarble"
  // Compare the `baseLayer` as a string to `blueMarble` so only those rows are updated
  await pgm.db.query(`
    UPDATE users
    SET site_preferences = jsonb_set(
      site_preferences,
      '{mapView,baseLayer}',
      '"worldImagery"',
      true -- Create the key if it doesn't exist
    )
    WHERE site_preferences-> 'mapView' ->> 'baseLayer' = 'blueMarble'
  `)
}

exports.down = async (pgm) => {
  // Revert the baseLayer value back to "blueMarble" if needed
  await pgm.db.query(`
    UPDATE users
    SET site_preferences = jsonb_set(
      site_preferences,
      '{mapView,baseLayer}',
      '"blueMarble"',
      true -- Create the key if it doesn't exist
    )
    WHERE site_preferences-> 'mapView' ->> 'baseLayer' = 'worldImagery''
  `)
}
