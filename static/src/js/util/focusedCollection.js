const getFocusedCollectionMetadata = (collectionId, collections) => {
  const collection = collections.byId[collectionId]

  if (!collection) return {}

  return {
    [collectionId]: collection
  }
}

export default getFocusedCollectionMetadata
