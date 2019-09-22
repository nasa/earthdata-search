import 'array-foreach-async'

export const migrateShapefiles = async (oldDbConnection, newDbConnection) => {
  const oldShapefiles = await oldDbConnection('shapefiles')
    .select([
      'id',
      'file',
      'file_hash',
      'user_id',
      'created_at',
      'updated_at'
    ])
    .orderBy('id')

  await oldShapefiles.forEachAsync(async (oldShapefile) => {
    const {
      id,
      file,
      file_hash: fileHash,
      user_id: userId,
      created_at: createdAt,
      updated_at: updatedAt
    } = oldShapefile

    try {
      await newDbConnection('shapefiles').insert({
        id,
        file,
        file_hash: fileHash,
        filename: `shapefile-${id}.json`,
        user_id: userId,
        created_at: createdAt,
        updated_at: updatedAt
      })

      console.log(`Successfully inserted shapefile record with ID ${id}`)
    } catch (e) {
      console.log(e.message)
    }
  })
}
