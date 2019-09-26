export const determineCollectionEnvironment = (collectionsByEnv, collectionId) => {
  console.log(`Looking for ${collectionId}...`)

  const {
    sit: sitCollections = {},
    uat: uatCollections = {},
    prod: prodCollections = {}
  } = collectionsByEnv

  if (Object.keys(sitCollections).includes(collectionId)) {
    console.log(`${collectionId} FOUND in SIT`)

    return {
      environment: 'sit',
      collectionMetadata: sitCollections[collectionId]
    }
  }

  if (Object.keys(uatCollections).includes(collectionId)) {
    console.log(`${collectionId} FOUND in UAT`)

    return {
      environment: 'uat',
      collectionMetadata: uatCollections[collectionId]
    }
  }

  if (Object.keys(prodCollections).includes(collectionId)) {
    console.log(`${collectionId} FOUND in PROD`)

    return {
      environment: 'prod',
      collectionMetadata: prodCollections[collectionId]
    }
  }

  console.log(`${collectionId} not found.`)

  return false
}
