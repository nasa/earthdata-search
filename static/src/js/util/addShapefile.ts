import { shapefileEventTypes } from '../constants/eventTypes'
import { eventEmitter } from '../events/events'
import useEdscStore from '../zustand/useEdscStore'
import { ShapefileFile } from '../types/sharedTypes'

// Add an edscId to each feature in the shapefile
const addEdscIdsToShapefile = (file: ShapefileFile): ShapefileFile => {
  const fileWithIds = file
  const { features } = file

  const newFeatures = features.map((feature, index) => ({
    ...feature,
    properties: {
      ...feature.properties,
      edscId: `${index}`
    }
  }))

  fileWithIds.features = newFeatures

  return fileWithIds
}

/**
 * Add a shapefile to the store and emit an event that a shapefile has been added
 * @param {Object} params
 * @param {Object} params.file - The shapefile as a GeoJSON FeatureCollection
 * @param {string} params.filename - The name of the shapefile
 * @param {string} params.size - The size of the shapefile
 * @param {boolean} [params.updateQuery=true] - Whether to update the query with the new shapefile
 */
const addShapefile = ({
  file,
  filename,
  size,
  updateQuery = true
}: {
  /** The shapefile as a GeoJSON FeatureCollection */
  file: ShapefileFile,
  /** The name of the shapefile */
  filename: string,
  /** The size of the shapefile */
  size: string
  /** Whether to update the query with the new shapefile */
  updateQuery?: boolean,
}) => {
  // Update the name to the original name (ogre puts a hash into this name field)
  const updatedFile = file
  updatedFile.name = filename

  // Add edscIds to each feature
  const fileWithIds = addEdscIdsToShapefile(updatedFile)

  const { shapefile } = useEdscStore.getState()
  const { saveShapefile } = shapefile

  // Save the shapefile to the store
  saveShapefile({
    file: fileWithIds,
    filename,
    size
  })

  // Emit the add shapefile event
  eventEmitter.emitBuffered(shapefileEventTypes.ADDSHAPEFILE, file, fileWithIds, updateQuery)
}

export default addShapefile
