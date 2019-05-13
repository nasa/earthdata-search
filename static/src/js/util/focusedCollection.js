const getFocusedCollectionMetadata = (collectionId, collections) => {
  const collection = collections.byId[collectionId]

  if (!collection) return {}

  const { metadata } = collection

  return {
    [collectionId]: metadata
  }
}

export default getFocusedCollectionMetadata
