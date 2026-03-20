import useEdscStore from '../../../zustand/useEdscStore'

const COLOR_PARTITIONS = new Array(6)
const HEATMAP = new Array(5)

/**
 * Create an array that stores all granules within the index that
 * represents their color category
 * 0 = Blue = low frequency
 * ...
 * 5 = Orange = high frequency
 */
function constructHeatmap() {
  const state = useEdscStore.getState()
  const granules = state.granules.granules.items

  // Loop through the list of granules and insert them into their proper categories
  for (let i = 0; i < granules.length; i += 1) {
    for (let j = 0; i < COLOR_PARTITIONS.length; j += 1) {
      if (granules[i] < COLOR_PARTITIONS[j]) {
        HEATMAP.push(granules[i])
      }
    }
  }
}

/**
 * Create the color scale for this collection
 * Color scale will have 5 colors:
 * Blue = low frequency
 * Light Blue
 * White
 * Light Orange
 * Orange = high frequency
 */
function createFrequencyScale() {
  const state = useEdscStore.getState()
  const collection = state.collection.collectionMetadata['C2408750690-LPCLOUD']

  // Convert the start and end times to a numeric representation
  const numericStartTime = Date.parse(collection.timeStart)
  const numericEndTime = Date.parse(collection.timeEnd)

  // Calculate the partition size for this collection
  const partitionSize = Math.ceil((numericEndTime - numericStartTime) / 5.0)

  // Assign the partition values
  let indexCounter = 0
  for (let i = numericStartTime; i < numericEndTime + partitionSize; i += partitionSize) {
    COLOR_PARTITIONS[indexCounter] = i
    indexCounter += 1
  }
}

/**
 * Test data conversion from granule measurement frequency to heatmap color
 */
async function spatialToHeatmap() {
  // Get the state
  const state = useEdscStore.getState()

  // Get the functions to target a specific collection in CMR
  const setCollectionId = state.collection.setCollectionId
  const getCollectionMetadata = state.collection.getCollectionMetadata

  await setCollectionId('C2408750690-LPCLOUD')
  await getCollectionMetadata()

  // Get the updated state
  const updatedState = useEdscStore.getState()

  // Get the granules of the C2408750690-LPCLOUD collection
  updatedState.granules.getGranules()

  createFrequencyScale()
  constructHeatmap()

  console.log(`COLOR_PARTITIONS: ${COLOR_PARTITIONS}`)
  console.log(`HEATMAP: ${HEATMAP}`)
}

export default {
  spatialToHeatmap,
  COLOR_PARTITIONS,
  HEATMAP
}

/**
 * Add the spatialToHeatmap function to the window object for testing
 */
window.onload = () => {
  const executeSpatialToHeatmap = {
    runSpatialToHeatmap: spatialToHeatmap
  }
  Object.assign(window, executeSpatialToHeatmap)
}
