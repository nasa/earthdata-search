/**
 * Creates a limited shapefile that only contains the shapes that match the provided selectedFeatures
 * @param {Object} file Shapefile
 * @param {Array} selectedFeatures Array of the selected features of the shapefile
 */
export const createLimitedShapefile = (file, selectedFeatures) => {
  const newFile = file
  const newFeatures = newFile.features.filter((feature) => {
    const { edscId } = feature

    return selectedFeatures.includes(edscId)
  })

  newFile.features = newFeatures

  return newFile
}
