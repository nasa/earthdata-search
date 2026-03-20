import useEdscStore from '../../../zustand/useEdscStore'

/**
 * Test data conversion from granule measurement frequency to heatmap color
 */
async function getTestCollection() {
  // Get the state
  const state = useEdscStore.getState()

  // Get the functions to target a specific collection in CMR
  const setCollectionId = state.collection.setCollectionId
  const getCollectionMetadata = state.collection.getCollectionMetadata

  await setCollectionId('C2763266360-LPCLOUD')
  await getCollectionMetadata()

  // Get the updated state
  const updatedState = useEdscStore.getState()

  console.log(updatedState.collection.collectionMetadata['C2763266360-LPCLOUD'])

  // Get the collections of the C2763266360-LPCLOUD collection
  //const testGranules = updatedState.granules.granules.items

  //console.log(testGranules)
}

export default getTestCollection

window.onload = () => {
  const executeGetTestCollection = {
    runTestCollection: getTestCollection
  }
  Object.assign(window, executeGetTestCollection)
}
