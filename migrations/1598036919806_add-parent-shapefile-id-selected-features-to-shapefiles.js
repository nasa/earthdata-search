exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('shapefiles', {
    parent_shapefile_id: {
      type: 'integer',
      references: 'shapefiles'
    },
    selected_features: {
      type: 'text []'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('shapefiles', ['parent_shapefile_id', 'selected_features'])
}
