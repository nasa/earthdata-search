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
 * @param {boolean} [params.delayMapMove=false] - Whether to delay the map move event
 * @param {Object} params.file - The shapefile as a GeoJSON FeatureCollection
 * @param {string} params.filename - The name of the shapefile
 * @param {string} params.size - The size of the shapefile
 */
const addShapefile = ({
  delayMapMove = false,
  file,
  filename,
  size
}: {
  delayMapMove?: boolean,
  file: ShapefileFile,
  filename: string,
  size: string
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

  if (delayMapMove) {
    // Coming from nlp, this is getting triggered before the map is actually ready, so the
    // movemap event doesn't end up centering the map on the file. This setTimeout delays
    // the event emission to allow the map to be ready.
    setTimeout(() => {
      eventEmitter.emit(shapefileEventTypes.ADDSHAPEFILE, file, fileWithIds, false)
    }, 1000)
  } else {
    eventEmitter.emit(shapefileEventTypes.ADDSHAPEFILE, file, fileWithIds)
  }
}

export default addShapefile
