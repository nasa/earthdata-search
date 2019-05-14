const getFocusedCollectionMetadata = (collectionId, collections) => {
  if (!collections) return {}

  const collection = collections.byId[collectionId]

  if (!collection) return {}

  return {
    [collectionId]: {
      ...collection
    }
  }
}

export default getFocusedCollectionMetadata
