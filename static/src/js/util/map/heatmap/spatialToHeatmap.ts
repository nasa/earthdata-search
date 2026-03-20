import useEdscStore from '../../../zustand/useEdscStore'

const COLOR_PARTITIONS = new Array(6)

/**
 * The heatmap has to be an array of exactly 5 arrays, 1 for each color in the
 * frequency scale for holding granules that belong to that color's
 * category
 */
const HEATMAP = Array.from({ length: 5 }, () => [])

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
    for (let j = 0; j < COLOR_PARTITIONS.length; j += 1) {
      if (Date.parse(granules[i].timeStart) < COLOR_PARTITIONS[j]) {
        HEATMAP[j - 1].push(granules[i])
        console.log(`
          i: ${i}\n
          j: ${j}\n
          granules[i]: ${granules[i]}\n
          HEATMAP: ${HEATMAP.toString()}
        `)
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
  const collection = state.collection.collectionMetadata['C1327985645-ASF']

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

  await setCollectionId('C1327985645-ASF')
  await getCollectionMetadata()

  // Get the updated state
  const updatedState = useEdscStore.getState()

  // Get the granules of the C1327985645-ASF collection
  updatedState.granules.getGranules()

  createFrequencyScale()
  constructHeatmap()
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
