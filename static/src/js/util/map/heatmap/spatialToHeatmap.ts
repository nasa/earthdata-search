import { findLast } from 'lodash-es'
import useEdscStore from '../../../zustand/useEdscStore'

/**
 * Test data conversion from granule measurement frequency to heatmap color
 */
async function spatialToHeatmap() {
  // Get the state
  const state = useEdscStore.getState()

  // Get the functions to target a specific collection in CMR
  const setCollectionId = state.collection.setCollectionId
  const getCollectionMetadata = state.collection.getCollectionMetadata

  await setCollectionId('C2763266360-LPCLOUD')
  await getCollectionMetadata()

  // Get the updated state
  const updatedState = useEdscStore.getState()

  // Get the granules of the C2763266360-LPCLOUD collection
  updatedState.granules.getGranules()

  // Get the final data state
  const finalState = useEdscStore.getState()

  // Store the granules
  const granules = finalState.granules.granules.items

  console.log(granules)
}

export default spatialToHeatmap

/**
 * Add the spatialToHeatmap function to the window object for testing
 */
window.onload = () => {
  const executeSpatialToHeatmap = {
    runSpatialToHeatmap: spatialToHeatmap
  }
  Object.assign(window, executeSpatialToHeatmap)
}
