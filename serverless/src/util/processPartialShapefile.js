import forge from 'node-forge'

import { createLimitedShapefile } from './createLimitedShapefile'
import { deobfuscateId } from './obfuscation/deobfuscateId'

/**
 * If a shapefile is provided and a user selected specific features from the file create
 * a child shapefile that only contains the requested features for user in search and subsetting
 * @param {Object} dbConnection A connection to the database provided by the Lambda
 * @param {Integer} userId ID of the user the shapefile belongs to
 * @param {Integer} shapefileId ID of the shapefile that potential features belong to
 * @param {Array} selectedFeatures Array of geojson features from the parent shapefile
 */
export const processPartialShapefile = async (
  dbConnection,
  userId,
  shapefileId,
  selectedFeatures
) => {
  // Default the response to an undefined object
  let file

  // Deobfuscate the provided shapefile id
  const deobfuscatedShapefileId = deobfuscateId(
    shapefileId,
    process.env.obfuscationSpinShapefiles
  )

  const shapefileRecord = await dbConnection('shapefiles')
    .first('file', 'filename')
    .where({ id: deobfuscatedShapefileId });

  ({ file } = shapefileRecord)

  // If selectedFeatures exists, build a new shapefile out of those features and use the new shapefile to submit order
  if (selectedFeatures && selectedFeatures.length > 0) {
    // Create a new shapefile
    const newFile = createLimitedShapefile(file, selectedFeatures)

    file = newFile

    const fileHash = forge.md.md5.create()
    fileHash.update(JSON.stringify(file))

    // If the user already used this file, don't save the file again
    const existingShapefileRecord = await dbConnection('shapefiles')
      .first('id')
      .where({
        file_hash: fileHash,
        user_id: userId
      })

    if (!existingShapefileRecord) {
      const { filename } = shapefileRecord

      // Save new shapefile into database, adding the parent_shapefile_id
      await dbConnection('shapefiles')
        .insert({
          file_hash: fileHash.digest().toHex(),
          file,
          filename: `Limited-${filename}`,
          parent_shapefile_id: deobfuscatedShapefileId,
          selected_features: selectedFeatures,
          user_id: userId
        })
    }
  }

  return file
}
