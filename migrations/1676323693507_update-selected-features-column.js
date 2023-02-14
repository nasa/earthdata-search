exports.shorthands = undefined

// The migrations can't alter the selected_features column to change the type from `text [] `
// to `jsonb`. This migration will query all the rows that have data in selected_features, drop and add the column, then update the rows with their previous data
exports.up = async (pgm) => {
  // Query the shapefiles table for selected_features
  const { rows } = await pgm.db.query('SELECT id, selected_features FROM shapefiles WHERE selected_features IS NOT NULL;')

  // Generate update statements for each row
  const updateRowsSql = rows.map((row) => {
    const { id, selected_features: selectedFeatures } = row

    return `UPDATE shapefiles SET selected_features = '${JSON.stringify(selectedFeatures)}' WHERE id = ${id}`
  })

  // Drop the selected_features column, then re-add it with the correct type
  pgm.dropColumns('shapefiles', ['selected_features'])
  pgm.addColumns('shapefiles', {
    selected_features: {
      type: 'jsonb'
    }
  })

  // Execute the update statements to put the data back in to the table
  updateRowsSql.forEach((updateSql) => {
    pgm.sql(updateSql)
  })
}

exports.down = async (pgm) => {
  // Query the shapefiles table for selected_features
  const { rows } = await pgm.db.query('SELECT id, selected_features FROM shapefiles WHERE selected_features IS NOT NULL;')

  // Generate update statements for each row
  const updateRowsSql = rows.map((row) => {
    const { id, selected_features: selectedFeatures } = row

    return `UPDATE shapefiles SET selected_features = '{${selectedFeatures}}' WHERE id = ${id}`
  })

  // Drop the selected_features column, then re-add it with the correct type
  pgm.dropColumns('shapefiles', ['selected_features'])
  pgm.addColumns('shapefiles', {
    selected_features: {
      type: 'text []'
    }
  })

  // Execute the update statements to put the data back in to the table
  updateRowsSql.forEach((updateSql) => {
    pgm.sql(updateSql)
  })
}
