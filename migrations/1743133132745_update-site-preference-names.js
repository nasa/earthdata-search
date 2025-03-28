exports.shorthands = undefined

exports.up = async (pgm) => {
  // Updates the values in the jsonb column for the mapView preferences
  // Update the baseLayer value to "worldImagery" if it is set to "blueMarble"
  await pgm.db.query(`
    UPDATE users
    SET site_preferences = jsonb_set(
      site_preferences,
      '{mapView,baseLayer}',
      '"worldImagery"',
      false
    )
    WHERE site_preferences-> 'mapView' ->> 'baseLayer' = 'blueMarble'
  `)

  // Update referenceLabels to placeLabels
  await pgm.db.query(`
    UPDATE users
    SET site_preferences = jsonb_set(
      site_preferences,
      '{mapView,overlayLayers}', -- Path to the overlayLayers array
      (
        SELECT jsonb_agg(
          CASE
            WHEN value = 'referenceLabels' THEN 'placeLabels' -- Replace referenceLabels with placeLabels
            ELSE value
          END
        )
        FROM jsonb_array_elements_text(site_preferences->'mapView'->'overlayLayers') AS value
      ),
      false -- Do not create the key if it does not exist
    )
    WHERE site_preferences->'mapView'->'overlayLayers' @> '"referenceLabels"';
  `)

  // Update referenceFeatures to bordersRoads
  await pgm.db.query(`
    UPDATE users
    SET site_preferences = jsonb_set(
      site_preferences,
      '{mapView,overlayLayers}', -- Path to the overlayLayers array
      (
        SELECT jsonb_agg(
          CASE
            WHEN value = 'referenceFeatures' THEN 'bordersRoads' -- Replace referenceFeatures with bordersRoads
            ELSE value
          END
        )
        FROM jsonb_array_elements_text(site_preferences->'mapView'->'overlayLayers') AS value
      ),
      false -- Do not create the key if it does not exist
    )
    WHERE site_preferences->'mapView'->'overlayLayers' @> '"referenceFeatures"';
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
      false -- Do not create the key if it does not exist
    )
    WHERE site_preferences-> 'mapView' ->> 'baseLayer' = 'worldImagery'
  `)

  // Revert placeLabels back to referenceLabels if needed
  await pgm.db.query(`
    UPDATE users
    SET site_preferences = jsonb_set(
      site_preferences,
      '{mapView,overlayLayers}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN value = 'placeLabels' THEN 'referenceLabels'
            ELSE value
          END
        )
        FROM jsonb_array_elements_text(site_preferences->'mapView'->'overlayLayers') AS value
      ),
      false -- Do not create the key if it does not exist
    )
    WHERE site_preferences->'mapView'->'overlayLayers' @> '"placeLabels"';
  `)

  // Revert bordersRoads back to referenceFeatures if needed
  await pgm.db.query(`
      UPDATE users
      SET site_preferences = jsonb_set(
        site_preferences,
        '{mapView,overlayLayers}',
        (
          SELECT jsonb_agg(
            CASE
              WHEN value = 'bordersRoads' THEN 'referenceFeatures'
              ELSE value
            END
          )
          FROM jsonb_array_elements_text(site_preferences->'mapView'->'overlayLayers') AS value
        ),
        false -- Do not create the key if it does not exist
      )
      WHERE site_preferences->'mapView'->'overlayLayers' @> '"bordersRoads"';
    `)
}
