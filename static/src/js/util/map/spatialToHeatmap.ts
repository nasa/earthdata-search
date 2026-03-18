import useEdscStore from '../../zustand/useEdscStore'

/**
 * Test data conversion from granule measurement frequency to heatmap color
 */
async function getTestCollection() {
  // Get the state
  let state = useEdscStore.getState()

  // Get the functions to target a specific collection in CMR
  const setCollectionId = state.collection.setCollectionId
  const getCollectionMetadata = state.collection.getCollectionMetadata

  setCollectionId('C2763266360-LPCLOUD')
  getCollectionMetadata()

  // Get the updated state
  state = useEdscStore.getState()

  // Get the collections of the C2763266360-LPCLOUD collection
  const testGranules = state.granules.granules.items

  console.log(testGranules)
}

// Test heatmap conversion
getTestCollection()
