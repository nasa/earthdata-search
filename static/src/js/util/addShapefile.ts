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
const addShapefile = async ({
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
  await saveShapefile({
    file: fileWithIds,
    filename,
    size
  })

  // This promise resolves once the shapefileId is set in the store.
  // This ensures that the `saveShapefile` logic is fully complete before emitting the event
  // and returning from this function. This means that functions calling `addShapefile` can
  // safely assume the shapefile is fully saved once this promise resolves.
  return new Promise<void>((resolve) => {
    // Subscribe to the store to watch for the shapefileId to be set
    const unsubscribe = useEdscStore.subscribe(
      // Selector function to get the current shapefileId. This value is passed to the callback below
      (state) => state.shapefile.shapefileId,
      // When the shapefileId changes, this callback function is called
      (shapefileId) => {
        // If the shapefileId is set, emit the event and resolve the promise
        if (shapefileId) {
          // Emit the add shapefile event
          eventEmitter.emitBuffered(
            shapefileEventTypes.ADDSHAPEFILE,
            file,
            fileWithIds,
            updateQuery
          )

          // Resolve the promise to indicate completion
          resolve()

          // Unsubscribe from the store updates to avoid memory leaks
          unsubscribe()
        }
      }
    )
  })
}

export default addShapefile
